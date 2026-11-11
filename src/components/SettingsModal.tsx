import React, { useState } from 'react';
import {
  GeneralSettings,
  VideoQuality,
  WhiteBalance,
  CameraOrientation,
  ColorEffect,
} from '../types/camera';
import {
  ChevronRight,
  MoreHorizontal,
  Mail,
  Palette,
  Share2,
  QrCode,
  HelpCircle,
  FileText,
  Smartphone,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GeneralSettings;
  onChangeSettings: (settings: GeneralSettings) => void;
  onOpenColorEffects: () => void;
  onOpenQrCode: () => void;
  onOpenInstallApk: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChangeSettings,
  onOpenColorEffects,
  onOpenQrCode,
  onOpenInstallApk,
}) => {
  if (!isOpen) return null;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const updateSetting = <K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  const bgColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Dark Slate', hex: '#0f172a' },
    { name: 'Navy Blue', hex: '#1e3a8a' },
    { name: 'Dark Gray', hex: '#374151' },
    { name: 'White', hex: '#ffffff' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md max-h-[92vh] flex flex-col overflow-hidden text-neutral-800 text-sm font-sans">
        {/* Cyan Title matching Image 4 */}
        <div className="px-5 pt-4 pb-2 border-b border-neutral-100">
          <h2 className="text-[#00a0e9] font-medium text-lg tracking-normal">Settings</h2>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5">
          {/* Toggles Group 1 */}
          <div className="space-y-3">
            {/* Mirror front camera */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Mirror front camera when capture</span>
              <button
                onClick={() => updateSetting('mirrorFrontCamera', !settings.mirrorFrontCamera)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.mirrorFrontCamera ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.mirrorFrontCamera ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Record video with voice */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Record video with voice</span>
              <button
                onClick={() => updateSetting('recordVideoWithVoice', !settings.recordVideoWithVoice)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.recordVideoWithVoice ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.recordVideoWithVoice ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Keep original photo */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Keep original photo</span>
              <button
                onClick={() => updateSetting('keepOriginalPhoto', !settings.keepOriginalPhoto)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.keepOriginalPhoto ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.keepOriginalPhoto ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Touch to take photo */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Touch to take photo</span>
              <button
                onClick={() => updateSetting('touchToTakePhoto', !settings.touchToTakePhoto)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.touchToTakePhoto ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.touchToTakePhoto ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Open shutter sound */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Open shutter sound</span>
              <button
                onClick={() => updateSetting('openShutterSound', !settings.openShutterSound)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.openShutterSound ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.openShutterSound ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Show Grid */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Show Grid</span>
              <button
                onClick={() => updateSetting('showGrid', !settings.showGrid)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.showGrid ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.showGrid ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Always display zoom slider */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Always display zoom slider</span>
              <button
                onClick={() => updateSetting('alwaysDisplayZoomSlider', !settings.alwaysDisplayZoomSlider)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.alwaysDisplayZoomSlider ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.alwaysDisplayZoomSlider ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Use Bluetooth microphone */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Use the Bluetooth microphone</span>
              <button
                onClick={() => updateSetting('useBluetoothMicrophone', !settings.useBluetoothMicrophone)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.useBluetoothMicrophone ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.useBluetoothMicrophone ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Double-tap switch battery save */}
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Double-tap switch battery save</span>
              <button
                onClick={() => updateSetting('doubleTapBatterySave', !settings.doubleTapBatterySave)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.doubleTapBatterySave ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.doubleTapBatterySave ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Battery save brightness slider */}
          <div className="pt-1">
            <span className="text-neutral-800 text-xs sm:text-sm block mb-1">Battery save brightness</span>
            <input
              type="range"
              min={10}
              max={100}
              value={settings.batterySaveBrightness}
              onChange={(e) => updateSetting('batterySaveBrightness', Number(e.target.value))}
              className="w-full accent-[#00a0e9] h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Video Quality segmented control */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-neutral-800 text-xs sm:text-sm font-medium">Video Quality</span>
            <div className="flex rounded border border-[#00a0e9] overflow-hidden text-xs">
              {(['Normal', 'High', 'Low'] as VideoQuality[]).map((qual) => (
                <button
                  key={qual}
                  onClick={() => updateSetting('videoQuality', qual)}
                  className={`px-3 py-1 font-medium transition-colors ${
                    settings.videoQuality === qual ? 'bg-[#00a0e9] text-white' : 'bg-white text-[#00a0e9]'
                  }`}
                >
                  {qual}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown: Video segmentation */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <span className="text-neutral-800 text-xs sm:text-sm">Video segmentation</span>
            <select
              value={settings.videoSegmentation}
              onChange={(e) => updateSetting('videoSegmentation', e.target.value)}
              className="text-xs text-neutral-800 bg-transparent pr-2 focus:outline-none cursor-pointer"
            >
              <option value="None">None</option>
              <option value="10 min">10 min</option>
              <option value="30 min">30 min</option>
            </select>
          </div>

          {/* Dropdown: White Balance */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <span className="text-neutral-800 text-xs sm:text-sm">White Balance</span>
            <select
              value={settings.whiteBalance}
              onChange={(e) => updateSetting('whiteBalance', e.target.value as WhiteBalance)}
              className="text-xs text-neutral-800 bg-transparent pr-2 focus:outline-none cursor-pointer"
            >
              <option value="auto">auto</option>
              <option value="daylight">daylight</option>
              <option value="cloudy">cloudy</option>
              <option value="fluorescent">fluorescent</option>
              <option value="incandescent">incandescent</option>
            </select>
          </div>

          {/* Dropdown: Camera orientation */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <span className="text-neutral-800 text-xs sm:text-sm">Camera orientation</span>
            <select
              value={settings.cameraOrientation}
              onChange={(e) => updateSetting('cameraOrientation', e.target.value as CameraOrientation)}
              className="text-xs text-neutral-800 bg-transparent pr-2 focus:outline-none cursor-pointer"
            >
              <option value="Auto">Auto</option>
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>

          {/* Timer option row */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <span className="text-neutral-800 text-xs sm:text-sm">Timer</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextTimer = settings.timer === 0 ? 3 : settings.timer === 3 ? 5 : settings.timer === 5 ? 10 : 0;
                  updateSetting('timer', nextTimer);
                }}
                className="text-[#00a0e9] text-xs flex items-center"
              >
                <span>{settings.timer === 0 ? 'Off' : `${settings.timer}s`}</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Take photo every interval */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-150">
            <span className="text-neutral-800 text-xs sm:text-sm">Take photo every interval</span>
            <button
              onClick={() => {
                const nextInt = settings.takePhotoInterval === 0 ? 3 : settings.takePhotoInterval === 3 ? 5 : settings.takePhotoInterval === 5 ? 10 : 0;
                updateSetting('takePhotoInterval', nextInt);
              }}
              className="text-[#00a0e9] text-xs flex items-center"
            >
              <span>{settings.takePhotoInterval === 0 ? 'Off' : `${settings.takePhotoInterval}s`}</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          {/* Store on SD card */}
          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 text-xs sm:text-sm">Store on the SD Card</span>
              <button
                onClick={() => updateSetting('storeOnSDCard', !settings.storeOnSDCard)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.storeOnSDCard ? 'bg-[#00a0e9]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.storeOnSDCard ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono break-all">{settings.sdCardPath}</p>
            <button
              onClick={() => {
                const newPath = prompt('Select folder / storage path:', settings.sdCardPath);
                if (newPath) updateSetting('sdCardPath', newPath);
              }}
              className="px-2.5 py-1 text-xs bg-[#00a0e9] hover:bg-[#0086c3] text-white rounded font-medium transition-colors"
            >
              Select Folder
            </button>
          </div>

          {/* Adjust Timestamp Opacity Section */}
          <div className="pt-2 border-t border-neutral-200 space-y-2.5">
            <h3 className="text-xs font-semibold text-neutral-700">Adjust Timestamp opacity</h3>

            {/* Text opacity */}
            <div>
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Text opacity</span>
                <span className="font-mono">{settings.textOpacity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={settings.textOpacity}
                onChange={(e) => updateSetting('textOpacity', Number(e.target.value))}
                className="w-full accent-[#00a0e9] h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Background opacity */}
            <div>
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Background opacity</span>
                <span className="font-mono">{settings.backgroundOpacity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.backgroundOpacity}
                onChange={(e) => updateSetting('backgroundOpacity', Number(e.target.value))}
                className="w-full accent-[#00a0e9] h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Background color */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-neutral-800 text-xs sm:text-sm">Background color</span>
              <div className="flex items-center gap-1.5">
                {bgColors.map((bg) => (
                  <button
                    key={bg.hex}
                    onClick={() => updateSetting('backgroundColor', bg.hex)}
                    title={bg.name}
                    className={`w-6 h-6 rounded border transition-all ${
                      settings.backgroundColor === bg.hex ? 'ring-2 ring-[#00a0e9] scale-110' : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: bg.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Easy to toggle cameras */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
            <span className="text-neutral-800 text-xs sm:text-sm">Easy to toggle cameras</span>
            <button
              onClick={() => updateSetting('easyToggleCameras', !settings.easyToggleCameras)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.easyToggleCameras ? 'bg-[#00a0e9]' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.easyToggleCameras ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* File name prefix */}
          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-800 text-xs sm:text-sm">File name prefix</span>
            <input
              type="text"
              value={settings.fileNamePrefix}
              onChange={(e) => updateSetting('fileNamePrefix', e.target.value)}
              placeholder="IMG_"
              className="w-28 text-xs p-1 border-b border-neutral-300 focus:border-[#00a0e9] focus:outline-none text-right font-mono"
            />
          </div>

          {/* Blue action buttons matching Image 4 */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                alert(`Current file name pattern:\n${settings.fileNamePrefix}YYYYMMDD_HHmmss.jpg`);
              }}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>File name format</span>
            </button>

            <button
              onClick={() => {
                const email = prompt('Enter auto-forward email address:');
                if (email) alert(`Photos will be prepared to email to: ${email}`);
              }}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send photo by email settings</span>
            </button>

            <button
              onClick={onOpenColorEffects}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span>Color Effect ({settings.colorEffect})</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenInstallApk();
              }}
              className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Instal Aplikasi / Unduh APK</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Timestamp Camera',
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('App link copied to clipboard!');
                }
              }}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share link of this app</span>
            </button>

            <button
              onClick={onOpenQrCode}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR code of this app</span>
            </button>

            <button
              onClick={() => {
                alert('Timestamp Camera Web Edition\nVersion 2.4.0\nSupport: feedback@timestampcamera.app\nAll camera features, GPS watermarks, and timestamps are actively simulated and client-side processed.');
              }}
              className="w-full py-2.5 rounded bg-[#00a0e9] hover:bg-[#0086c3] active:scale-[0.99] text-white font-medium text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support and Feedback</span>
            </button>
          </div>
        </div>

        {/* Bottom OK button matching screenshot 4 */}
        <div className="p-3 border-t border-neutral-100 bg-white flex justify-center">
          <button
            onClick={onClose}
            className="w-full max-w-[160px] py-2 rounded bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800 font-semibold text-sm transition-colors text-center"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
