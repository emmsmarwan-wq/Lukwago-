import React from 'react';
import { Filter, ArrowUpDown, Heart } from 'lucide-react';

interface MenuFilterBarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  activeDietary: string;
  onDietaryChange: (diet: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
  favoritesCount?: number;
}

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({
  activeCategory,
  onCategoryChange,
  activeDietary,
  onDietaryChange,
  sortBy,
  onSortChange,
  totalResults,
  favoritesCount = 0,
}) => {
  const categories = [
    { id: 'all', label: 'All Dishes' },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      isFavorites: true, 
      count: favoritesCount 
    },
    { id: 'luwombo', label: 'Luwombo Specials' },
    { id: 'main', label: 'Main Courses' },
    { id: 'breakfast_snacks', label: 'Breakfast & Snacks' },
    { id: 'beverages', label: 'Beverages & Juices' },
    { id: 'sides', label: 'Sides & Extras' }
  ];

  const dietaryFilters = [
    { id: 'all', label: 'All Diets' },
    { id: 'meat', label: 'Beef & Goat' },
    { id: 'poultry', label: 'Chicken' },
    { id: 'fish', label: 'Fish' },
    { id: 'vegetarian', label: 'Vegetarian' }
  ];

  return (
    <div className="bg-[#121316] py-5 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Main Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? cat.isFavorites
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-orange-600 text-white shadow-sm'
                    : 'bg-[#1C1D24] text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                {cat.isFavorites && (
                  <Heart className={`w-3.5 h-3.5 ${isActive || cat.count > 0 ? 'fill-current' : ''}`} />
                )}
                <span>{cat.label}</span>
                {cat.isFavorites && cat.count > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/30 text-white' : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Sub-filters & Sort bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
          {/* Dietary filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-stone-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Diet:
            </span>
            {dietaryFilters.map((diet) => (
              <button
                key={diet.id}
                onClick={() => onDietaryChange(diet.id)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeDietary === diet.id
                    ? 'bg-stone-700 text-white font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>

          {/* Results count & Sort dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <div className="text-stone-400 font-mono">
              <span className="text-white font-medium">{totalResults}</span> items available
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-[#1C1D24] text-stone-300 border border-stone-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="featured">Featured / Menu Order</option>
                <option value="popular">Popular First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
