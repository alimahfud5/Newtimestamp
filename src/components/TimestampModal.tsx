import React, { useState } from 'react';
import {
  TimestampConfig,
  LocationData,
  TextSize,
  FontFamily,
  PositionLayout,
  GPSFormat,
} from '../types/camera';
import { X, Check, MoreHorizontal, ChevronRight, Upload, Sparkles, MapPin, Compass, ArrowUpDown } from 'lucide-react';

interface TimestampModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TimestampConfig;
  onChangeConfig: (newConfig: TimestampConfig) => void;
  location: LocationData;
  onChangeLocation: (newLocation: LocationData) => void;
  onOpenTextOrder: () => void;
  backgroundOpacity?: number;
  onChangeBackgroundOpacity?: (val: number) => void;
}

export const TimestampModal: React.FC<TimestampModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  location,
  onChangeLocation,
  onOpenTextOrder,
  backgroundOpacity = 0,
  onChangeBackgroundOpacity,
}) => {
  if (!isOpen) return null;

  // Sub-dialog states
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [customTextInput, setCustomTextInput] = useState(config.customText || '');
  const [customStreet, setCustomStreet] = useState(location.street);
  const [customSubdistrict, setCustomSubdistrict] = useState(location.subdistrict);
  const [customDistrict, setCustomDistrict] = useState(location.district);
  const [customCity, setCustomCity] = useState(location.city);
  const [customProvince, setCustomProvince] = useState(location.province);
  const [tagInput, setTagInput] = useState(config.tagText || '');

  // Color options
  const colorPalette = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Yellow', hex: '#facc15' },
    { name: 'Cyan', hex: '#38bdf8' },
    { name: 'Green', hex: '#4ade80' },
    { name: 'Red', hex: '#f87171' },
    { name: 'Orange', hex: '#fb923c' },
    { name: 'Pink', hex: '#f472b6' },
    { name: 'Black', hex: '#000000' },
  ];

  // Font options
  const fontOptions: { id: FontFamily; label: string }[] = [
    { id: 'default', label: 'Default font' },
    { id: 'monospace', label: 'Monospace font' },
    { id: 'roboto', label: 'Roboto clean' },
    { id: 'bold', label: 'Bold heavy' },
    { id: 'digital', label: 'Digital LCD' },
    { id: 'serif', label: 'Classic Serif' },
  ];

  // Position options
  const positionOptions: { id: PositionLayout; label: string }[] = [
    { id: 'bottom-right', label: 'Bottom Right' },
    { id: 'bottom-left', label: 'Bottom Left' },
    { id: 'top-right', label: 'Top Right' },
    { id: 'top-left', label: 'Top Left' },
    { id: 'bottom-center', label: 'Bottom Center' },
    { id: 'top-center', label: 'Top Center' },
  ];

  // Date format options
  const dateFormatOptions = [
    'DD MMM YYYY HH.mm.ss',
    'YYYY-MM-DD HH:mm:ss',
    'MM/DD/YYYY hh:mm:ss A',
    'DD/MM/YYYY HH:mm:ss',
  ];

  // Resolutions
  const resolutionOptions = [
    '4080 x 3060',
    '1920 x 1080',
    '1280 x 720',
    '1080 x 1080',
  ];

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeConfig({
            ...config,
            watermarkLogoUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md max-h-[92vh] flex flex-col overflow-hidden text-neutral-800 text-sm font-sans">
        {/* Header matching Android app styling */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/80">
          <h2 className="font-semibold text-neutral-800 text-base">Timestamp Configuration</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {/* Row 1: Font Color */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'color' ? null : 'color')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>Font Color</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-sm border border-neutral-300 shadow-xs"
                  style={{ backgroundColor: config.fontColor }}
                />
                <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
              </div>
            </button>
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'color' ? null : 'color')}
              className="ml-2 text-[#00a0e9] hover:text-[#0086c3] p-1"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Submenu: Color Picker */}
          {activeSubMenu === 'color' && (
            <div className="p-2.5 bg-neutral-50 rounded border border-neutral-200 grid grid-cols-4 gap-2">
              {colorPalette.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => {
                    onChangeConfig({ ...config, fontColor: col.hex });
                    setActiveSubMenu(null);
                  }}
                  className="flex items-center gap-1.5 p-1 rounded hover:bg-white text-xs"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-neutral-400"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Row: Background text transparency */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => {
                if (onChangeBackgroundOpacity) {
                  onChangeBackgroundOpacity(backgroundOpacity === 0 ? 30 : 0);
                }
              }}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>Background teks</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00a0e9] font-normal">
                  {backgroundOpacity === 0 ? 'Transparan (0%)' : `Gelap (${backgroundOpacity}%)`}
                </span>
                <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
              </div>
            </button>
            <button
              onClick={() => {
                if (onChangeBackgroundOpacity) {
                  onChangeBackgroundOpacity(backgroundOpacity === 0 ? 30 : 0);
                }
              }}
              className="ml-2 text-[#00a0e9] hover:text-[#0086c3] p-1"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Row 2: Text Size */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'size' ? null : 'size')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>Text size ({config.textSize.charAt(0).toUpperCase() + config.textSize.slice(1)})</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
          </div>

          {/* Submenu: Text Size */}
          {activeSubMenu === 'size' && (
            <div className="p-2 bg-neutral-50 rounded border border-neutral-200 space-y-1">
              {(['small', 'medium', 'large', 'xlarge'] as TextSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    onChangeConfig({ ...config, textSize: sz });
                    setActiveSubMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                    config.textSize === sz ? 'bg-[#00a0e9] text-white font-semibold' : 'hover:bg-neutral-200'
                  }`}
                >
                  <span>{sz.charAt(0).toUpperCase() + sz.slice(1)}</span>
                  {config.textSize === sz && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Row 3: Default font */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'font' ? null : 'font')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>{fontOptions.find((f) => f.id === config.fontFamily)?.label || 'Default font'}</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'font' ? null : 'font')}
              className="ml-2 text-[#00a0e9] hover:text-[#0086c3] p-1"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Submenu: Font options */}
          {activeSubMenu === 'font' && (
            <div className="p-2 bg-neutral-50 rounded border border-neutral-200 space-y-1">
              {fontOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onChangeConfig({ ...config, fontFamily: f.id });
                    setActiveSubMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                    config.fontFamily === f.id ? 'bg-[#00a0e9] text-white font-semibold' : 'hover:bg-neutral-200'
                  }`}
                >
                  <span>{f.label}</span>
                  {config.fontFamily === f.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Row 4: Position (Bottom Right, etc.) */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'position' ? null : 'position')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>{positionOptions.find((p) => p.id === config.position)?.label || 'Bottom Right'}</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
          </div>

          {/* Submenu: Position options */}
          {activeSubMenu === 'position' && (
            <div className="p-2 bg-neutral-50 rounded border border-neutral-200 space-y-1">
              {positionOptions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => {
                    onChangeConfig({ ...config, position: pos.id });
                    setActiveSubMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                    config.position === pos.id ? 'bg-[#00a0e9] text-white font-semibold' : 'hover:bg-neutral-200'
                  }`}
                >
                  <span>{pos.label}</span>
                  {config.position === pos.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Row 5: Date format preview */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'dateFormat' ? null : 'dateFormat')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span className="truncate">11 Nov 2026 13.15.37</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
          </div>

          {/* Submenu: Date format */}
          {activeSubMenu === 'dateFormat' && (
            <div className="p-2 bg-neutral-50 rounded border border-neutral-200 space-y-1">
              {dateFormatOptions.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    onChangeConfig({ ...config, dateFormat: fmt });
                    setActiveSubMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                    config.dateFormat === fmt ? 'bg-[#00a0e9] text-white font-semibold' : 'hover:bg-neutral-200'
                  }`}
                >
                  <span>{fmt}</span>
                  {config.dateFormat === fmt && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Row 6: Address Preview / Editor */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'address' ? null : 'address')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium truncate"
            >
              <span className="truncate pr-2">{location.street} {location.subdistrict}..</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'address' ? null : 'address')}
              className="ml-2 text-[#00a0e9] hover:text-[#0086c3] p-1"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Submenu: Location Editor */}
          {activeSubMenu === 'address' && (
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2">
              <span className="font-semibold text-xs text-neutral-700">Edit Location Watermark Details:</span>
              <input
                type="text"
                value={customStreet}
                onChange={(e) => setCustomStreet(e.target.value)}
                placeholder="Street address (e.g. 936 Jalan MT. Haryono)"
                className="w-full text-xs p-1.5 border rounded bg-white"
              />
              <input
                type="text"
                value={customSubdistrict}
                onChange={(e) => setCustomSubdistrict(e.target.value)}
                placeholder="Sub-district (e.g. Peterongan)"
                className="w-full text-xs p-1.5 border rounded bg-white"
              />
              <input
                type="text"
                value={customDistrict}
                onChange={(e) => setCustomDistrict(e.target.value)}
                placeholder="District (e.g. Kecamatan Semarang Selatan)"
                className="w-full text-xs p-1.5 border rounded bg-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="City (Kota Semarang)"
                  className="w-1/2 text-xs p-1.5 border rounded bg-white"
                />
                <input
                  type="text"
                  value={customProvince}
                  onChange={(e) => setCustomProvince(e.target.value)}
                  placeholder="Province (Jawa Tengah)"
                  className="w-1/2 text-xs p-1.5 border rounded bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    onChangeLocation({
                      ...location,
                      street: customStreet,
                      subdistrict: customSubdistrict,
                      district: customDistrict,
                      city: customCity,
                      province: customProvince,
                    });
                    setActiveSubMenu(null);
                  }}
                  className="px-3 py-1 bg-[#00a0e9] text-white text-xs rounded hover:bg-[#0086c3]"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {/* Row 7: GPS Format */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'gps' ? null : 'gps')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>{config.gpsFormat === 'none' ? 'None (GPS)' : `GPS (${config.gpsFormat.toUpperCase()})`}</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
          </div>

          {/* Submenu: GPS formats */}
          {activeSubMenu === 'gps' && (
            <div className="p-2 bg-neutral-50 rounded border border-neutral-200 space-y-1">
              {(['none', 'decimal', 'dms', 'utm'] as GPSFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    onChangeConfig({ ...config, gpsFormat: fmt });
                    setActiveSubMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                    config.gpsFormat === fmt ? 'bg-[#00a0e9] text-white font-semibold' : 'hover:bg-neutral-200'
                  }`}
                >
                  <span className="capitalize">{fmt === 'none' ? 'None (GPS)' : fmt}</span>
                  {config.gpsFormat === fmt && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Row 8: Resolution */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <button
              onClick={() => setActiveSubMenu(activeSubMenu === 'res' ? null : 'res')}
              className="flex-1 flex items-center justify-between text-left py-1 text-neutral-800 font-medium"
            >
              <span>{config.resolution}</span>
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-neutral-500" />
            </button>
          </div>

          {/* Submenu: Resolutions */}
          {activeSubMenu === 'res' && (
            <div className="p-2 bg-neutral-50 rounded border border-neutral-200 space-y-1">
              {resolutionOptions.map((res) => (
                <button
                  key={res}
                  onClick={() => {
                    onChangeConfig({ ...config, resolution: res });
                    setActiveSubMenu(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                    config.resolution === res ? 'bg-[#00a0e9] text-white font-semibold' : 'hover:bg-neutral-200'
                  }`}
                >
                  <span>{res}</span>
                  {config.resolution === res && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          {/* Custom text section matching Image 3 */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-neutral-600 mb-1.5">
              <span className="text-xs font-medium">Display custom text on camera</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCustomTextInput('');
                    onChangeConfig({ ...config, customText: '', showCustomText: false });
                  }}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onChangeConfig({
                      ...config,
                      customText: customTextInput,
                      showCustomText: !!customTextInput.trim(),
                    });
                  }}
                  className="text-[#00a0e9] font-semibold text-xs hover:underline"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={customTextInput}
                onChange={(e) => setCustomTextInput(e.target.value)}
                placeholder="Support multi-line and emoji"
                rows={2}
                className="w-full text-xs p-2 pr-12 border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#00a0e9] resize-none"
              />
              <button
                onClick={() => {
                  setCustomTextInput('Project Inspection #12\nField Inspector: Budi S.');
                }}
                className="absolute right-2 bottom-3 text-xs text-[#00a0e9] hover:underline"
              >
                Load
              </button>
            </div>
          </div>

          {/* Toggles list with blue dots */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            {/* Show map */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-neutral-800">Show map</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChangeConfig({ ...config, showMap: !config.showMap })}
                  className="text-[#00a0e9]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onChangeConfig({ ...config, showMap: !config.showMap })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    config.showMap ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      config.showMap ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Show compass */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-neutral-800">Show compass</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChangeConfig({ ...config, showCompass: !config.showCompass })}
                  className="text-[#00a0e9]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onChangeConfig({ ...config, showCompass: !config.showCompass })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    config.showCompass ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      config.showCompass ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Show altitude and speed */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-neutral-800">Show altitude and speed</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChangeConfig({ ...config, showAltitudeSpeed: !config.showAltitudeSpeed })}
                  className="text-[#00a0e9]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onChangeConfig({ ...config, showAltitudeSpeed: !config.showAltitudeSpeed })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    config.showAltitudeSpeed ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      config.showAltitudeSpeed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Show index number */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-neutral-800">Show index number</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newIdx = prompt('Set starting index number:', String(config.indexNumber));
                    if (newIdx !== null) {
                      onChangeConfig({ ...config, indexNumber: parseInt(newIdx, 10) || 1 });
                    }
                  }}
                  className="text-[#00a0e9]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onChangeConfig({ ...config, showIndexNumber: !config.showIndexNumber })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    config.showIndexNumber ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      config.showIndexNumber ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Timestamp margins */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-neutral-800">Timestamp margins</span>
              <button
                onClick={() => {
                  const nextMargin =
                    config.timestampMargins === 'one-line'
                      ? 'two-lines'
                      : config.timestampMargins === 'two-lines'
                      ? 'none'
                      : 'one-line';
                  onChangeConfig({ ...config, timestampMargins: nextMargin });
                }}
                className="text-[#00a0e9] flex items-center text-xs"
              >
                <span>
                  {config.timestampMargins === 'one-line'
                    ? 'One line'
                    : config.timestampMargins === 'two-lines'
                    ? 'Two lines'
                    : 'None'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons (Cyan/Light Blue) matching Image 3 */}
          <div className="pt-3 space-y-2">
            {/* Change text order */}
            <button
              onClick={onOpenTextOrder}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Change text order</span>
            </button>

            {/* Import watermark logo */}
            <div className="flex items-center gap-2">
              <label className="flex-1 py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{config.watermarkLogoUrl ? 'Change watermark logo' : 'Import watermark logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {config.watermarkLogoUrl && (
                <button
                  onClick={() => onChangeConfig({ ...config, watermarkLogoUrl: null })}
                  title="Remove logo"
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Add Tag */}
            <button
              onClick={() => {
                const tag = prompt('Enter tag text (e.g. #ProjectCivilWork, #Verified):', tagInput);
                if (tag !== null) {
                  setTagInput(tag);
                  onChangeConfig({ ...config, tagText: tag });
                }
              }}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{config.tagText ? `Tag: ${config.tagText}` : 'Add Tag'}</span>
            </button>

            {/* Display button on main interface */}
            <button
              onClick={() => {
                alert('Shortcut button enabled on main camera interface for quick timestamp access.');
              }}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors"
            >
              Display button on the main interface
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-1.5 rounded bg-[#00a0e9] text-white font-semibold text-xs sm:text-sm hover:bg-[#0086c3] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
