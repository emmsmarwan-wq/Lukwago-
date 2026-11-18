import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, Phone, MessageSquare, 
  MapPin, Navigation, CheckCircle2, AlertCircle, UtensilsCrossed,
  Bike, Store, Sparkles, ExternalLink, History, Clock, RotateCcw,
  Copy, Check, ChefHat, ArrowRight, ChevronRight, Search
} from 'lucide-react';
import { RESTAURANT_INFO, MenuItem, DELIVERY_ZONES, DeliveryZone, MENU_ITEMS } from '../data/menuData';
import { 
  StoredOrder, getOrderHistory, saveOrderToHistory, 
  clearOrderHistory, getOrderStatus, OrderTrackingStatus 
} from '../utils/orderStorage';
import { 
  createOrderInFirestore, 
  subscribeToOrder, 
  FirestoreOrderRecord 
} from '../lib/firebase';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedPrice: number;
  notes?: string;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onReorderItems?: (items: { item: MenuItem; quantity: number; selectedPrice: number; notes?: string }[]) => void;
  orderMode: 'dine-in' | 'takeaway' | 'delivery';
  onOrderModeChange: (mode: 'dine-in' | 'takeaway' | 'delivery') => void;
  currency: string;
  tableNumber?: string;
  initialTab?: 'tray' | 'history' | 'tracker';
}

