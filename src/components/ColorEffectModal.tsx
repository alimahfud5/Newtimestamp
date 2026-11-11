import React from 'react';
import { ColorEffect } from '../types/camera';
import { X, Check } from 'lucide-react';

interface ColorEffectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEffect: ColorEffect;
  onSelectEffect: (effect: ColorEffect) => void;
}

export const ColorEffectModal: React.FC<ColorEffectModalProps> = ({
  isOpen,
  onClose,
  currentEffect,
  onSelectEffect,
}) => {
  if (!isOpen) return null;

  const effects: { id: ColorEffect; label: string; filterStyle: string }[] = [
    { id: 'Normal', label: 'Normal', filterStyle: 'none' },
    { id: 'Mono', label: 'Mono / B&W', filterStyle: 'grayscale(100%)' },
    { id: 'Sepia', label: 'Warm Sepia', filterStyle: 'sepia(85%)' },
    { id: 'Vivid', label: 'Vivid Color', filterStyle: 'saturate(160%)' },
    { id: 'Cool', label: 'Cool Cyan', filterStyle: 'hue-rotate(180deg)' },
    { id: 'Negative', label: 'Negative', filterStyle: 'invert(100%)' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden flex flex-col text-neutral-800 text-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-semibold text-neutral-800">Color Effects</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-3 space-y-1.5">
          {effects.map((fx) => (
            <button
              key={fx.id}
              onClick={() => {
                onSelectEffect(fx.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-2 rounded text-xs transition-colors ${
                currentEffect === fx.id
                  ? 'bg-[#00a0e9] text-white font-semibold'
                  : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded border border-neutral-400 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500"
                  style={{ filter: fx.filterStyle }}
                />
                <span>{fx.label}</span>
              </div>
              {currentEffect === fx.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
