import React, { useEffect, useState } from 'react';
import { CameraMode, CapturedMedia } from '../types/camera';

interface BottomControlsProps {
  mode: CameraMode;
  onSelectMode: (mode: CameraMode) => void;
  onShutterPress: () => void;
  isRecording: boolean;
  recordingDuration: number;
  lastMedia: CapturedMedia | null;
  onOpenGallery: () => void;
  onOpenTimestampSettings: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  mode,
  onSelectMode,
  onShutterPress,
  isRecording,
  recordingDuration,
  lastMedia,
  onOpenGallery,
  onOpenTimestampSettings,
}) => {
  // Live ticking analog clock icon hand angles
  const [clockHands, setClockHands] = useState({ hour: 0, minute: 0, second: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      setClockHands({
        second: sec * 6, // 360 / 60
        minute: min * 6 + sec * 0.1,
        hour: hr * 30 + min * 0.5,
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format recording seconds to 00:00:00
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/90 pb-6 pt-2 flex flex-col items-center select-none">
      {/* Recording Duration Indicator (in Video mode when active) */}
      {isRecording && (
        <div className="flex items-center gap-2 mb-2 bg-red-600/90 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
          <span>{formatDuration(recordingDuration)}</span>
        </div>
      )}

      {/* Mode Switcher: Photo / Video Tabs */}
      {!isRecording && (
        <div className="flex items-center gap-8 mb-3 text-sm font-semibold tracking-wide">
          <button
            onClick={() => onSelectMode('photo')}
            className={`transition-all pb-1 cursor-pointer ${
              mode === 'photo'
                ? 'text-white font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Photo
          </button>
          <button
            onClick={() => onSelectMode('video')}
            className={`transition-all pb-1 cursor-pointer ${
              mode === 'video'
                ? 'text-white font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Video
          </button>
        </div>
      )}

      {/* Main Buttons Row: Gallery Thumbnail | Shutter Button | Timestamp Settings Clock */}
      <div className="w-full max-w-md px-8 flex items-center justify-between">
        {/* Left: Gallery Thumbnail */}
        <div className="w-14 h-14 flex items-center justify-center">
          <button
            onClick={onOpenGallery}
            title="Open Gallery"
            className="w-12 h-12 rounded-lg bg-neutral-800 border-2 border-white/60 overflow-hidden relative shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
          >
            {lastMedia ? (
              <img
                src={lastMedia.url}
                alt="Last capture"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-700/80 flex items-center justify-center">
                <div className="w-4 h-4 rounded bg-white/30" />
              </div>
            )}
          </button>
        </div>

        {/* Center: Large Shutter Button matching exact screenshot */}
        <div className="flex items-center justify-center">
          <button
            onClick={onShutterPress}
            title={mode === 'photo' ? 'Take Photo' : isRecording ? 'Stop Recording' : 'Start Recording'}
            className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-all shadow-xl p-1 focus:outline-none"
          >
            {mode === 'photo' ? (
              /* Photo Shutter: Solid white inner circle */
              <div className="w-16 h-16 rounded-full bg-white shadow-inner transition-transform hover:scale-95 active:scale-90" />
            ) : isRecording ? (
              /* Video Recording: Rounded red square */
              <div className="w-8 h-8 rounded-md bg-red-600 transition-all shadow-md animate-pulse" />
            ) : (
              /* Video Standby: Solid red circle */
              <div className="w-16 h-16 rounded-full bg-red-600 transition-transform hover:scale-95 active:scale-90 shadow-md" />
            )}
          </button>
        </div>

        {/* Right: Analog Clock shortcut matching screenshot 1 & 2 */}
        <div className="w-14 h-14 flex items-center justify-center">
          <button
            onClick={onOpenTimestampSettings}
            title="Timestamp Settings"
            className="w-12 h-12 rounded-full bg-black border-2 border-white relative flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            {/* SVG Analog Clock Face */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-1">
              {/* Outer tick marks */}
              <circle cx="50" cy="50" r="46" fill="black" stroke="#ffffff" strokeWidth="2" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="50"
                  y1={deg % 90 === 0 ? "8" : "11"}
                  x2="50"
                  y2="15"
                  stroke="#ffffff"
                  strokeWidth={deg % 90 === 0 ? "3" : "1.5"}
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}

              {/* Hour hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="28"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${clockHands.hour} 50 50)`}
              />

              {/* Minute hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${clockHands.minute} 50 50)`}
              />

              {/* Red Second hand (iconic red hand from the screenshot) */}
              <line
                x1="50"
                y1="56"
                x2="50"
                y2="14"
                stroke="#ef4444"
                strokeWidth="1.8"
                strokeLinecap="round"
                transform={`rotate(${clockHands.second} 50 50)`}
              />
              <circle cx="50" cy="50" r="3" fill="#ef4444" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
