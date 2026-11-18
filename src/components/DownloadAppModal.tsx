import React, { useState } from 'react';
import { 
  X, Download, Smartphone, Laptop, Check, Copy, 
  ExternalLink, FileArchive, Sparkles, Share2, PlusSquare, ArrowDownToLine 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { RESTAURANT_INFO } from '../data/menuData';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'app' | 'source'>('app');
  const [copiedInstructions, setCopiedInstructions] = useState(false);

  if (!isOpen) return null;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText('npm install\nnpm run dev');
    setCopiedInstructions(true);
    setTimeout(() => setCopiedInstructions(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#18191E] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-[#121316] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-600/10 text-orange-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Download Papaz Spot</h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Mobile App Installation &amp; Source Code</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-[#14151A] border-b border-stone-800 flex gap-2">
          <button
            onClick={() => setActiveTab('app')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'app'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white bg-[#1C1D24]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App on Phone / PC</span>
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'source'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white bg-[#1C1D24]'
            }`}
          >
            <FileArchive className="w-4 h-4" />
            <span>Download Source Code (ZIP)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'app' ? (
            <div className="space-y-5">
              {/* Brand card */}
              <div className="flex items-center gap-4 p-4 bg-[#1F2026] border border-stone-800 rounded-xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
                  <span className="font-display font-black text-xl">PS</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Papaz Spot App</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Install directly to your home screen for instant food ordering, table scanning, and full offline menu access.
                  </p>
                </div>
              </div>

              {/* Status / Install Action */}
              {isInstalled ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-3 text-emerald-300">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Already Installed!</h4>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5">
                      You are running Papaz Spot in standalone native app mode.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="space-y-3">
                  <button
                    onClick={install}
                    className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Papaz Spot to Device</span>
                  </button>
                  <p className="text-[11px] text-center text-stone-400">
                    Works on Android, Windows, Mac, and Chromebooks without Google Play or App Store.
                  </p>
                </div>
              ) : isIOS ? (
                <div className="p-4 bg-[#1F2026] border border-stone-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    <span>Install on iPhone or iPad (Safari)</span>
                  </h4>
                  <ol className="text-xs text-stone-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      Open this menu in <strong>Safari</strong> on your iPhone.
                    </li>
                    <li>
                      Tap the <strong>Share</strong> button (the square icon with an arrow pointing up at the bottom).
                    </li>
                    <li>
                      Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-orange-400 mx-1" />.
                    </li>
                    <li>
                      Tap <strong>Add</strong> in the top-right corner.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="p-4 bg-[#1F2026] border border-stone-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white">Desktop / Browser Installation</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Click the <strong>Install</strong> icon in your browser's address bar (on Google Chrome, Edge, or Brave) to add Papaz Spot directly to your applications.
                  </p>
                </div>
              )}

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#1B1D24] border border-stone-800 rounded-xl">
                  <h5 className="font-bold text-white">⚡ Instant Ordering</h5>
                  <p className="text-stone-400 text-[11px] mt-1">
                    Direct WhatsApp dispatch and 1-tap re-ordering.
                  </p>
                </div>
                <div className="p-3 bg-[#1B1D24] border border-stone-800 rounded-xl">
                  <h5 className="font-bold text-white">📱 Standalone Experience</h5>
                  <p className="text-stone-400 text-[11px] mt-1">
                    Launches full-screen without address bars or browser tabs.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Source code archive info */}
              <div className="p-4 bg-[#1F2026] border border-stone-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Project Source Code ZIP</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Complete project bundle with all React components, HD photos, prices, Tailwind styles, and configurations.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-stone-800 text-[11px] font-mono font-bold text-orange-400 shrink-0">
                    7.6 MB
                  </span>
                </div>

                {/* Direct download link */}
                <a
                  href="/downloads/papaz-spot-project.zip"
                  download="papaz-spot-digital-menu.zip"
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Download papaz-spot-digital-menu.zip</span>
                </a>
              </div>

              {/* Local Setup Instructions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
                  <span>How to Run Locally:</span>
                  <button
                    onClick={handleCopyCommands}
                    className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    {copiedInstructions ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy commands</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-[#121316] border border-stone-800 rounded-xl font-mono text-xs text-stone-300 space-y-1">
                  <p className="text-stone-500"># 1. Unzip the downloaded file</p>
                  <p>unzip papaz-spot-digital-menu.zip</p>
                  <p className="text-stone-500 pt-1"># 2. Install dependencies &amp; start</p>
                  <p>npm install</p>
                  <p>npm run dev</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-[#121316] flex items-center justify-between text-xs text-stone-400">
          <span>Papaz Spot Kampala · Open 24/7</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