interface GPSCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onReorderItems,
  orderMode,
  onOrderModeChange,
  currency,
  tableNumber,
  initialTab = 'tray',
}) => {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'tray' | 'tracker' | 'history'>(initialTab);

  // Customer & order fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumberInput, setTableNumberInput] = useState(tableNumber || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ntinda');
  const [orderNotes, setOrderNotes] = useState('');

  // GPS Location state
  const [gpsCoords, setGpsCoords] = useState<GPSCoords | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // History & Tracker state
  const [orderHistory, setOrderHistory] = useState<StoredOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Load orders on open
  useEffect(() => {
    if (isOpen) {
      const history = getOrderHistory();
      setOrderHistory(history);
      if (history.length > 0 && !selectedOrderId) {
        setSelectedOrderId(history[0].id);
      }
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  // Sync table number
  useEffect(() => {
    if (tableNumber) {
      setTableNumberInput(tableNumber);
    }
  }, [tableNumber]);

  // Live timer tick for tracker
  useEffect(() => {
    if (!isOpen || activeTab !== 'tracker') return;
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000); // update every 15s
    return () => clearInterval(interval);
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Selected delivery zone
  const activeZone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[2];

  // Pricing calculations
  const subtotal = cart.reduce((acc, curr) => acc + curr.selectedPrice * curr.quantity, 0);
  
  // Packaging fee: applicable for takeaway and delivery
  const packagingFee = (orderMode === 'takeaway' || orderMode === 'delivery') && cart.length > 0 
    ? RESTAURANT_INFO.takeawayPackingFee 
    : 0;

  // Delivery fee: only applicable for delivery
  const deliveryFee = orderMode === 'delivery' && cart.length > 0 ? activeZone.fee : 0;
  
  const grandTotal = subtotal + packagingFee + deliveryFee;

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usd = (amount / 3750).toFixed(2);
      return `$${usd}`;
    }
    return `${amount.toLocaleString()} UGX`;
  };

  // Browser Geolocation capture
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        setGpsCoords({ latitude, longitude, accuracy });
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please enter your address below.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Location signal unavailable. Please specify your area.');
        } else {
          setLocationError('Unable to retrieve location. Please type your address.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Handle WhatsApp order checkout & saving to localStorage
  const handleSendOrder = () => {
    const orderId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: StoredOrder = {
      id: orderId,
      createdAt: Date.now(),
      orderMode,
      items: cart.map((c) => ({
        id: c.item.id,
        name: c.item.name,
        price: c.selectedPrice,
        quantity: c.quantity,
        notes: c.notes,
        image: c.item.image,
      })),
      subtotal,
      packagingFee,
      deliveryFee,
      grandTotal,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      tableNumber: orderMode === 'dine-in' ? (tableNumberInput.trim() || '01') : undefined,
      deliveryAddress: orderMode === 'delivery' ? deliveryAddress.trim() : (orderMode === 'takeaway' ? deliveryAddress.trim() : undefined),
      deliveryLandmark: orderMode === 'delivery' ? deliveryLandmark.trim() : undefined,
      deliveryZoneName: orderMode === 'delivery' ? activeZone.name : undefined,
      orderNotes: orderNotes.trim() || undefined,
      gpsCoords: gpsCoords || undefined,
    };

    // Save to localStorage
    const updated = saveOrderToHistory(newOrder);
    setOrderHistory(updated);
    setSelectedOrderId(orderId);

    // Save to Firestore Database in real time
    createOrderInFirestore(newOrder).catch((err) => {
      console.warn('Real-time Firestore order sync background notice:', err);
    });

    // Build WhatsApp message
    let message = `*🍽️ ORDER #${orderId} FOR PAPAZ SPOT*\n`;
    message += `_"better food, better mood" - Open 24 Hours_\n\n`;

    if (orderMode === 'delivery') {
      message += `*ORDER TYPE:* 🛵 Doorstep Delivery\n`;
      if (customerName) message += `*Customer:* ${customerName}\n`;
      if (customerPhone) message += `*Contact Phone:* ${customerPhone}\n`;
      message += `*Delivery Area:* ${activeZone.name} (Fee: ${activeZone.fee.toLocaleString()} UGX)\n`;
      if (deliveryAddress) message += `*Delivery Address:* ${deliveryAddress}\n`;
      if (deliveryLandmark) message += `*Landmark/Building:* ${deliveryLandmark}\n`;
      if (gpsCoords) {
        message += `*📍 GPS Map Pin:* https://maps.google.com/?q=${gpsCoords.latitude.toFixed(6)},${gpsCoords.longitude.toFixed(6)}\n`;
      }
    } else if (orderMode === 'takeaway') {
      message += `*ORDER TYPE:* 🥡 Take Away (Self Pick-up)\n`;
      if (customerName) message += `*Customer:* ${customerName}\n`;
      if (customerPhone) message += `*Contact Phone:* ${customerPhone}\n`;
      if (deliveryAddress) message += `*Pickup Time / Notes:* ${deliveryAddress}\n`;
    } else {
      message += `*ORDER TYPE:* 🍽️ Dine In\n`;
      if (customerName) message += `*Customer:* ${customerName}\n`;
      message += `*Table / Counter:* ${tableNumberInput || 'Main Hall'}\n`;
    }

    message += `\n*Ordered Items:*\n`;
    cart.forEach((c) => {
      message += `• ${c.quantity}x ${c.item.name} (${(c.selectedPrice * c.quantity).toLocaleString()} UGX)\n`;
      if (c.notes) message += `   _Special note: ${c.notes}_\n`;
    });

    message += `\n*Bill Summary:*\n`;
    message += `• Food Subtotal: ${subtotal.toLocaleString()} UGX\n`;
    if (packagingFee > 0) {
      message += `• Take Away Packaging: ${packagingFee.toLocaleString()} UGX\n`;
    }
    if (deliveryFee > 0) {
      message += `• Delivery Fee (${activeZone.name}): ${deliveryFee.toLocaleString()} UGX\n`;
    }
    message += `• Groundnut (G.nuts) Sauce: FREE\n`;
    message += `*👉 GRAND TOTAL: ${grandTotal.toLocaleString()} UGX*\n`;

    if (orderNotes) {
      message += `\n*Kitchen / Delivery Instructions:* ${orderNotes}\n`;
    }

    message += `\nPayment: Cash or Mobile Money (MTN / Airtel to 0708300003)`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;

    // Switch view to tracker
    setActiveTab('tracker');

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  // Re-order past order into current tray
  const handleReorder = (order: StoredOrder) => {
    if (onReorderItems) {
      const reconstructed: CartItem[] = order.items.map((it) => {
        const found = MENU_ITEMS.find((m) => m.id === it.id);
        const fallbackItem: MenuItem = found || {
          id: it.id,
          name: it.name,
          category: 'main',
          price: it.price,
          description: 'Re-ordered favorite from Papaz Spot',
          image: it.image || '/src/assets/images/hero_papaz_feast_1793271703559.jpg',
        };
        return {
          item: fallbackItem,
          quantity: it.quantity,
          selectedPrice: it.price,
          notes: it.notes,
        };
      });

      onReorderItems(reconstructed);
      if (order.orderMode) {
        onOrderModeChange(order.orderMode);
      }
      setReorderSuccess(order.id);
      setTimeout(() => {
        setReorderSuccess(null);
        setActiveTab('tray');
      }, 700);
    }
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Currently selected tracked order
  const currentTrackedOrder = useMemo(() => {
    if (!selectedOrderId && orderHistory.length > 0) return orderHistory[0];
    return orderHistory.find((o) => o.id === selectedOrderId) || orderHistory[0] || null;
  }, [selectedOrderId, orderHistory]);

  // Real-time Firestore record for live status updates from kitchen
  const [firestoreRecord, setFirestoreRecord] = useState<FirestoreOrderRecord | null>(null);

  useEffect(() => {
    if (!currentTrackedOrder?.id) {
      setFirestoreRecord(null);
      return;
    }

    const unsub = subscribeToOrder(
      currentTrackedOrder.id,
      (record) => {
        setFirestoreRecord(record);
      },
      () => {
        // Fallback gracefully to local calculation
      }
    );

    return () => {
      unsub();
    };
  }, [currentTrackedOrder?.id]);

  const trackingStatus: OrderTrackingStatus | null = useMemo(() => {
    if (!currentTrackedOrder) return null;
    const baseStatus = getOrderStatus(currentTrackedOrder, currentTime);

    // If Firestore has live status updated by kitchen staff, prioritize it!
    if (firestoreRecord) {
      if (firestoreRecord.status === 'received') {
        return {
          step: 1,
          statusTitle: 'Order Received & Verified',
          statusDesc: 'Papaz kitchen received your order and queued preparation in our live database.',
          progressPercent: 25,
          isCompleted: false,
          estimatedRemainingMins: 25,
          badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
        };
      } else if (firestoreRecord.status === 'preparing') {
        return {
          step: 2,
          statusTitle: 'Chef Steaming & Preparing',
          statusDesc: 'Kitchen updated: Your luwombo is steaming in banana leaves & rolex is on the hot griddle.',
          progressPercent: 60,
          isCompleted: false,
          estimatedRemainingMins: 15,
          badgeColor: 'text-orange-400 bg-orange-950/60 border-orange-800/60'
        };
      } else if (firestoreRecord.status === 'dispatched') {
        const title = currentTrackedOrder.orderMode === 'dine-in' 
          ? 'Serving to Your Table' 
          : (currentTrackedOrder.orderMode === 'takeaway' ? 'Ready at Pick-up Counter' : 'Rider Dispatched & On The Way');
        const desc = currentTrackedOrder.orderMode === 'dine-in'
          ? `Waiter bringing fresh platters to Table ${currentTrackedOrder.tableNumber || '01'}.`
          : (currentTrackedOrder.orderMode === 'takeaway' ? 'Hot packaged food waiting at Papaz Spot counter.' : `Boda rider dispatched to ${currentTrackedOrder.deliveryZoneName || 'your address'}.`);
        return {
          step: 3,
          statusTitle: title,
          statusDesc: desc,
          progressPercent: 88,
          isCompleted: false,
          estimatedRemainingMins: 5,
          badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-800/60'
        };
      } else if (firestoreRecord.status === 'delivered') {
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

    return baseStatus;
  }, [currentTrackedOrder, currentTime, firestoreRecord]);

  // Filtered orders list for history tab
  const filteredHistory = useMemo(() => {
    if (!orderSearchQuery.trim()) return orderHistory;
    const q = orderSearchQuery.toLowerCase().trim();
    return orderHistory.filter((o) => 
      o.id.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q)) ||
      o.deliveryZoneName?.toLowerCase().includes(q)
    );
  }, [orderHistory, orderSearchQuery]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#16171C] border-l border-stone-800 h-full flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-[#121316] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-600/10 text-orange-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Papaz Spot Orders</h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>{cart.reduce((a, b) => a + b.quantity, 0)} items in tray</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">Open 24/7</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close tray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Feature Segmented Tabs */}
        <div className="p-2.5 bg-[#181920] border-b border-stone-800 grid grid-cols-3 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tray')}
            className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tray'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My Tray</span>
            {cart.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                activeTab === 'tray' ? 'bg-black/30 text-white' : 'bg-orange-600 text-white'
              }`}>
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tracker'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Tracker</span>
            {orderHistory.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Order History</span>
            {orderHistory.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                activeTab === 'history' ? 'bg-black/30 text-white' : 'bg-stone-800 text-stone-300'
              }`}>
                {orderHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CURRENT TRAY */}
        {activeTab === 'tray' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 3-Mode Dining / Ordering Selector */}
            <div className="p-4 bg-[#1A1B22] border-b border-stone-800 shrink-0">
              <label className="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">
                Choose Order Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#121316] p-1 rounded-xl border border-stone-800">
                <button
                  onClick={() => onOrderModeChange('dine-in')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                    orderMode === 'dine-in'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Dine In</span>
                </button>
                <button
                  onClick={() => onOrderModeChange('takeaway')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                    orderMode === 'takeaway'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Pick-up</span>
                  <span className="text-[9px] opacity-80 font-mono">(+1,000/=)</span>
                </button>
                <button
                  onClick={() => onOrderModeChange('delivery')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                    orderMode === 'delivery'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                  <span className="text-[9px] opacity-80 font-mono">(Doorstep)</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content: Items List + Customer & Delivery Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Items in Cart */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  <span>Order Items ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                  {cart.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="text-stone-500 hover:text-stone-300 normal-case font-normal flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear tray</span>
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center bg-[#1A1B22] rounded-xl border border-stone-800 text-stone-500 space-y-3">
                    <UtensilsCrossed className="w-10 h-10 mx-auto text-stone-700" />
                    <div>
                      <p className="text-sm font-semibold text-stone-300">Your tray is empty</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        Add Luwombo, Rolex, Pilau or fresh fruit juices to place your order.
                      </p>
                    </div>
                    {orderHistory.length > 0 && (
                      <button
                        onClick={() => setActiveTab('history')}
                        className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-orange-400 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>View Past Orders ({orderHistory.length})</span>
                      </button>
                    )}
                  </div>
                ) : (
                  cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="p-3 bg-[#1F2026] border border-stone-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">{cartItem.item.name}</h4>
                          <div className="text-xs text-stone-400 font-mono tabular-nums">
                            {formatPrice(cartItem.selectedPrice)} each
                          </div>
                          {cartItem.notes && (
                            <p className="text-xs text-orange-400/90 italic mt-0.5">
                              Note: {cartItem.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(cartItem.item.id)}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                        <div className="text-xs font-mono font-bold text-stone-300">
                          Total: {formatPrice(cartItem.selectedPrice * cartItem.quantity)}
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#16171C] border border-stone-700 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-mono font-bold text-white">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-orange-600 hover:bg-orange-500 text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Customer & Location Details Form (Only when items exist) */}
              {cart.length > 0 && (
                <div className="space-y-4 pt-2">
                  {/* Delivery Zone & Location Section (When orderMode === 'delivery') */}
                  {orderMode === 'delivery' && (
                    <div className="p-4 bg-[#1B1D24] border border-orange-500/30 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                          <Bike className="w-4 h-4" />
                          <span>Delivery Location &amp; Fee</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                          +{formatPrice(activeZone.fee)} fee
                        </span>
                      </div>

                      {/* 1-Click GPS Location Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          disabled={isLocating}
                          className="w-full py-2.5 px-3 bg-orange-600/15 hover:bg-orange-600/25 border border-orange-500/40 rounded-lg text-xs font-semibold text-orange-300 flex items-center justify-center gap-2 transition-colors active:scale-98"
                        >
                          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                          <span>{isLocating ? 'Pinning your current GPS location...' : 'Pin My Exact GPS Location'}</span>
                        </button>

                        {gpsCoords && (
                          <div className="mt-2 p-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">
                                GPS Pinned ({gpsCoords.latitude.toFixed(4)}, {gpsCoords.longitude.toFixed(4)})
                              </span>
                            </div>
                            <a
                              href={`https://maps.google.com/?q=${gpsCoords.latitude},${gpsCoords.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] underline flex items-center gap-0.5 text-emerald-400 shrink-0 hover:text-white"
                            >
                              <span>Map</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}

                        {locationError && (
                          <div className="mt-2 p-2 bg-red-950/40 border border-red-800/40 rounded-lg flex items-center gap-1.5 text-xs text-red-300">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{locationError}</span>
                          </div>
                        )}
                      </div>

                      {/* Delivery Area / Zone Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Kampala Delivery Area:
                        </label>
                        <select
                          value={selectedZoneId}
                          onChange={(e) => setSelectedZoneId(e.target.value)}
                          className="w-full bg-[#121316] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        >
                          {DELIVERY_ZONES.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name} — {zone.fee.toLocaleString()} UGX ({zone.estimatedTime})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Street Address & Building Landmark */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Street Address &amp; House/Building:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bukoto Street, Apartment 4B, Plot 18"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full bg-[#121316] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Prominent Landmark (for Delivery Rider):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Opposite Total Energies, near Shell, gate with black pillars"
                          value={deliveryLandmark}
                          onChange={(e) => setDeliveryLandmark(e.target.value)}
                          className="w-full bg-[#121316] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dine-In Table Input */}
                  {orderMode === 'dine-in' && (
                    <div className="p-3.5 bg-[#1B1D24] border border-stone-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Table Location</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Table Number (e.g. Table 04, Verandah, Counter)"
                        value={tableNumberInput}
                        onChange={(e) => setTableNumberInput(e.target.value)}
                        className="w-full bg-[#121316] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 font-mono font-medium"
                      />
                      <p className="text-[11px] text-stone-400">
                        Food will be brought directly to your table at Papaz Spot.
                      </p>
                    </div>
                  )}

                  {/* Takeaway Pick-up Input */}
                  {orderMode === 'takeaway' && (
                    <div className="p-3.5 bg-[#1B1D24] border border-stone-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                        <Store className="w-3.5 h-3.5" />
                        <span>Pick-up Time</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Estimated pickup time (e.g. in 20 minutes, 1:30 PM)"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#121316] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}

                  {/* Customer Contact Details */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#121316] border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone / WhatsApp Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#121316] border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Special kitchen or delivery instructions (e.g. extra hot chili, pack luwombo sauce separately)..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-[#121316] border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary & Order Actions */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-stone-800 bg-[#121316] space-y-3.5 shrink-0">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Items Subtotal</span>
                    <span className="font-mono font-medium text-stone-300 tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {packagingFee > 0 && (
                    <div className="flex justify-between text-stone-400">
                      <span>Take Away Packaging Charge</span>
                      <span className="font-mono font-medium text-orange-400 tabular-nums">
                        +{formatPrice(packagingFee)}
                      </span>
                    </div>
                  )}

                  {orderMode === 'delivery' && (
                    <div className="flex justify-between text-stone-300 font-medium">
                      <span className="flex items-center gap-1 text-orange-400">
                        <Bike className="w-3.5 h-3.5" />
                        <span>Delivery Fee ({activeZone.name.split('/')[0].trim()})</span>
                      </span>
                      <span className="font-mono font-bold text-orange-400 tabular-nums">
                        +{formatPrice(deliveryFee)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-400">
                    <span>Groundnut (G.nuts) Sauce</span>
                    <span className="text-emerald-400 font-medium">Included FREE</span>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-white">Grand Total</span>
                      {orderMode === 'delivery' && (
                        <div className="text-[10px] text-stone-400">Includes food + packaging + delivery</div>
                      )}
                    </div>
                    <span className="text-xl font-extrabold text-orange-400 font-mono tabular-nums">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp Action Button */}
                <button
                  type="button"
                  onClick={handleSendOrder}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    Send Order to WhatsApp &amp; Track ({RESTAURANT_INFO.phone})
                  </span>
                </button>

                {/* Direct Call Button */}
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="w-full py-2 px-4 rounded-xl font-medium text-xs text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700 border border-stone-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Papaz Spot for fast dispatch: {RESTAURANT_INFO.phone}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE ORDER TRACKER */}
        {activeTab === 'tracker' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {orderHistory.length === 0 ? (
              <div className="py-14 text-center bg-[#1A1B22] rounded-xl border border-stone-800 text-stone-500 space-y-3">
                <Clock className="w-10 h-10 mx-auto text-stone-700" />
                <h3 className="text-sm font-semibold text-white">No active orders to track</h3>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Once you place an order via WhatsApp or phone, you can track your meal's live preparation and delivery status here.
                </p>
                <button
                  onClick={() => setActiveTab('tray')}
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-500 transition-colors inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Build an Order</span>
                </button>
              </div>
            ) : currentTrackedOrder && trackingStatus ? (
              <div className="space-y-5">
                {/* Order Selector (if more than 1 order) */}
                {orderHistory.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[11px] text-stone-400 font-medium shrink-0">Orders:</span>
                    {orderHistory.slice(0, 5).map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors shrink-0 ${
                          currentTrackedOrder.id === o.id
                            ? 'bg-orange-600 text-white'
                            : 'bg-[#1F2026] text-stone-400 hover:text-white'
                        }`}
                      >
                        #{o.id}
                      </button>
                    ))}
                  </div>
                )}

                {/* Primary Tracking Card */}
                <div className="p-5 bg-[#1B1D24] border border-orange-500/30 rounded-2xl space-y-4 shadow-xl">
                  {/* Top order summary header */}
                  <div className="flex items-start justify-between gap-3 border-b border-stone-800/80 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-orange-400">
                          ORDER #{currentTrackedOrder.id}
                        </span>
                        <button
                          onClick={() => handleCopyOrderId(currentTrackedOrder.id)}
                          className="text-stone-400 hover:text-white transition-colors"
                          title="Copy order ID"
                        >
                          {copiedId === currentTrackedOrder.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                        <span>Placed {new Date(currentTrackedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {currentTrackedOrder.orderMode.toUpperCase()}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Cloud DB Synced
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${trackingStatus.badgeColor}`}>
                      {trackingStatus.statusTitle}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-stone-400 font-medium">
                      <span>Live Preparation Status</span>
                      <span className="text-orange-400 font-mono">
                        {trackingStatus.isCompleted ? 'Ready & Delivered' : `~${trackingStatus.estimatedRemainingMins} mins estimated`}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${trackingStatus.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* 4-Step Milestone Checklist */}
                  <div className="grid grid-cols-4 gap-2 text-center pt-2">
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        trackingStatus.step >= 1 ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-500'
                      }`}>
                        1
                      </div>
                      <span className={`text-[10px] block ${trackingStatus.step >= 1 ? 'text-stone-200 font-semibold' : 'text-stone-500'}`}>
                        Received
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        trackingStatus.step >= 2 ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-500'
                      }`}>
                        2
                      </div>
                      <span className={`text-[10px] block ${trackingStatus.step >= 2 ? 'text-stone-200 font-semibold' : 'text-stone-500'}`}>
                        Steaming
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        trackingStatus.step >= 3 ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-500'
                      }`}>
                        3
                      </div>
                      <span className={`text-[10px] block ${trackingStatus.step >= 3 ? 'text-stone-200 font-semibold' : 'text-stone-500'}`}>
                        {currentTrackedOrder.orderMode === 'delivery' ? 'On Road' : 'Ready'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        trackingStatus.step >= 4 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-500'
                      }`}>
                        4
                      </div>
                      <span className={`text-[10px] block ${trackingStatus.step >= 4 ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                        Served
                      </span>
                    </div>
                  </div>

                  {/* Status Description Box */}
                  <div className="p-3 bg-[#121316] rounded-xl border border-stone-800 text-xs text-stone-300 flex items-start gap-2.5">
                    <ChefHat className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{trackingStatus.statusDesc}</p>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2 pt-2 border-t border-stone-800/80">
                    <h5 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      Ordered Dishes ({currentTrackedOrder.items.reduce((a, b) => a + b.quantity, 0)})
                    </h5>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {currentTrackedOrder.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-stone-300">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-mono text-stone-400 tabular-nums">
                            {formatPrice(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total & Mode specific info */}
                  <div className="p-3 bg-[#16171C] rounded-xl border border-stone-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-400">
                      <span>Total Paid / Payable</span>
                      <span className="font-mono font-bold text-orange-400 tabular-nums">
                        {formatPrice(currentTrackedOrder.grandTotal)}
                      </span>
                    </div>
                    {currentTrackedOrder.deliveryZoneName && (
                      <div className="flex justify-between text-stone-400">
                        <span>Area</span>
                        <span className="text-stone-300 font-medium">{currentTrackedOrder.deliveryZoneName}</span>
                      </div>
                    )}
                    {currentTrackedOrder.tableNumber && (
                      <div className="flex justify-between text-stone-400">
                        <span>Table</span>
                        <span className="text-stone-300 font-medium">Table {currentTrackedOrder.tableNumber}</span>
                      </div>
                    )}
                    {currentTrackedOrder.gpsCoords && (
                      <div className="flex justify-between text-stone-400">
                        <span>GPS Pin</span>
                        <a
                          href={`https://maps.google.com/?q=${currentTrackedOrder.gpsCoords.latitude},${currentTrackedOrder.gpsCoords.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 underline flex items-center gap-1"
                        >
                          <span>Open in Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions: WhatsApp support on this order & 1-click Re-order */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(
                        `Hello Papaz Spot, checking status of my Order #${currentTrackedOrder.id}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp about Order #{currentTrackedOrder.id}</span>
                    </a>

                    <button
                      onClick={() => handleReorder(currentTrackedOrder)}
                      className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                      <span>{reorderSuccess === currentTrackedOrder.id ? 'Added to Tray!' : 'Re-order This Exact Meal'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            {/* Search orders */}
            {orderHistory.length > 0 && (
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search past orders (ID, dish, name)..."
                  className="w-full bg-[#1F2026] border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {/* Orders list */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="py-14 text-center bg-[#1A1B22] rounded-xl border border-stone-800 text-stone-500 space-y-2">
                  <History className="w-9 h-9 mx-auto text-stone-700" />
                  <p className="text-sm font-semibold text-stone-300">
                    {orderHistory.length === 0 ? 'No order history yet' : 'No matching orders found'}
                  </p>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    {orderHistory.length === 0 
                      ? 'Orders you submit are saved to your browser so you can easily track and re-order them anytime.'
                      : 'Try clearing your search term.'}
                  </p>
                </div>
              ) : (
                filteredHistory.map((order) => {
                  const status = getOrderStatus(order, currentTime);
                  return (
                    <div
                      key={order.id}
                      className="p-4 bg-[#1F2026] border border-stone-800 rounded-xl space-y-3 hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              #{order.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-stone-800 text-stone-300">
                              {order.orderMode}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${status.badgeColor}`}>
                          {status.statusTitle}
                        </span>
                      </div>

                      {/* Items preview */}
                      <div className="text-xs text-stone-300 space-y-0.5 py-1 border-t border-stone-800/80">
                        {order.items.slice(0, 3).map((it, i) => (
                          <div key={i} className="flex justify-between text-stone-400">
                            <span className="truncate max-w-[240px]">
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-mono text-stone-400 tabular-nums shrink-0">
                              {formatPrice(it.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-[11px] text-orange-400 pt-0.5">
                            +{order.items.length - 3} more dishes
                          </div>
                        )}
                      </div>

                      {/* Total & Action Buttons */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase">Total</span>
                          <div className="text-sm font-mono font-bold text-orange-400 tabular-nums">
                            {formatPrice(order.grandTotal)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setActiveTab('tracker');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 hover:text-white transition-colors"
                          >
                            Track
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-1 active:scale-95"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Re-order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear History button */}
            {orderHistory.length > 0 && (
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs text-stone-500 shrink-0">
                <span>Stored locally on this device</span>
                <button
                  onClick={() => {
                    if (window.confirm('Clear all order history from this device?')) {
                      clearOrderHistory();
                      setOrderHistory([]);
                      setSelectedOrderId(null);
                    }
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
