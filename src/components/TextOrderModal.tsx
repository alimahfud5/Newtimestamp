import React from 'react';
import { X, ArrowUp, ArrowDown, Check } from 'lucide-react';

interface TextOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: string[];
  onChangeOrder: (newOrder: string[]) => void;
}

const LINE_LABELS: Record<string, string> = {
  datetime: '1. Date & Time (e.g. 11 Nov 2026 13.16.26)',
  street: '2. Street Address (936 Jalan MT. Haryono)',
  subdistrict: '3. Sub-district (Peterongan)',
  district: '4. District (Kecamatan Semarang Selatan)',
  city: '5. City (Kota Semarang)',
  province: '6. Province (Jawa Tengah)',
  custom: '7. Custom Text',
  gps: '8. GPS Coordinates',
  'alt-speed': '9. Altitude & Speed',
  index: '10. Index Number (#0001)',
};

export const TextOrderModal: React.FC<TextOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onChangeOrder,
}) => {
  if (!isOpen) return null;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...order];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onChangeOrder(next);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const next = [...order];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onChangeOrder(next);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col text-neutral-800 text-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-semibold text-neutral-800">Change Text Order</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-4 space-y-1.5 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-neutral-500 mb-2">
            Use the arrows to reorder lines displayed on the camera watermark:
          </p>
          {order.map((key, idx) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 rounded bg-neutral-100 border border-neutral-200 text-xs font-medium"
            >
              <span className="truncate pr-2">{LINE_LABELS[key] || key}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-neutral-200 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4 text-neutral-700" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === order.length - 1}
                  className="p-1 rounded hover:bg-neutral-200 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4 text-neutral-700" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex justify-between">
          <button
            onClick={() => {
              onChangeOrder(['datetime', 'street', 'subdistrict', 'district', 'city', 'province', 'custom', 'gps', 'alt-speed', 'index']);
            }}
            className="text-xs text-neutral-600 hover:underline"
          >
            Reset Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#00a0e9] text-white text-xs font-semibold hover:bg-[#0086c3] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
