import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDocFromServer,
  onSnapshot,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StoredOrder } from '../utils/orderStorage';

// 1. Initialize Firebase app and Firestore instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 2. Strict Error Handling conforming to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 3. Test connection on boot per skill mandate
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or database initializing.");
    }
    return false;
  }
}

// Test connection silently in the background
if (typeof window !== 'undefined') {
  testConnection().catch(() => {});
}

// 4. Firestore Order & Review Data Models
export interface FirestoreOrderRecord {
  id: string;
  orderMode: 'dine-in' | 'takeaway' | 'delivery';
  customerName: string;
  customerPhone: string;
  tableNumber?: string | null;
  deliveryAddress?: string | null;
  deliveryZone?: string | null;
  deliveryFee?: number;
  notes?: string | null;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
  subtotal: number;
  grandTotal: number;
  status: 'received' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'airtel-money' | 'mtn-momo';
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerReviewRecord {
  id: string;
  customerName: string;
  dishName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// 5. High-level Database Operations

/**
 * Persists an order to Firestore in real time
 */
export async function createOrderInFirestore(order: StoredOrder): Promise<FirestoreOrderRecord> {
  const path = `orders/${order.id}`;
  const nowIso = new Date(order.createdAt || Date.now()).toISOString();

  const record: FirestoreOrderRecord = {
    id: order.id,
    orderMode: order.orderMode,
    customerName: (order.customerName && order.customerName.trim().length >= 2) 
      ? order.customerName.trim().slice(0, 100) 
      : 'Papaz Guest Customer',
    customerPhone: (order.customerPhone && order.customerPhone.trim().length >= 7)
      ? order.customerPhone.trim().slice(0, 25)
      : '256700000000',
    tableNumber: order.tableNumber ? order.tableNumber.slice(0, 20) : null,
    deliveryAddress: order.deliveryAddress ? order.deliveryAddress.slice(0, 250) : null,
    deliveryZone: order.deliveryZoneName ? order.deliveryZoneName.slice(0, 100) : null,
    deliveryFee: order.deliveryFee || 0,
    notes: order.orderNotes ? order.orderNotes.slice(0, 500) : null,
    items: order.items.map((i) => ({
      id: i.id.slice(0, 64),
      name: i.name.slice(0, 100),
      price: i.price,
      quantity: i.quantity,
      notes: i.notes ? i.notes.slice(0, 200) : undefined
    })),
    subtotal: order.subtotal,
    grandTotal: order.grandTotal,
    status: 'received',
    paymentMethod: 'cash',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  try {
    const orderDocRef = doc(db, 'orders', order.id);
    await setDoc(orderDocRef, record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Updates order progress status in real time (e.g. from Kitchen Display)
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: 'received' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled'
): Promise<void> {
  const path = `orders/${orderId}`;
  const updatedAt = new Date().toISOString();
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status,
      updatedAt
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Real-time subscription to a specific order
 */
export function subscribeToOrder(
  orderId: string,
  onUpdate: (order: FirestoreOrderRecord | null) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `orders/${orderId}`;
  const orderDocRef = doc(db, 'orders', orderId);

  return onSnapshot(
    orderDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as FirestoreOrderRecord);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Real-time subscription to active orders for Kitchen / Live Manager Display
 */
export function subscribeToKitchenOrders(
  onUpdate: (orders: FirestoreOrderRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'orders';
  const ordersQuery = query(collection(db, 'orders'), limit(50));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data() as FirestoreOrderRecord);
      // Sort client-side by createdAt descending
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(orders);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Real-time subscription to customer reviews
 */
export function subscribeToReviews(
  onUpdate: (reviews: CustomerReviewRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'reviews';
  const reviewsQuery = query(collection(db, 'reviews'), limit(20));

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs.map(doc => doc.data() as CustomerReviewRecord);
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(reviews);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Submit a customer dish review to Firestore
 */
export async function submitReviewToFirestore(review: {
  customerName: string;
  dishName?: string;
  rating: number;
  comment: string;
}): Promise<CustomerReviewRecord> {
  const id = `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const path = `reviews/${id}`;
  const record: CustomerReviewRecord = {
    id,
    customerName: review.customerName.trim().slice(0, 80),
    dishName: review.dishName ? review.dishName.trim().slice(0, 120) : undefined,
    rating: Math.min(5, Math.max(1, Math.round(review.rating))),
    comment: review.comment.trim().slice(0, 500),
    createdAt: new Date().toISOString()
  };

  try {
    const revDocRef = doc(db, 'reviews', id);
    await setDoc(revDocRef, record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
