import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

interface ImageLightboxProps {
  url: string | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#090A0F]/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] bg-[#11131A] border border-[#2E3445] rounded-xl overflow-hidden shadow-2xl flex flex-col glow-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#181B24] border-b border-[#232733] text-xs">
          <span className="font-mono text-[#38BDF8]">TELEMETRY ASSET PREVIEW</span>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded text-[#9CA3AF] hover:text-white"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#11131A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-2 overflow-auto flex items-center justify-center bg-[#090A0F]">
          <img
            src={url}
            alt="Asset Preview"
            className="max-h-[80vh] w-auto object-contain rounded"
          />
        </div>
      </div>
    </div>
  );
};
