import React from 'react';
import { X, Copy, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://timestampcamera.app';
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    alert('App link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden flex flex-col text-neutral-800 text-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-semibold text-neutral-800">QR Code of App</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center text-center space-y-3">
          <div className="p-2 border border-neutral-200 rounded-lg bg-white shadow-xs">
            <img
              src={qrImgUrl}
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="text-xs text-neutral-500">
            Scan this QR code with another smartphone to test Timestamp Camera on mobile.
          </p>

          <button
            onClick={copyLink}
            className="w-full py-2 rounded bg-[#00a0e9] hover:bg-[#0086c3] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy App Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
