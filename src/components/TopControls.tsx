import React from 'react';
import {
  FlashMode,
  FacingMode,
} from '../types/camera';
import {
  Zap,
  ZapOff,
  SwitchCamera,
  Settings as SettingsIcon,
  Grid,
  Timer as TimerIcon,
  Palette,
  FolderInput,
  Download,
} from 'lucide-react';

interface TopControlsProps {
  flashMode: FlashMode;
  onToggleFlash: () => void;
  facingMode: FacingMode;
  onFlipCamera: () => void;
  onOpenSettings: () => void;
  onOpenColorEffects: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  timerSeconds: number;
  onCycleTimer: () => void;
  isRecording?: boolean;
  onOpenImport: () => void;
  onOpenInstallApk: () => void;
}

export const TopControls: React.FC<TopControlsProps> = ({
  flashMode,
  onToggleFlash,
  onFlipCamera,
  onOpenSettings,
  onOpenColorEffects,
  showGrid,
  onToggleGrid,
  timerSeconds,
  onCycleTimer,
  isRecording,
  onOpenImport,
  onOpenInstallApk,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
      {/* Left: Flash toggle matching reference icon */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleFlash}
          disabled={isRecording}
          title={`Flash: ${flashMode.toUpperCase()}`}
          className="relative p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
        >
          {flashMode === 'off' ? (
            <ZapOff className="w-6 h-6 text-white/80" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Zap
                className={`w-6 h-6 ${
                  flashMode === 'on' ? 'text-amber-400 fill-amber-400' : 'text-white'
                }`}
              />
              {flashMode === 'auto' && (
                <span className="absolute -top-1 -right-1.5 text-[10px] font-bold text-white bg-black/60 rounded px-0.5 leading-none">
                  A
                </span>
              )}
            </div>
          )}
        </button>

        {/* Import from Gallery or Google Drive */}
        <button
          onClick={onOpenImport}
          title="Import dari Galeri / Google Drive"
          className="p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center relative text-sky-400"
        >
          <FolderInput className="w-5 h-5 text-sky-400" />
        </button>

        {/* Quick Timer button */}
        <button
          onClick={onCycleTimer}
          disabled={isRecording}
          title={`Timer: ${timerSeconds > 0 ? `${timerSeconds}s` : 'Off'}`}
          className="p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center relative disabled:opacity-40"
        >
          <TimerIcon className={`w-5 h-5 ${timerSeconds > 0 ? 'text-sky-400' : 'text-white/80'}`} />
          {timerSeconds > 0 && (
            <span className="absolute -bottom-1 text-[9px] font-bold text-sky-400 bg-black/80 px-1 rounded-full">
              {timerSeconds}s
            </span>
          )}
        </button>

        {/* Quick Grid toggle */}
        <button
          onClick={onToggleGrid}
          title="Toggle 3x3 Grid"
          className="p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center"
        >
          <Grid className={`w-5 h-5 ${showGrid ? 'text-sky-400' : 'text-white/70'}`} />
        </button>

        {/* Quick Color Effect button */}
        <button
          onClick={onOpenColorEffects}
          title="Color Effects"
          className="p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center"
        >
          <Palette className="w-5 h-5 text-white/80 hover:text-white" />
        </button>
      </div>

      {/* Right controls: Install APK, Settings & Camera flip */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenInstallApk}
          title="Pasang APK / Install App"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00a0e9]/90 hover:bg-[#0086c3] active:scale-95 transition-all text-white text-[11px] font-semibold shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>APK</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="General Settings"
          className="p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all"
        >
          <SettingsIcon className="w-6 h-6 text-white/90" />
        </button>

        {/* Camera flip icon matching reference image */}
        <button
          onClick={onFlipCamera}
          disabled={isRecording}
          title="Flip camera front/back"
          className="p-2 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all disabled:opacity-40"
        >
          <SwitchCamera className="w-7 h-7 text-white stroke-[1.8]" />
        </button>
      </div>
    </div>
  );
};
