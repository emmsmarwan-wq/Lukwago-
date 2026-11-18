import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Sliders, Trash2, ExternalLink } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  orderHistory: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'papaz_spot_cookie_consent_v1';

interface CookieBannerProps {
  isOpenModalRequested?: boolean;
  onCloseModalRequested?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  isOpenModalRequested = false,
  onCloseModalRequested
}) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Preferences state
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    preferences: true,
    orderHistory: true,
    timestamp: new Date().toISOString()
  });

  const [clearedNotice, setClearedNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
        setShowBanner(false);
      } else {
        // Show after small initial delay for smooth entry
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  // Sync external open request (e.g. from Footer "Cookie Settings" button)
  useEffect(() => {
    if (isOpenModalRequested) {
      setIsModalOpen(true);
    }
  }, [isOpenModalRequested]);

  const handleSavePreferences = (customPrefs: Partial<CookiePreferences>) => {
    const updated: CookiePreferences = {
      necessary: true,
      preferences: customPrefs.preferences ?? preferences.preferences,
      orderHistory: customPrefs.orderHistory ?? preferences.orderHistory,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not store cookie preference', e);
    }
    setPreferences(updated);
    setShowBanner(false);
    setIsModalOpen(false);
    if (onCloseModalRequested) onCloseModalRequested();
  };

  const handleAcceptAll = () => {
    handleSavePreferences({ preferences: true, orderHistory: true });
  };

  const handleEssentialOnly = () => {
    handleSavePreferences({ preferences: false, orderHistory: false });
  };

  const handleClearAllStorage = () => {
    try {
      localStorage.removeItem('papaz_cart_v1');
      localStorage.removeItem('papaz_favorites_v1');
      localStorage.removeItem('papaz_order_history_v1');
      setClearedNotice('Local tray, favorites, and order history cleared successfully!');
      setTimeout(() => setClearedNotice(null), 3000);
    } catch {
      setClearedNotice('Storage cleared.');
    }
  };

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {showBanner && !isModalOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#18191E]/95 backdrop-blur-md border border-stone-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 text-white">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 shrink-0 mt-0.5 border border-orange-500/20">
                <Cookie className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-1.5 font-display">
                    Cookie &amp; Storage Notice
                  </h4>
                  <button
                    onClick={handleEssentialOnly}
                    className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
                    title="Close with essential only"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  We use cookies and browser local storage to remember your food tray, save your favorite dishes, and track your active orders at Papaz Spot.
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Sliders className="w-3 h-3 text-orange-400" />
                    <span>Preferences</span>
                  </button>
                  <button
                    onClick={handleEssentialOnly}
                    className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    Essential Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#18191E] border border-stone-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/20">
                  <Cookie className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Cookie &amp; Storage Settings</h3>
                  <p className="text-[11px] text-stone-400">Manage how Papaz Spot saves data on your browser</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseModalRequested) onCloseModalRequested();
                }}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification alert if cleared */}
            {clearedNotice && (
              <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{clearedNotice}</span>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-300 divide-y divide-stone-800/80">
              {/* Category 1: Strictly Necessary */}
              <div className="pt-1 first:pt-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white text-sm">Strictly Necessary Storage</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Always Active
                  </span>
                </div>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  Essential for core digital menu features to function. Stores your current selected dishes in the tray, chosen dining method (Dine-in / Takeaway / Delivery), and temporary session tokens. No marketing cookies are ever used.
                </p>
              </div>

              {/* Category 2: Favorites & Custom Preferences */}
              <div className="pt-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-semibold text-white text-sm">Favorites &amp; Currency Memory</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Saves your heart-favorited dishes and your preferred display currency (UGX / USD).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, preferences: !prev.preferences }))}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.preferences ? 'bg-orange-500' : 'bg-stone-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.preferences ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category 3: Order History & Live Tracker */}
              <div className="pt-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-semibold text-white text-sm">Order History &amp; Re-Ordering</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Retains your past receipts locally so you can check preparation status and re-order with 1 click.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, orderHistory: !prev.orderHistory }))}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.orderHistory ? 'bg-orange-500' : 'bg-stone-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.orderHistory ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Data Reset Tools */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-stone-200">Reset Local Storage Data</span>
                  <p className="text-[11px] text-stone-500">Clear all saved cart items, favorites, and order history.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearAllStorage}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Clear Data</span>
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-4 border-t border-stone-800 bg-[#121316] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-stone-500">
                Papaz Spot 24/7 · No 3rd-party ad trackers
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePreferences(preferences)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-sm transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
