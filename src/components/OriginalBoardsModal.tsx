import React, { useState } from 'react';
import { X, ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ORIGINAL_MENU_BOARDS, RESTAURANT_INFO } from '../data/menuData';

interface OriginalBoardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalBoardsModal: React.FC<OriginalBoardsModalProps> = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!isOpen) return null;

  const currentBoard = ORIGINAL_MENU_BOARDS[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#18191E] border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#121316]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Original Papaz Spot Menu Boards
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Verified Official Pricing</span>
                <span aria-hidden="true">·</span>
                <span>Phone: {RESTAURANT_INFO.phone}</span>
                <span aria-hidden="true">·</span>
                <span>Photo {activeIndex + 1} of {ORIGINAL_MENU_BOARDS.length}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close original photos modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image & details viewport */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="relative w-full flex items-center justify-center bg-black/50 rounded-xl p-2 border border-stone-800/80 mb-4 min-h-[360px]">
            <img 
              src={currentBoard.imagePath} 
              alt={currentBoard.title}
              className="max-h-[62vh] object-contain rounded-lg shadow-lg"
              referrerPolicy="no-referrer"
            />

            {/* Navigation buttons */}
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : ORIGINAL_MENU_BOARDS.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-stone-700 shadow-md transition-transform hover:scale-105"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev < ORIGINAL_MENU_BOARDS.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-stone-700 shadow-md transition-transform hover:scale-105"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1F2026] p-4 rounded-xl border border-stone-800">
            <div>
              <h3 className="text-base font-semibold text-white">{currentBoard.title}</h3>
              <p className="text-sm text-stone-400 mt-0.5">{currentBoard.description}</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Price Match Guaranteed
              </span>
              <a 
                href={currentBoard.imagePath} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Full Size</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Thumbnails strip */}
          <div className="flex items-center gap-3 mt-4 w-full justify-center">
            {ORIGINAL_MENU_BOARDS.map((board, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all w-20 h-16 ${
                  activeIndex === idx ? 'border-orange-500 scale-105 shadow-md' : 'border-stone-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img 
                  src={board.imagePath} 
                  alt={board.title} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-[#121316] flex items-center justify-between text-xs text-stone-400">
          <span>Take Away packing charge: 1,000/= (reflected in all digital checkout orders)</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-200 rounded-lg transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
