import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Search, Phone, Clock, MapPin, Image as ImageIcon, QrCode, Bike, Download, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  orderMode: 'dine-in' | 'takeaway' | 'delivery';
  onOrderModeChange: (mode: 'dine-in' | 'takeaway' | 'delivery') => void;
  onOpenOriginalPhotos: () => void;
  onOpenQRCode: () => void;
  onOpenDownloadApp: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  orderMode,
  onOrderModeChange,
  onOpenOriginalPhotos,
  onOpenQRCode,
  onOpenDownloadApp,
}) => {
  const menuUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://papazspot.menu';

  return (
    <section className="relative overflow-hidden border-b border-stone-800 bg-[#16171C]">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_papaz_feast_1793271703559.jpg"
          alt="Papaz Spot East African Feast"
          className="w-full h-full object-cover object-center opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-[#121316]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121316] via-[#121316]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10">
          <div className="flex-1 max-w-3xl">
            {/* Unboxed metadata line with typographic separator */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-orange-400 mb-3 tracking-wide">
              <span className="text-white font-semibold uppercase tracking-wider">Papaz Spot</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="italic">"{RESTAURANT_INFO.tagline}"</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px]">
                24 HRS OPEN DAILY
              </span>
            </div>

            {/* Balanced Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight [text-wrap:balance]">
              Authentic Ugandan Feasts, Luwombo &amp; Fresh Juices
            </h1>

            <p className="mt-3 text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
              Slow-steamed beef and goat Luwombo sealed in banana leaves, fragrant pilau, 
              freshly rolled Kampala Rolex, and crushed tropical fruits prepared fresh daily.
            </p>

            {/* Key Quick Info Strip with 24 Hours Highlight */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-5 text-xs text-stone-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Open 24 Hours (Day &amp; Night)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>{RESTAURANT_INFO.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400">
                <Bike className="w-3.5 h-3.5 text-orange-400" />
                <span>Citywide Doorstep Delivery</span>
              </div>
              <a 
                href={`tel:${RESTAURANT_INFO.phone}`} 
                className="flex items-center gap-1.5 hover:text-white transition-colors text-stone-300"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{RESTAURANT_INFO.formattedPhone}</span>
              </a>
            </div>

            {/* Search & Dining Mode Control Panel */}
            <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search dishes (e.g. Luwombo, Rolex, Pilau, Fish, Passion)..."
                  className="w-full bg-[#1F2026]/90 border border-stone-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Order Mode Selector (Dine In / Pick-up / Delivery) */}
              <div className="flex items-center gap-1 p-1 bg-[#1F2026] border border-stone-800 rounded-xl shrink-0">
                <button
                  onClick={() => onOrderModeChange('dine-in')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    orderMode === 'dine-in'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Dine In
                </button>
                <button
                  onClick={() => onOrderModeChange('takeaway')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    orderMode === 'takeaway'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Pick-up
                </button>
                <button
                  onClick={() => onOrderModeChange('delivery')}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    orderMode === 'delivery'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </button>
              </div>

              {/* Scan & Order Action Button */}
              <button
                onClick={onOpenQRCode}
                className="px-3 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
                title="Show QR Code to access menu or print table cards"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan &amp; Order</span>
              </button>

              {/* Download / Install App Action Button */}
              <button
                onClick={onOpenDownloadApp}
                className="px-3 py-2.5 bg-stone-800 hover:bg-stone-700 text-orange-400 hover:text-orange-300 text-xs font-bold rounded-xl border border-stone-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                title="Download App to Phone or PC / Download Source Code"
              >
                <Download className="w-4 h-4" />
                <span>Download App</span>
              </button>

              {/* View Original Photo Board Action */}
              <button
                onClick={onOpenOriginalPhotos}
                className="px-3 py-2.5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold rounded-xl border border-stone-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                title="Compare with photos of the physical menu board"
              >
                <ImageIcon className="w-4 h-4 text-stone-400" />
                <span>Photos</span>
              </button>
            </div>

            {/* Quick Menu Jump Shortcuts */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 font-medium">Quick Jump:</span>
              <a
                href="#luwombo-specials"
                className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
              >
                🥩 Luwombo Specials
              </a>
              <a
                href="#main-courses"
                className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
              >
                🍲 Main Courses &amp; Pilau
              </a>
              <a
                href="#breakfast-section"
                className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-amber-200 border border-amber-800/40 transition-colors"
              >
                🍳 Breakfast &amp; Rolex (24/7)
              </a>
              <a
                href="#beverages-section"
                className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 border border-emerald-800/40 transition-colors"
              >
                🥤 Fresh Juices &amp; Beverages
              </a>
            </div>
          </div>

          {/* Direct Scannable Menu QR Code Card */}
          <div className="lg:w-64 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={onOpenQRCode}
              className="group w-full sm:w-auto lg:w-full flex flex-row lg:flex-col items-center gap-4 lg:gap-3 p-4 bg-[#1B1D24]/95 hover:bg-[#20222B] border border-orange-500/30 hover:border-orange-400/60 rounded-2xl shadow-2xl transition-all text-left lg:text-center cursor-pointer"
              title="Click to enlarge, download PNG, or print table QR cards"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-md shrink-0 group-hover:scale-[1.03] transition-transform">
                <QRCodeSVG
                  value={menuUrl}
                  size={128}
                  level="H"
                  marginSize={1}
                  fgColor="#121316"
                  bgColor="#ffffff"
                />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-orange-400">
                  <UtensilsCrossed className="w-3 h-3" />
                  <span>Scan to Access Menu</span>
                </div>
                <p className="text-xs text-stone-300 leading-snug">
                  Point your phone camera here to open the live 24/7 digital menu.
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <QrCode className="w-3 h-3" />
                  <span>Download PNG / Print Table Card &rarr;</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
