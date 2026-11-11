import React, { useState } from 'react';
import { CapturedMedia } from '../types/camera';
import { X, Download, Trash2, Layers, Calendar, MapPin, Film, Image as ImageIcon } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: CapturedMedia[];
  onDeleteMedia: (id: string) => void;
  onOpenImport: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  onDeleteMedia,
  onOpenImport,
}) => {
  if (!isOpen) return null;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const selectedItem = mediaList[selectedIndex] || null;

  const downloadMedia = (item: CapturedMedia, useOriginal: boolean = false) => {
    const url = useOriginal && item.originalUrl ? item.originalUrl : item.url;
    const a = document.createElement('a');
    a.href = url;
    a.download = useOriginal ? `ORIG_${item.fileName}` : item.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/95 flex flex-col text-white animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-sky-400" />
          <h2 className="font-semibold text-base">Gallery ({mediaList.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenImport();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a0e9] hover:bg-[#0086c3] text-xs font-semibold text-white transition-colors"
          >
            <span>+ Import Foto</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {mediaList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-neutral-400 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center mb-3">
            <ImageIcon className="w-8 h-8 text-neutral-500" />
          </div>
          <p className="text-base font-medium text-neutral-300">No photos or videos yet</p>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            Tap the shutter button on the camera to capture stamped photos and recorded videos.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Selected Media View */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative bg-black/60 overflow-hidden">
            {selectedItem?.type === 'video' ? (
              <video
                src={selectedItem.url}
                controls
                autoPlay
                className="max-h-[62vh] md:max-h-[75vh] max-w-full rounded shadow-2xl object-contain"
              />
            ) : selectedItem ? (
              <div className="relative flex items-center justify-center max-h-[62vh] md:max-h-[75vh] max-w-full">
                <img
                  src={showOriginal && selectedItem.originalUrl ? selectedItem.originalUrl : selectedItem.url}
                  alt="Captured"
                  className="max-h-[62vh] md:max-h-[75vh] max-w-full rounded shadow-2xl object-contain"
                />

                {/* Badge indicating original vs watermarked */}
                {selectedItem.originalUrl && (
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-xs px-2.5 py-1 rounded-full border border-white/20 font-medium">
                    {showOriginal ? 'Clean Original' : 'Stamped Photo'}
                  </div>
                )}
              </div>
            ) : null}

            {/* Bottom Actions toolbar for the selected item */}
            {selectedItem && (
              <div className="mt-4 flex items-center gap-3 bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-700 shadow-xl">
                {/* Watermarked vs Original toggle */}
                {selectedItem.originalUrl && (
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-sky-400 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{showOriginal ? 'View Watermarked' : 'View Original'}</span>
                  </button>
                )}

                {/* Download */}
                <button
                  onClick={() => downloadMedia(selectedItem, showOriginal)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00a0e9] hover:bg-[#0086c3] text-xs font-semibold text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm('Delete this photo?')) {
                      onDeleteMedia(selectedItem.id);
                      setSelectedIndex(Math.max(0, selectedIndex - 1));
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar / bottom strip: Thumbnails & Metadata */}
          <div className="w-full md:w-80 bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col max-h-[35vh] md:max-h-full">
            {/* Metadata Info Card */}
            {selectedItem && (
              <div className="p-3 border-b border-neutral-800 text-xs space-y-1.5 bg-neutral-950/40">
                <div className="flex items-center gap-1.5 text-neutral-300 font-mono text-[11px] truncate">
                  <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{selectedItem.timestamp}</span>
                </div>
                <div className="flex items-start gap-1.5 text-neutral-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{selectedItem.location}</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono pt-1">
                  <span>{selectedItem.resolution}</span>
                  <span>{selectedItem.fileName}</span>
                </div>
              </div>
            )}

            {/* Thumbnail list */}
            <div className="flex-1 p-3 overflow-x-auto md:overflow-y-auto flex md:grid md:grid-cols-3 gap-2">
              {mediaList.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setShowOriginal(false);
                  }}
                  className={`w-16 h-16 md:w-full md:aspect-square shrink-0 rounded-md overflow-hidden relative border-2 transition-all cursor-pointer ${
                    selectedIndex === idx ? 'border-[#00a0e9] scale-102 ring-2 ring-[#00a0e9]/50' : 'border-neutral-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.url}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute bottom-1 right-1 bg-black/80 rounded px-1 text-[9px] font-mono flex items-center gap-0.5">
                      <Film className="w-2.5 h-2.5 text-red-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
