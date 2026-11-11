import {
  TimestampConfig,
  GeneralSettings,
  LocationData,
  FacingMode,
} from '../types/camera';
import { formatDateTime, formatGPSCoordinates } from './location';

interface RenderOptions {
  videoElement: HTMLVideoElement | HTMLCanvasElement;
  timestampConfig: TimestampConfig;
  generalSettings: GeneralSettings;
  location: LocationData;
  facingMode: FacingMode;
  customDate?: Date;
}

export function renderPhotoWithWatermark({
  videoElement,
  timestampConfig,
  generalSettings,
  location,
  facingMode,
  customDate = new Date(),
}: RenderOptions): { watermarkedDataUrl: string; originalDataUrl: string } {
  // Determine width and height
  let width = 1920;
  let height = 1440;

  if (videoElement instanceof HTMLVideoElement) {
    width = videoElement.videoWidth || 1920;
    height = videoElement.videoHeight || 1440;
  } else if (videoElement instanceof HTMLCanvasElement) {
    width = videoElement.width || 1920;
    height = videoElement.height || 1440;
  }

  // Parse resolution override if chosen in timestamp settings
  if (timestampConfig.resolution === '4080 x 3060') {
    width = 4080;
    height = 3060;
  } else if (timestampConfig.resolution === '1920 x 1080') {
    width = 1920;
    height = 1080;
  } else if (timestampConfig.resolution === '1280 x 720') {
    width = 1280;
    height = 720;
  } else if (timestampConfig.resolution === '1080 x 1080') {
    width = 1080;
    height = 1080;
  }

  // 1. Create clean original canvas
  const origCanvas = document.createElement('canvas');
  origCanvas.width = width;
  origCanvas.height = height;
  const origCtx = origCanvas.getContext('2d')!;

  origCtx.save();
  const shouldMirror = generalSettings.mirrorFrontCamera && facingMode === 'user';
  if (shouldMirror) {
    origCtx.translate(width, 0);
    origCtx.scale(-1, 1);
  }

  // Apply color effect filter
  origCtx.filter = getColorFilter(generalSettings.colorEffect);
  origCtx.drawImage(videoElement, 0, 0, width, height);
  origCtx.restore();

  const originalDataUrl = origCanvas.toDataURL('image/jpeg', 0.95);

  // 2. Create watermarked canvas
  const wmCanvas = document.createElement('canvas');
  wmCanvas.width = width;
  wmCanvas.height = height;
  const ctx = wmCanvas.getContext('2d')!;

  // Copy original image
  ctx.drawImage(origCanvas, 0, 0);

  // Draw Watermark Overlay
  drawWatermarkOnCanvas(ctx, width, height, timestampConfig, generalSettings, location, customDate);

  const watermarkedDataUrl = wmCanvas.toDataURL('image/jpeg', 0.95);

  return {
    watermarkedDataUrl,
    originalDataUrl,
  };
}

