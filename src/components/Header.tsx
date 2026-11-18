import React from 'react';
import { ShoppingBag, UtensilsCrossed, QrCode, Download, History, ChefHat } from 'lucide-react';

interface HeaderProps {
  totalCartCount: number;
  ordersCount?: number;
  onOpenCart: () => void;
  onOpenOrderHistory: () => void;
  onOpenOriginalPhotos: () => void;
  onOpenQRCode: () => void;
  onOpenDownloadApp: () => void;
  onOpenKitchenDisplay: () => void;
  currency: string;
  onCurrencyChange: (curr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCartCount,
  ordersCount = 0,
  onOpenCart,
  onOpenOrderHistory,
  onOpenOriginalPhotos,
  onOpenQRCode,
  onOpenDownloadApp,
  onOpenKitchenDisplay,
  currency,
  onCurrencyChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#121316]/95 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a 
          href="#top" 
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-950/40">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-display tracking-tight text-lg text-white">
            PAPAZ <span className="text-orange-400 font-black">SPOT</span>
          </span>
        </a>

        {/* Zone 2: 4–5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <a href="#luwombo-specials" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
            Luwombo
          </a>
          <a href="#main-courses" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
            Main Courses
          </a>
          <a href="#breakfast-section" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
            Breakfast &amp; Snacks
          </a>
          <a href="#beverages-section" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
            Beverages &amp; Juices
          </a>
          <a href="#reviews-section" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
            Reviews
          </a>
          <button 
            onClick={onOpenKitchenDisplay}
            className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-300 hover:text-white"
          >
            <ChefHat className="w-3.5 h-3.5 text-orange-400" />
            <span className="flex items-center gap-1">
              Kitchen DB
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
          </button>
          <button 
            onClick={onOpenQRCode}
            className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-300 hover:text-white"
          >
            <QrCode className="w-3.5 h-3.5 text-orange-400" />
            <span>Scan &amp; Order</span>
          </button>
          <button 
            onClick={onOpenDownloadApp}
            className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Download App</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Currency Selector */}
          <div className="hidden sm:flex items-center bg-[#1F2026] border border-stone-800 rounded-lg p-0.5 text-xs text-stone-300">
            <button
              onClick={() => onCurrencyChange('UGX')}
              className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                currency === 'UGX' ? 'bg-orange-500 text-white' : 'hover:text-white'
              }`}
            >
              UGX
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                currency === 'USD' ? 'bg-orange-500 text-white' : 'hover:text-white'
              }`}
            >
              USD
            </button>
          </div>

          {/* Mobile Menu QR Code Button */}
          <button
            onClick={onOpenQRCode}
            className="md:hidden flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-stone-200 hover:text-white bg-[#1F2026] hover:bg-stone-800 border border-stone-800 rounded-lg transition-colors whitespace-nowrap"
            title="Show QR Code to Access Menu"
            aria-label="Menu QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-orange-400" />
          </button>

          {/* Kitchen Display Button for mobile / quick access */}
          <button
            onClick={onOpenKitchenDisplay}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/40 rounded-lg transition-colors whitespace-nowrap"
            title="Open Live Kitchen & Database Display"
            aria-label="Open Kitchen Display"
          >
            <ChefHat className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Kitchen</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* Order History & Tracker button */}
          <button
            onClick={onOpenOrderHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-[#1F2026] hover:bg-stone-800 border border-stone-800 rounded-lg transition-colors whitespace-nowrap"
            title="Track active orders or view history"
            aria-label="Order History & Tracker"
          >
            <History className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Orders</span>
            {ordersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-stone-800 text-[10px] font-mono text-stone-300 border border-stone-700">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Primary Action Button: Open Order Tray */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
            aria-label="View order tray"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Tray</span>
            {totalCartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-orange-700 font-mono text-[11px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
