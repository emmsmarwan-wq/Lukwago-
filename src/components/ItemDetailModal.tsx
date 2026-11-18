import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, Flame, Leaf, Utensils, Heart } from 'lucide-react';
import { MenuItem } from '../data/menuData';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, notes?: string, selectedPrice?: number) => void;
  currency: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  currency,
  isFavorite = false,
  onToggleFavorite,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number>(item.price);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usd = (amount / 3750).toFixed(2);
      return `$${usd}`;
    }
    return `${amount.toLocaleString()} UGX`;
  };

  const handleAdd = () => {
    onAddToCart(item, quantity, specialInstructions, selectedVariant);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#18191E] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Buttons: Favorite and Close */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              className={`p-2 rounded-full backdrop-blur-sm border transition-all active:scale-90 ${
                isFavorite
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white border-stone-700/60'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white stroke-white' : ''}`} />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm border border-stone-700/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Image Section */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18191E] via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
              <span>{item.subcategory || 'Papaz Spot Special'}</span>
              {item.isSpecialty && (
                <>
                  <span aria-hidden="true" className="text-stone-500">·</span>
                  <span className="text-white">Signature Recipe</span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable details body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Price & Serving Size */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#1F2026] rounded-xl border border-stone-800">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Official Menu Price</span>
              <div className="text-2xl font-black text-white font-mono tabular-nums mt-0.5">
                {item.secondaryPrice ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedVariant(item.price)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-all ${
                        selectedVariant === item.price
                          ? 'bg-orange-600 text-white border-orange-500'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                      }`}
                    >
                      Regular: {formatPrice(item.price)}
                    </button>
                    <button
                      onClick={() => setSelectedVariant(item.secondaryPrice!)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-all ${
                        selectedVariant === item.secondaryPrice
                          ? 'bg-orange-600 text-white border-orange-500'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                      }`}
                    >
                      Jumbo: {formatPrice(item.secondaryPrice!)}
                    </button>
                  </div>
                ) : item.price === 0 ? (
                  <span className="text-emerald-400">Complimentary (FREE)</span>
                ) : (
                  formatPrice(item.price)
                )}
              </div>
            </div>

            <div className="text-xs text-stone-400 sm:text-right">
              <div>Freshly made to order</div>
              <div className="text-stone-500">Take away packaging +1,000/=</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Description &amp; Preparation</h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Key Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2.5">Key Ingredients &amp; Accompanients</h3>
              <div className="flex flex-wrap gap-2 text-xs text-stone-300">
                {item.ingredients.map((ing, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-[#1F2026] border border-stone-800 text-stone-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Special Notes / Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Pack gravy separately, mild pepper, extra napkins..."
              className="w-full bg-[#1F2026] border border-stone-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Footer with Quantity and Add Button */}
        <div className="p-4 sm:p-6 border-t border-stone-800 bg-[#121316] flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-[#1F2026] border border-stone-800 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-white text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Tray Action */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
              addedAnimation 
                ? 'bg-emerald-600' 
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-950/40'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Tray!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Tray · {formatPrice(selectedVariant * quantity)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
