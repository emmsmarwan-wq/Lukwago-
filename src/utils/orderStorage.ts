import { MenuItem, RESTAURANT_INFO } from '../data/menuData';

export interface StoredOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  image?: string;
}

export interface StoredOrder {
  id: string;
  createdAt: number;
  orderMode: 'dine-in' | 'takeaway' | 'delivery';
  items: StoredOrderItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  grandTotal: number;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  deliveryAddress?: string;
  deliveryLandmark?: string;
  deliveryZoneName?: string;
  orderNotes?: string;
  gpsCoords?: { latitude: number; longitude: number };
}

const ORDERS_KEY = 'papaz_spot_order_history_v1';
const FAVORITES_KEY = 'papaz_spot_favorites_v1';

// --- ORDER HISTORY HELPERS ---

export function getOrderHistory(): StoredOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.createdAt - a.createdAt);
    }
    return [];
  } catch (err) {
    console.error('Failed to read order history from localStorage:', err);
    return [];
  }
}

export function saveOrderToHistory(order: StoredOrder): StoredOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getOrderHistory();
    // Keep up to 25 recent orders
    const updated = [order, ...current.filter((o) => o.id !== order.id)].slice(0, 25);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
    return [];
  }
}

export function clearOrderHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ORDERS_KEY);
  } catch (err) {
    console.error('Failed to clear order history:', err);
  }
}

export interface OrderTrackingStatus {
  step: number; // 1 to 4
  statusTitle: string;
  statusDesc: string;
  progressPercent: number;
  isCompleted: boolean;
  estimatedRemainingMins: number;
  badgeColor: string;
}

export function getOrderStatus(order: StoredOrder, currentTime: number = Date.now()): OrderTrackingStatus {
  const elapsedMinutes = Math.max(0, Math.floor((currentTime - order.createdAt) / 60000));

  if (elapsedMinutes < 3) {
    return {
      step: 1,
      statusTitle: 'Order Received & Verified',
      statusDesc: 'Papaz kitchen received your order and queued the preparation.',
      progressPercent: 25,
      isCompleted: false,
      estimatedRemainingMins: Math.max(1, 25 - elapsedMinutes),
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
    };
  } else if (elapsedMinutes < 15) {
    return {
      step: 2,
      statusTitle: 'Chef Steaming & Preparing',
      statusDesc: 'Tender Luwombo steaming in banana leaves & fresh sides on the griddle.',
      progressPercent: 55,
      isCompleted: false,
      estimatedRemainingMins: Math.max(1, 25 - elapsedMinutes),
      badgeColor: 'text-orange-400 bg-orange-950/60 border-orange-800/60'
    };
  } else if (elapsedMinutes < 30) {
    let title = 'Rider Dispatched & On The Way';
    let desc = `Boda rider dispatched to ${order.deliveryZoneName || 'your address'}.`;
    if (order.orderMode === 'takeaway') {
      title = 'Packed & Ready for Pick-up';
      desc = 'Your hot boxed food is waiting for you at the Papaz Spot pick-up counter.';
    } else if (order.orderMode === 'dine-in') {
      title = 'Serving to Your Table';
      desc = `Waiter is bringing fresh platters to ${order.tableNumber ? `Table ${order.tableNumber}` : 'your table'}.`;
    }
    return {
      step: 3,
      statusTitle: title,
      statusDesc: desc,
      progressPercent: 85,
      isCompleted: false,
      estimatedRemainingMins: Math.max(1, 30 - elapsedMinutes),
      badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-800/60'
    };
  } else {
    return {
      step: 4,
      statusTitle: 'Delivered & Served',
      statusDesc: 'Order fulfilled! "Better food, better mood." Enjoy your authentic Ugandan feast.',
      progressPercent: 100,
      isCompleted: true,
      estimatedRemainingMins: 0,
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
    };
  }
}

// --- FAVORITES HELPERS ---

export function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read favorites from localStorage:', err);
    return [];
  }
}

export function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Failed to save favorites to localStorage:', err);
  }
}

export function toggleStoredFavorite(itemId: string): { favorites: string[]; isFav: boolean } {
  const current = getStoredFavorites();
  const exists = current.includes(itemId);
  const updated = exists ? current.filter((id) => id !== itemId) : [...current, itemId];
  saveFavorites(updated);
  return { favorites: updated, isFav: !exists };
}
