import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Copy, Check, Printer, Download, Sparkles, Clock, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [qrMode, setQrMode] = useState<'menu' | 'table'>('menu');
  const [tableNumber, setTableNumber] = useState<string>('01');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Compute URL for QR code
  const currentBaseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const qrUrl =
    qrMode === 'table' && tableNumber.trim()
      ? `${currentBaseUrl}?table=${encodeURIComponent(tableNumber.trim())}`
      : currentBaseUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    const svg = qrWrapperRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const padding = 48;
      const headerHeight = 72;
      const footerHeight = 64;
      const qrSize = 420;

      canvas.width = qrSize + padding * 2;
      canvas.height = qrSize + padding * 2 + headerHeight + footerHeight;

      // White card background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header text
      ctx.fillStyle = '#121316';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAPAZ SPOT', canvas.width / 2, 52);

      ctx.fillStyle = '#E05322';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('OPEN 24 HOURS · DIGITAL MENU', canvas.width / 2, 80);

      // Draw QR code
      ctx.drawImage(img, padding, headerHeight + 20, qrSize, qrSize);

      // Footer label
      ctx.fillStyle = '#121316';
      ctx.font = 'bold 20px monospace';
      const label =
        qrMode === 'table' && tableNumber.trim()
          ? `SCAN & ORDER · TABLE ${tableNumber.trim()}`
          : 'SCAN TO ACCESS MENU & ORDER';
      ctx.fillText(label, canvas.width / 2, canvas.height - 32);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download =
        qrMode === 'table' && tableNumber.trim()
          ? `papaz-spot-table-${tableNumber.trim()}-qr.png`
          : 'papaz-spot-menu-qr.png';
      link.href = pngUrl;
      link.click();
    };

    img.src = url;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#18191E] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white print:max-h-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#121316] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-600/10 text-orange-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Menu Access QR Code</h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Scan &amp; Order</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold">Open 24 Hours</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close QR dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div ref={printRef} className="p-5 sm:p-7 overflow-y-auto flex flex-col items-center text-center bg-[#18191E] print:bg-white print:text-black print:overflow-visible">
          {/* Mode Toggle (Hidden in print) */}
          <div className="mb-4 p-1 bg-[#121316] border border-stone-800 rounded-xl grid grid-cols-2 gap-1 w-full max-w-xs text-xs font-semibold print:hidden">
            <button
              type="button"
              onClick={() => setQrMode('menu')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                qrMode === 'menu'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              General Menu QR
            </button>
            <button
              type="button"
              onClick={() => setQrMode('table')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                qrMode === 'table'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Table Card QR
            </button>
          </div>

          {/* Brand & Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/15 border border-orange-500/30 text-orange-400 print:text-orange-600 print:border-orange-600 mb-2.5 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{qrMode === 'table' ? 'Scan & Order at Table' : 'Scan to Access Menu'}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white print:text-black font-display tracking-tight">
            PAPAZ <span className="text-orange-500">SPOT</span>
          </h3>
          <p className="text-xs text-stone-400 print:text-stone-600 italic mt-0.5">
            "{RESTAURANT_INFO.tagline}"
          </p>

          {/* 24 Hours Open Badge */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 print:text-emerald-700 font-bold bg-emerald-950/40 print:bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-800/40 print:border-emerald-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Open 24 Hours Daily · 24/7 Service</span>
          </div>

          {/* QR Code Container with High Contrast frame */}
          <div
            ref={qrWrapperRef}
            className="my-5 p-4 sm:p-5 bg-white rounded-2xl shadow-xl border-4 border-orange-500/20 flex flex-col items-center"
          >
            <QRCodeSVG
              value={qrUrl || 'https://papazspot.menu'}
              size={200}
              level="H"
              marginSize={2}
              fgColor="#121316"
              bgColor="#ffffff"
            />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-800 tracking-wider uppercase">
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
              <span>
                {qrMode === 'table' && tableNumber.trim()
                  ? `SCAN & ORDER · TABLE ${tableNumber.trim()}`
                  : 'SCAN TO VIEW MENU & ORDER'}
              </span>
            </div>
          </div>

          {/* Table Selector (Only when Table Card mode is active, Hidden in print) */}
          {qrMode === 'table' && (
            <div className="w-full flex items-center justify-center gap-3 mb-2 print:hidden">
              <label className="text-xs font-semibold text-stone-400">
                Table / Counter #:
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 05"
                className="w-20 text-center font-mono font-bold bg-[#1F2026] border border-stone-700 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* Direct URL Preview */}
          <div className="mt-1 px-3 py-1.5 rounded-lg bg-[#121316] border border-stone-800 text-[11px] font-mono text-stone-400 max-w-full truncate print:hidden">
            {qrUrl}
          </div>

          {/* Displayed Table Tag in Print mode */}
          {qrMode === 'table' && tableNumber.trim() && (
            <div className="hidden print:block mt-2 text-sm font-bold font-mono text-stone-800">
              TABLE {tableNumber.trim()}
            </div>
          )}

          <div className="mt-3 text-xs text-stone-400 print:text-stone-600 space-y-1">
            <p className="font-medium text-stone-300 print:text-stone-900">
              Orders &amp; WhatsApp: {RESTAURANT_INFO.phone}
            </p>
            <p className="text-[11px]">
              Dine In · Take Away (+1,000/= packing) · Fresh Everyday
            </p>
          </div>
        </div>

        {/* Footer Actions (Hidden in Print) */}
        <div className="p-4 border-t border-stone-800 bg-[#121316] flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              type="button"
              onClick={handleDownloadPNG}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
