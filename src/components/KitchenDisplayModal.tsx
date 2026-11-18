import React, { useState, useEffect } from 'react';
import { 
  X, ChefHat, Clock, Phone, MapPin, Bike, Store, UtensilsCrossed, 
  CheckCircle2, AlertCircle, RefreshCw, Filter, Sparkles, Volume2, 
  ExternalLink, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';
import { 
  FirestoreOrderRecord, 
  subscribeToKitchenOrders, 
  updateOrderStatusInFirestore 
} from '../lib/firebase';
import { RESTAURANT_INFO } from '../data/menuData';

interface KitchenDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KitchenDisplayModal: React.FC<KitchenDisplayModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<FirestoreOrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'preparing' | 'dispatched' | 'delivered'>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    const unsubscribe = subscribeToKitchenOrders(
      (loadedOrders) => {
        setOrders(loadedOrders);
        setIsLoading(false);
      },
      (err) => {
        console.error('Failed to subscribe to kitchen orders:', err);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (orderId: string, newStatus: FirestoreOrderRecord['status']) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatusInFirestore(orderId, newStatus);
      setFeedbackMsg(`Order #${orderId} marked as ${newStatus.toUpperCase()}`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error('Error updating order status:', err);
      setFeedbackMsg(`Failed to update status`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return o.status === 'received' || o.status === 'preparing';
    return o.status === statusFilter;
  });

  const getStatusBadge = (status: FirestoreOrderRecord['status']) => {
    switch (status) {
      case 'received':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse"><Clock className="w-3 h-3" /> Received</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5"><Flame className="w-3 h-3" /> In Kitchen</span>;
      case 'dispatched':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5"><Bike className="w-3 h-3" /> Dispatched</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Fulfilled</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#14151B] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#1A1C24] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E05322] to-amber-600 flex items-center justify-center shadow-lg shadow-orange-950/40">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">PAPAZ SPOT LIVE KITCHEN DISPLAY</h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Cloud DB
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Real-time Firestore sync &bull; Orders placed by customers appear here automatically
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="px-6 py-3 bg-[#171820] border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-300">Filter:</span>
            <div className="flex items-center gap-1 bg-[#121318] p-1 rounded-xl border border-stone-800">
              {(['all', 'active', 'preparing', 'dispatched', 'delivered'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all capitalize ${
                    statusFilter === tab
                      ? 'bg-[#E05322] text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab === 'active' ? 'Active (Pending)' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {feedbackMsg && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full animate-fade-in">
                {feedbackMsg}
              </span>
            )}
            <span className="text-xs text-stone-400 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800 font-mono">
              Total Orders: <strong className="text-white">{orders.length}</strong>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-3" />
              <p className="text-stone-300 font-medium">Connecting to Papaz Spot Firestore...</p>
              <p className="text-xs text-stone-500 mt-1">Listening to live order stream</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-stone-800 rounded-3xl bg-[#171820]/50 p-8">
              <div className="w-16 h-16 rounded-3xl bg-stone-800/80 flex items-center justify-center text-stone-500 mb-4">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No Orders in this view</h3>
              <p className="text-xs text-stone-400 max-w-sm">
                When customers place an order through the digital menu or WhatsApp, it will sync instantly to this screen.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingOrderId === order.id;
                const dateFormatted = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div 
                    key={order.id}
                    className={`flex flex-col bg-[#1A1C24] border rounded-2xl p-4 transition-all hover:border-orange-500/40 shadow-lg ${
                      order.status === 'received' 
                        ? 'border-amber-500/50 shadow-amber-950/20 ring-1 ring-amber-500/30' 
                        : order.status === 'preparing' 
                        ? 'border-orange-500/50 shadow-orange-950/20' 
                        : 'border-stone-800'
                    }`}
                  >
                    {/* Order Top Bar */}
                    <div className="flex items-start justify-between gap-2 border-b border-stone-800/80 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-white text-sm">#{order.id}</span>
                          <span className="text-[11px] text-stone-400">{dateFormatted}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-300 font-medium">
                          {order.orderMode === 'dine-in' ? (
                            <>
                              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                              <span>Dine-In &bull; Table <strong className="text-white">{order.tableNumber || '01'}</strong></span>
                            </>
                          ) : order.orderMode === 'takeaway' ? (
                            <>
                              <Store className="w-3.5 h-3.5 text-blue-400" />
                              <span>Take Away Pick-Up</span>
                            </>
                          ) : (
                            <>
                              <Bike className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Delivery &bull; <span className="text-emerald-300">{order.deliveryZone || 'Kampala'}</span></span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-[#14151B] p-2.5 rounded-xl border border-stone-800/70 mb-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400">Customer:</span>
                        <strong className="text-white truncate max-w-[140px]">{order.customerName}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400 flex items-center gap-1"><Phone className="w-3 h-3" /> Contact:</span>
                        <a 
                          href={`tel:${order.customerPhone}`}
                          className="text-orange-400 hover:underline font-mono"
                        >
                          {order.customerPhone}
                        </a>
                      </div>
                      {order.deliveryAddress && (
                        <div className="text-[11px] text-stone-300 pt-1 border-t border-stone-800/60 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="flex-1 space-y-1.5 mb-3 overflow-y-auto max-h-36 pr-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Items:</div>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-800/40 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-stone-800 text-stone-200 text-[11px] font-black flex items-center justify-center shrink-0">
                              {it.quantity}x
                            </span>
                            <span className="text-stone-200 font-medium leading-snug">{it.name}</span>
                          </div>
                          <span className="text-stone-400 font-mono text-[11px]">
                            {(it.price * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Special Notes if any */}
                    {order.notes && (
                      <div className="mb-3 p-2 bg-amber-950/20 border border-amber-800/40 rounded-lg text-[11px] text-amber-300 italic">
                        &quot;{order.notes}&quot;
                      </div>
                    )}

                    {/* Total & Action Buttons */}
                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between mb-3">
                      <span className="text-xs text-stone-400">Total:</span>
                      <span className="text-sm font-black text-white font-mono">
                        {order.grandTotal.toLocaleString()} UGX
                      </span>
                    </div>

                    {/* Quick Status Control Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        disabled={isUpdating || order.status === 'preparing'}
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                          order.status === 'preparing'
                            ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50'
                            : 'bg-stone-800/80 hover:bg-orange-600 hover:text-white text-stone-300'
                        }`}
                      >
                        <Flame className="w-3 h-3" /> Prep
                      </button>

                      <button
                        disabled={isUpdating || order.status === 'dispatched'}
                        onClick={() => handleUpdateStatus(order.id, 'dispatched')}
                        className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                          order.status === 'dispatched'
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                            : 'bg-stone-800/80 hover:bg-blue-600 hover:text-white text-stone-300'
                        }`}
                      >
                        <Bike className="w-3 h-3" /> Dispatch
                      </button>

                      <button
                        disabled={isUpdating || order.status === 'delivered'}
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        className={`py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                          order.status === 'delivered'
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                            : 'bg-stone-800/80 hover:bg-emerald-600 hover:text-white text-stone-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#171820] border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Papaz Spot Security Rules Active &bull; Database: Firestore Enterprise</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Call Papaz Kitchen: <a href="tel:0708300003" className="text-orange-400 font-mono font-bold">0708300003</a></span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#E05322] hover:bg-[#d04a1b] text-white font-bold rounded-xl transition-all"
            >
              Close Display
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
