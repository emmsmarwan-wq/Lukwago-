import { Phone, Clock, MapPin, Image as ImageIcon, ShieldCheck, QrCode, Download, Cookie, ChefHat } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FooterProps {
  onOpenOriginalPhotos: () => void;
  onOpenQRCode: () => void;
  onOpenDownloadApp: () => void;
  onOpenCookieSettings: () => void;
  onOpenKitchenDisplay?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenOriginalPhotos, 
  onOpenQRCode, 
  onOpenDownloadApp,
  onOpenCookieSettings,
  onOpenKitchenDisplay
}) => {
  return (
    <footer className="bg-[#0E0F12] border-t border-stone-800 text-stone-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1: Brand & Motto */}
        <div>
          <div className="text-xl font-bold text-white font-display flex items-center gap-2">
            <span>PAPAZ</span>
            <span className="text-orange-400">SPOT</span>
          </div>
          <p className="mt-2 text-xs text-stone-400 italic">
            "{RESTAURANT_INFO.tagline}"
          </p>
          <p className="mt-3 text-xs text-stone-400 leading-relaxed max-w-sm">
            Authentic Ugandan food tradition. Steamed Banana Leaf Luwombo,
            fresh tropical juices, Rolex, and stews available round the clock.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Open 24/7 (24 Hours Daily)</span>
          </div>
        </div>

        {/* Col 2: Hours & Ordering */}
        <div className="space-y-2.5 text-xs">
          <h4 className="text-sm font-semibold text-white">24hr Service &amp; Orders</h4>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{RESTAURANT_INFO.openingHours}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-300">
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>Orders &amp; WhatsApp: {RESTAURANT_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{RESTAURANT_INFO.location}</span>
          </div>
          <p className="text-[11px] text-stone-500 pt-1">
            Kitchen runs day and night. Dine in at our tables or order takeaway (+1,000/=).
          </p>
        </div>

        {/* Col 3: Official Menu Verification & Scan & Order */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Quick Actions</h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={onOpenDownloadApp}
              className="w-full px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download App &amp; Source Code</span>
            </button>
            {onOpenKitchenDisplay && (
              <button
                onClick={onOpenKitchenDisplay}
                className="w-full px-3.5 py-2 text-xs font-semibold text-orange-400 hover:text-white bg-orange-950/40 hover:bg-orange-900/50 rounded-lg border border-orange-500/40 flex items-center justify-center gap-2 transition-colors"
              >
                <ChefHat className="w-3.5 h-3.5 text-orange-400" />
                <span>Live Kitchen Display &amp; Orders DB</span>
              </button>
            )}
            <button
              onClick={onOpenQRCode}
              className="w-full px-3.5 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 flex items-center justify-center gap-2 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-400" />
              <span>Scan &amp; Order QR Code</span>
            </button>
            <button
              onClick={onOpenOriginalPhotos}
              className="w-full px-3.5 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 flex items-center justify-center gap-2 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>View Original Menu Photos</span>
            </button>
            <button
              onClick={onOpenCookieSettings}
              className="w-full px-3.5 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700 rounded-lg border border-stone-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Cookie className="w-3.5 h-3.5 text-orange-400" />
              <span>Cookie &amp; Storage Settings</span>
            </button>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-stone-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Prices guaranteed matching Papaz Spot physical menu boards.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <p>© {new Date().getFullYear()} Papaz Spot Kampala. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs">
          <span>Open 24 Hours · Take Away 1,000/= · G.nuts Free</span>
          <button
            onClick={onOpenCookieSettings}
            className="text-stone-400 hover:text-orange-400 underline underline-offset-2 transition-colors"
          >
            Cookies &amp; Privacy
          </button>
        </div>
      </div>
    </footer>
  );
};
