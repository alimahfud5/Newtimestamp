import React, { useEffect, useState } from 'react';
import {
  TimestampConfig,
  GeneralSettings,
  LocationData,
} from '../types/camera';
import { formatDateTime, formatGPSCoordinates } from '../utils/location';
import { Navigation, MapPin } from 'lucide-react';

interface WatermarkOverlayProps {
  config: TimestampConfig;
  settings: GeneralSettings;
  location: LocationData;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  config,
  settings,
  location,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Real-time ticking clock for the live camera viewfinder
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Text size classes
  const textSizeClass = {
    small: 'text-xs leading-tight',
    medium: 'text-sm sm:text-base leading-snug',
    large: 'text-base sm:text-lg leading-normal',
    xlarge: 'text-lg sm:text-xl leading-normal font-semibold',
  }[config.textSize] || 'text-sm sm:text-base leading-snug';

  // Font family styles
  const fontStyle = {
    default: 'font-sans',
    monospace: 'font-mono',
    serif: 'font-serif',
    roboto: 'font-sans tracking-wide',
    bold: 'font-black tracking-tight',
    digital: 'font-mono tracking-widest',
  }[config.fontFamily] || 'font-sans';

  // Position alignment classes
  const positionClass = {
    'bottom-right': 'bottom-6 right-5 text-right items-end',
    'bottom-left': 'bottom-6 left-5 text-left items-start',
    'top-right': 'top-16 right-5 text-right items-end',
    'top-left': 'top-16 left-5 text-left items-start',
    'top-center': 'top-16 left-1/2 -translate-x-1/2 text-center items-center',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 text-center items-center',
  }[config.position] || 'bottom-6 right-5 text-right items-end';

  // Margins modifier
  const marginPadding = {
    'none': 'p-1',
    'one-line': 'p-2.5',
    'two-lines': 'p-4',
  }[config.timestampMargins] || 'p-2.5';

  // Build the lines in accordance with textOrder
  const lines: string[] = [];

  const addLine = (type: string) => {
    switch (type) {
      case 'datetime':
        lines.push(formatDateTime(currentTime, config.dateFormat));
        break;
      case 'street':
        if (location.street) lines.push(location.street);
        break;
      case 'subdistrict':
        if (location.subdistrict) lines.push(location.subdistrict);
        break;
      case 'district':
        if (location.district) lines.push(location.district);
        break;
      case 'city':
        if (location.city) lines.push(location.city);
        break;
      case 'province':
        if (location.province) lines.push(location.province);
        break;
      case 'custom':
        if (config.showCustomText && config.customText.trim()) {
          config.customText.split('\n').forEach((line) => {
            if (line.trim()) lines.push(line.trim());
          });
        }
        break;
      case 'gps': {
        const gpsStr = formatGPSCoordinates(location.latitude, location.longitude, config.gpsFormat);
        if (gpsStr) lines.push(gpsStr);
        break;
      }
      case 'alt-speed':
        if (config.showAltitudeSpeed) {
          lines.push(`Elev: ${location.altitude}m  Speed: ${location.speed}km/h`);
        }
        break;
      case 'index':
        if (config.showIndexNumber) {
          lines.push(`#${String(config.indexNumber).padStart(4, '0')}`);
        }
        break;
    }
  };

  const order = config.textOrder && config.textOrder.length > 0
    ? config.textOrder
    : ['datetime', 'street', 'subdistrict', 'district', 'city', 'province', 'custom', 'gps', 'alt-speed', 'index'];

  order.forEach(addLine);

  const bgOpacity = (settings.backgroundOpacity ?? 0) / 100;
  const textOpacity = (settings.textOpacity ?? 100) / 100;
  const bgRgba = bgOpacity > 0 ? hexToRgba(settings.backgroundColor || '#000000', bgOpacity) : 'transparent';

  return (
    <div
      className={`absolute pointer-events-none z-20 flex flex-col transition-all duration-300 max-w-[85vw] ${positionClass}`}
    >
      <div
        className={`rounded-lg ${marginPadding} flex flex-col backdrop-blur-none transition-all`}
        style={{
          backgroundColor: bgRgba,
        }}
      >
        {/* Background container opacity separate from text */}
        <div
          className="flex flex-col"
          style={{
            color: config.fontColor || '#ffffff',
            opacity: textOpacity,
          }}
        >
          {/* Top badges row if map, compass or logo enabled */}
          {(config.showMap || config.showCompass || config.watermarkLogoUrl) && (
            <div
              className={`flex items-center gap-2 mb-1.5 ${
                config.position.includes('right')
                  ? 'justify-end'
                  : config.position.includes('center')
                  ? 'justify-center'
                  : 'justify-start'
              }`}
            >
              {config.watermarkLogoUrl && (
                <img
                  src={config.watermarkLogoUrl}
                  alt="Watermark Logo"
                  className="h-8 max-w-[90px] object-contain drop-shadow"
                />
              )}

              {config.showMap && (
                <div className="w-12 h-12 rounded bg-slate-900/80 border border-sky-400 flex flex-col items-center justify-center relative overflow-hidden shadow">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px]"></div>
                  <MapPin className="w-5 h-5 text-red-500 fill-red-500 relative z-10 animate-bounce" />
                  <span className="text-[8px] font-mono text-sky-200 relative z-10 tracking-tighter">MAP</span>
                </div>
              )}

              {config.showCompass && (
                <div className="w-11 h-11 rounded-full bg-slate-900/85 border border-white/80 flex items-center justify-center relative shadow">
                  <div
                    className="transition-transform duration-500"
                    style={{ transform: `rotate(${location.compassHeading || 0}deg)` }}
                  >
                    <Navigation className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                  <span className="absolute bottom-0 text-[8px] font-bold text-white leading-none">
                    {Math.round(location.compassHeading || 0)}°
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Watermark text lines matching screenshot typography */}
          <div
            className={`flex flex-col ${textSizeClass} ${fontStyle}`}
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {lines.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap select-none font-normal tracking-normal drop-shadow-md">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
