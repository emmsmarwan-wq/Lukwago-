import React, { useState } from 'react';
import { Plus, Minus, Eye, Utensils, Heart } from 'lucide-react';
import { MenuItem } from '../data/menuData';

interface MenuItemCardProps {
  item: MenuItem;
  quantityInCart: number;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (item: MenuItem) => void;
  onSelect: (item: MenuItem) => void;
  currency: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onSelect,
  currency,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imageError, setImageError] = useState(false);

  // Currency formatting
  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usd = (amount / 3750).toFixed(2);
      return `$${usd}`;
    }
    return `${amount.toLocaleString()} UGX`;
  };

  return (
    <div className="group relative bg-[#18191E] border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-stone-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
      {/* Top Image Section */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 cursor-pointer"
        onClick={() => onSelect(item)}
      >
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-900 to-stone-800 text-stone-500">
            <Utensils className="w-8 h-8 mb-2 text-stone-600" />
            <span className="text-xs text-stone-400 font-medium">{item.name}</span>
          </div>
        )}

        {/* Gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18191E] via-transparent to-transparent opacity-80" />

        {/* Top Right Actions: Favorite Heart & Quick View Eye */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Favorite Toggle Button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              className={`p-2 rounded-lg backdrop-blur-md transition-all active:scale-90 ${
                isFavorite
                  ? 'bg-rose-600/90 text-white shadow-md shadow-rose-950/40'
                  : 'bg-black/60 hover:bg-black/85 text-stone-300 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white stroke-white' : ''}`} />
            </button>
          )}

          {/* View Details Eye on Hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="p-2 rounded-lg bg-black/60 hover:bg-black/85 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`View details of ${item.name}`}
            title="View details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quiet Top Tag */}
        {item.isSpecialty && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-orange-600/90 text-white text-[11px] font-semibold tracking-wide uppercase shadow-sm backdrop-blur-sm">
            House Specialty
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1.5 font-medium">
            <span>{item.subcategory || (item.category === 'main' ? 'Main Course' : item.category === 'breakfast_snacks' ? 'Breakfast & Snack' : 'Beverage')}</span>
            {item.dietary && (
              <>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="capitalize">{item.dietary}</span>
              </>
            )}
            {item.popular && (
              <>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="text-orange-400 font-semibold">Chef’s Pick</span>
              </>
            )}
          </div>

          {/* Dish Title */}
          <h3 
            onClick={() => onSelect(item)}
            className="text-base font-bold text-white group-hover:text-orange-400 transition-colors cursor-pointer line-clamp-1"
          >
            {item.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Price and Add Actions */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
          {/* Tabular Price */}
          <div>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              {item.secondaryPrice ? (
                <span>
                  {formatPrice(item.price)} <span className="text-xs text-stone-400 font-normal">/ {formatPrice(item.secondaryPrice)}</span>
                </span>
              ) : item.price === 0 ? (
                <span className="text-emerald-400 font-bold">FREE</span>
              ) : (
                formatPrice(item.price)
              )}
            </div>
            <div className="text-[10px] text-stone-500 font-medium">As shown on menu board</div>
          </div>

          {/* Interactive Tray Controls */}
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-800 hover:bg-orange-600 active:scale-95 rounded-lg border border-stone-700 hover:border-orange-500 transition-all flex items-center gap-1.5 shrink-0"
              aria-label={`Add ${item.name} to tray`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#1F2026] border border-orange-500/60 rounded-lg p-0.5 shrink-0 shadow-sm">
              <button
                onClick={() => onRemoveFromCart(item)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-mono font-bold text-orange-400">
                {quantityInCart}
              </span>
              <button
                onClick={() => onAddToCart(item)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-orange-600 hover:bg-orange-500 text-white transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