export function drawWatermarkOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: TimestampConfig,
  settings: GeneralSettings,
  location: LocationData,
  date: Date
) {
  // Scale factor relative to reference 1920x1080
  const scale = Math.max(1, width / 1400);

  // Determine font size
  const fontSizes: Record<string, number> = {
    small: 18 * scale,
    medium: 26 * scale,
    large: 34 * scale,
    xlarge: 44 * scale,
  };
  const baseFontSize = fontSizes[config.textSize] || 26 * scale;

  // Font family
  const fontFamilyMap: Record<string, string> = {
    default: 'system-ui, -apple-system, sans-serif',
    monospace: '"Roboto Mono", monospace',
    serif: 'Georgia, serif',
    roboto: '"Roboto", sans-serif',
    bold: '"Arial Black", Impact, sans-serif',
    digital: '"Courier New", monospace',
  };
  const fontFamily = fontFamilyMap[config.fontFamily] || fontFamilyMap.default;

  // Build the lines of text based on textOrder
  const lines: string[] = [];

  const addLine = (type: string) => {
    switch (type) {
      case 'datetime':
        lines.push(formatDateTime(date, config.dateFormat));
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
          const split = config.customText.split('\n');
          split.forEach((s) => {
            if (s.trim()) lines.push(s.trim());
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
          const idxStr = String(config.indexNumber).padStart(4, '0');
          lines.push(`#${idxStr}`);
        }
        break;
    }
  };

  const order = config.textOrder && config.textOrder.length > 0
    ? config.textOrder
    : ['datetime', 'street', 'subdistrict', 'district', 'city', 'province', 'custom', 'gps', 'alt-speed', 'index'];

  order.forEach(addLine);

  if (lines.length === 0) return;

  // Calculate text dimensions
  ctx.save();
  ctx.font = `400 ${baseFontSize}px ${fontFamily}`;

  const lineHeight = baseFontSize * 1.35;
  let maxLineWidth = 0;
  for (const line of lines) {
    const metrics = ctx.measureText(line);
    if (metrics.width > maxLineWidth) {
      maxLineWidth = metrics.width;
    }
  }

  // Padding & margins
  const marginX = (config.timestampMargins === 'none' ? 12 : config.timestampMargins === 'two-lines' ? 50 : 30) * scale;
  const marginY = (config.timestampMargins === 'none' ? 12 : config.timestampMargins === 'two-lines' ? 50 : 30) * scale;
  const padX = 14 * scale;
  const padY = 12 * scale;

  let totalWidth = maxLineWidth + padX * 2;
  const totalHeight = lines.length * lineHeight + padY * 2;

  // Extra width if showing map or compass beside or above
  const badgeSize = (config.showMap || config.showCompass) ? 70 * scale : 0;
  if (badgeSize > 0) {
    totalWidth = Math.max(totalWidth, badgeSize * 2.2);
  }

  // Compute position
  let boxX = 0;
  let boxY = 0;
  let textAlign: CanvasTextAlign = 'right';

  if (config.position === 'bottom-right') {
    boxX = width - totalWidth - marginX;
    boxY = height - totalHeight - marginY;
    textAlign = 'right';
  } else if (config.position === 'bottom-left') {
    boxX = marginX;
    boxY = height - totalHeight - marginY;
    textAlign = 'left';
  } else if (config.position === 'top-right') {
    boxX = width - totalWidth - marginX;
    boxY = marginY;
    textAlign = 'right';
  } else if (config.position === 'top-left') {
    boxX = marginX;
    boxY = marginY;
    textAlign = 'left';
  } else if (config.position === 'top-center') {
    boxX = (width - totalWidth) / 2;
    boxY = marginY;
    textAlign = 'center';
  } else if (config.position === 'bottom-center') {
    boxX = (width - totalWidth) / 2;
    boxY = height - totalHeight - marginY;
    textAlign = 'center';
  }

  // Draw background if opacity > 0
  const bgOpacity = (settings.backgroundOpacity ?? 0) / 100;
  if (bgOpacity > 0) {
    ctx.save();
    ctx.fillStyle = hexToRgba(settings.backgroundColor || '#000000', bgOpacity);
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, totalWidth, totalHeight, 8 * scale);
    ctx.fill();
    ctx.restore();
  }

  // Optional mini map badge
  if (config.showMap) {
    drawMiniMapBadge(ctx, boxX + padX, boxY + padY, 50 * scale, location);
  }

  // Optional compass badge
  if (config.showCompass) {
    const compassX = config.showMap ? boxX + padX + 60 * scale : boxX + padX;
    drawMiniCompassBadge(ctx, compassX, boxY + padY, 40 * scale, location.compassHeading);
  }

  // Draw Text Lines
  const textOpacity = (settings.textOpacity ?? 100) / 100;
  ctx.fillStyle = hexToRgba(config.fontColor || '#ffffff', textOpacity);
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'top';

  // Crisp drop shadow for high readability matching the app
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetX = 1.5 * scale;
  ctx.shadowOffsetY = 1.5 * scale;

  let textX = boxX + totalWidth - padX;
  if (textAlign === 'left') textX = boxX + padX;
  if (textAlign === 'center') textX = boxX + totalWidth / 2;

  let textY = boxY + padY;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], textX, textY + i * lineHeight);
  }

  ctx.restore();
}

function drawMiniCompassBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  heading: number
) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Rotate needle to heading
  ctx.rotate(((heading || 0) * Math.PI) / 180);

  // Red North needle
  ctx.beginPath();
  ctx.moveTo(0, -size / 2 + 4);
  ctx.lineTo(-size / 6, 0);
  ctx.lineTo(size / 6, 0);
  ctx.closePath();
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  // White South needle
  ctx.beginPath();
  ctx.moveTo(0, size / 2 - 4);
  ctx.lineTo(-size / 6, 0);
  ctx.lineTo(size / 6, 0);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}

function drawMiniMapBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  location: LocationData
) {
  ctx.save();
  ctx.translate(x, y);

  // Border & background
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 4);
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Draw grid lines resembling a map
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size * 0.3, 0);
  ctx.lineTo(size * 0.3, size);
  ctx.moveTo(size * 0.7, 0);
  ctx.lineTo(size * 0.7, size);
  ctx.moveTo(0, size * 0.4);
  ctx.lineTo(size, size * 0.4);
  ctx.stroke();

  // Draw map route curve
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(2, size - 4);
  ctx.quadraticCurveTo(size * 0.4, size * 0.6, size * 0.5, size * 0.5);
  ctx.stroke();

  // Draw red map pin
  ctx.beginPath();
  ctx.arc(size / 2, size / 2 - 2, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function getColorFilter(effect: string): string {
  switch (effect) {
    case 'Mono':
      return 'grayscale(100%) contrast(110%)';
    case 'Sepia':
      return 'sepia(80%) brightness(95%)';
    case 'Negative':
      return 'invert(100%)';
    case 'Vivid':
      return 'saturate(150%) contrast(108%)';
    case 'Cool':
      return 'hue-rotate(180deg) saturate(110%)';
    default:
      return 'none';
  }
}

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
