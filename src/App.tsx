/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CameraMode,
  FlashMode,
  FacingMode,
  TimestampConfig,
  GeneralSettings,
  LocationData,
  CapturedMedia,
  ColorEffect,
} from './types/camera';
import { DEFAULT_LOCATION, fetchCurrentLocation } from './utils/location';
import { cameraAudio } from './utils/audio';
import { renderPhotoWithWatermark } from './utils/canvasRenderer';
import { TopControls } from './components/TopControls';
import { BottomControls } from './components/BottomControls';
import { WatermarkOverlay } from './components/WatermarkOverlay';
import { TimestampModal } from './components/TimestampModal';
import { SettingsModal } from './components/SettingsModal';
import { TextOrderModal } from './components/TextOrderModal';
import { GalleryModal } from './components/GalleryModal';
import { ColorEffectModal } from './components/ColorEffectModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ImportModal } from './components/ImportModal';
import { InstallApkModal } from './components/InstallApkModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Video, Camera, AlertCircle, RefreshCw, FolderInput, Download } from 'lucide-react';

export default function App() {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Camera & Mode states
  const [cameraMode, setCameraMode] = useState<CameraMode>('photo');
  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isShutterFlashing, setIsShutterFlashing] = useState<boolean>(false);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);

  // Stream & Media state
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isSimulatedFeed, setIsSimulatedFeed] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Video element and canvas references
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const intervalShooterRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Modals state
  const [isTimestampModalOpen, setIsTimestampModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isTextOrderModalOpen, setIsTextOrderModalOpen] = useState<boolean>(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isInstallApkModalOpen, setIsInstallApkModalOpen] = useState<boolean>(false);
  const [isColorEffectsOpen, setIsColorEffectsOpen] = useState<boolean>(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState<boolean>(false);

  // Location & sensor data
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);

  // Timestamp configuration (matching Image 3 defaults)
  const [timestampConfig, setTimestampConfig] = useState<TimestampConfig>({
    fontColor: '#ffffff',
    textSize: 'medium',
    fontFamily: 'default',
    position: 'bottom-right',
    dateFormat: 'DD MMM YYYY HH.mm.ss',
    gpsFormat: 'none',
    resolution: '4080 x 3060',
    customText: '',
    showCustomText: false,
    showMap: false,
    showCompass: false,
    showAltitudeSpeed: false,
    showIndexNumber: false,
    indexNumber: 1,
    timestampMargins: 'one-line',
    watermarkLogoUrl: null,
    tagText: '',
    textOrder: [
      'datetime',
      'street',
      'subdistrict',
      'district',
      'city',
      'province',
      'custom',
      'gps',
      'alt-speed',
      'index',
    ],
  });

  // General settings (matching Image 4 defaults)
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    mirrorFrontCamera: true,
    recordVideoWithVoice: true,
    keepOriginalPhoto: true,
    touchToTakePhoto: true,
    openShutterSound: false,
    showGrid: false,
    alwaysDisplayZoomSlider: false,
    useBluetoothMicrophone: false,
    doubleTapBatterySave: false,
    batterySaveBrightness: 50,
    videoQuality: 'Normal',
    videoSegmentation: 'None',
    whiteBalance: 'auto',
    cameraOrientation: 'Auto',
    timer: 0,
    takePhotoInterval: 0,
    storeOnSDCard: false,
    sdCardPath: '/storage/emulated/0/DCIM/Camera',
    textOpacity: 100,
    backgroundOpacity: 0,
    backgroundColor: '#000000',
    easyToggleCameras: false,
    fileNamePrefix: 'IMG_',
    colorEffect: 'Normal',
  });

  // Gallery media list initialized with authentic reference capture
  const [mediaList, setMediaList] = useState<CapturedMedia[]>([
    {
      id: 'ref-demo-1',
      type: 'photo',
      url: '/assets/aistudio/Screenshot_20261111_131626_Timestamp_Camera_c62512e7.jpg',
      originalUrl: '/assets/aistudio/Screenshot_20261111_131626_Timestamp_Camera_c62512e7.jpg',
      timestamp: '11 Nov 2026 13.16.26',
      location: '936 Jalan MT. Haryono, Peterongan, Kota Semarang, Jawa Tengah',
      fileName: 'IMG_20261111_131626.jpg',
      resolution: '4080 x 3060',
      dateCreated: Date.now() - 3600000,
    },
    {
      id: 'ref-demo-2',
      type: 'photo',
      url: '/assets/aistudio/Screenshot_20261111_131637_Timestamp_Camera_ca82e08e.jpg',
      originalUrl: '/assets/aistudio/Screenshot_20261111_131637_Timestamp_Camera_ca82e08e.jpg',
      timestamp: '11 Nov 2026 13.16.37',
      location: '936 Jalan MT. Haryono, Peterongan, Kota Semarang, Jawa Tengah',
      fileName: 'IMG_20261111_131637.jpg',
      resolution: '4080 x 3060',
      dateCreated: Date.now() - 1800000,
    },
  ]);

  // Request real GPS location on mount
  useEffect(() => {
    fetchCurrentLocation().then((loc) => {
      setLocation(loc);
    });

    // Compass device orientation listener
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setLocation((prev) => ({
          ...prev,
          compassHeading: Math.round(e.alpha ?? 240),
        }));
      }
    };

    if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSimulatedFeed(true);
        setHasCameraPermission(false);
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: generalSettings.recordVideoWithVoice,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasCameraPermission(true);
      setIsSimulatedFeed(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Camera access could not be acquired; switching to simulated realistic feed:', err);
      setHasCameraPermission(false);
      setIsSimulatedFeed(true);
    }
  }, [facingMode, generalSettings.recordVideoWithVoice]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Canvas-based simulation renderer when camera hardware isn't available
  useEffect(() => {
    if (!isSimulatedFeed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const simImage = new Image();
    simImage.src = '/assets/aistudio/Screenshot_20261111_131626_Timestamp_Camera_c62512e7.jpg';

    const renderSim = () => {
      offset += 0.005;
      const panX = Math.sin(offset) * 12;
      const panY = Math.cos(offset) * 8;

      canvas.width = 1280;
      canvas.height = 960;

      if (simImage.complete && simImage.naturalWidth > 0) {
        // Draw reference pavement image with subtle breathing motion
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.drawImage(
          simImage,
          -canvas.width / 2 - 20 + panX,
          -canvas.height / 2 - 20 + panY,
          canvas.width + 40,
          canvas.height + 40
        );
        ctx.restore();
      } else {
        // Geometric patterned surface
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        for (let x = 0; x < canvas.width; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x + panX, 0);
          ctx.lineTo(x + panX, canvas.height);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(renderSim);
    };

    simImage.onload = () => {
      animId = requestAnimationFrame(renderSim);
    };
    animId = requestAnimationFrame(renderSim);

    return () => cancelAnimationFrame(animId);
  }, [isSimulatedFeed]);

  // Flash cycle: Auto -> On -> Off
  const toggleFlash = () => {
    setFlashMode((prev) => (prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto'));
  };

  // Camera flip
  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Timer cycle
  const cycleTimer = () => {
    const next = generalSettings.timer === 0 ? 3 : generalSettings.timer === 3 ? 5 : generalSettings.timer === 5 ? 10 : 0;
    setGeneralSettings((prev) => ({ ...prev, timer: next }));
  };

  // Capture Photo Logic
  const executeCapturePhoto = () => {
    // 1. Shutter sound
    if (generalSettings.openShutterSound) {
      cameraAudio.playShutterSound();
    }

    // 2. Flash visual effect
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 140);

    // 3. Render watermark onto frame
    const sourceEl = isSimulatedFeed ? canvasRef.current : videoRef.current;
    if (!sourceEl) return;

    try {
      const now = new Date();
      const { watermarkedDataUrl, originalDataUrl } = renderPhotoWithWatermark({
        videoElement: sourceEl,
        timestampConfig,
        generalSettings,
        location,
        facingMode,
        customDate: now,
      });

      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(
        now.getHours()
      )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const fileName = `${generalSettings.fileNamePrefix}${timeStr}.jpg`;

      const newMedia: CapturedMedia = {
        id: `img-${Date.now()}`,
        type: 'photo',
        url: watermarkedDataUrl,
        originalUrl: generalSettings.keepOriginalPhoto ? originalDataUrl : undefined,
        timestamp: `${now.getDate()} ${now.toLocaleString('en', { month: 'short' })} ${now.getFullYear()} ${pad(
          now.getHours()
        )}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`,
        location: `${location.street}, ${location.subdistrict}, ${location.city}`,
        fileName,
        resolution: timestampConfig.resolution,
        dateCreated: Date.now(),
      };

      setMediaList((prev) => [newMedia, ...prev]);

      // Increment index number if enabled
      if (timestampConfig.showIndexNumber) {
        setTimestampConfig((prev) => ({
          ...prev,
          indexNumber: prev.indexNumber + 1,
        }));
      }
    } catch (err) {
      console.error('Error during photo capture:', err);
    }
  };

  // Main shutter button trigger (handles countdown timer & interval)
  const handleShutterPress = () => {
    if (cameraMode === 'photo') {
      if (generalSettings.timer > 0) {
        let count = generalSettings.timer;
        setCountdownTimer(count);
        cameraAudio.playTimerTick(false);

        const countdownInterval = setInterval(() => {
          count -= 1;
          if (count > 0) {
            setCountdownTimer(count);
            cameraAudio.playTimerTick(false);
          } else {
            clearInterval(countdownInterval);
            setCountdownTimer(null);
            cameraAudio.playTimerTick(true);
            executeCapturePhoto();
          }
        }, 1000);
      } else {
        executeCapturePhoto();
      }
    } else {
      // Video mode
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording();
      }
    }
  };

  // Video Recording Logic
  const startVideoRecording = () => {
    const sourceEl = isSimulatedFeed ? canvasRef.current : videoRef.current;
    if (!sourceEl) return;

    try {
      let recordStream: MediaStream;
      if (isSimulatedFeed && canvasRef.current) {
        recordStream = canvasRef.current.captureStream(30);
      } else if (stream) {
        recordStream = stream;
      } else {
        return;
      }

      if (generalSettings.openShutterSound) {
        cameraAudio.playBeep(true);
      }

      recordedChunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp8' };
      const recorder = new MediaRecorder(
        recordStream,
        MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined
      );

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const fileName = `VID_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(
          now.getHours()
        )}${pad(now.getMinutes())}${pad(now.getSeconds())}.webm`;

        const newVideo: CapturedMedia = {
          id: `vid-${Date.now()}`,
          type: 'video',
          url: videoUrl,
          timestamp: `${now.getDate()} ${now.toLocaleString('en', { month: 'short' })} ${now.getFullYear()} ${pad(
            now.getHours()
          )}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`,
          location: `${location.street}, ${location.city}`,
          fileName,
          resolution: timestampConfig.resolution,
          duration: recordingDuration,
          dateCreated: Date.now(),
        };

        setMediaList((prev) => [newVideo, ...prev]);
        setRecordingDuration(0);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start video recording:', err);
    }
  };

  const stopVideoRecording = () => {
    if (generalSettings.openShutterSound) {
      cameraAudio.playBeep(false);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
  };

  // Handle Imported Image from Device Gallery or Google Drive
  const handleImportImage = (imageDataUrl: string, originalName: string, applyTimestamp: boolean) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageDataUrl;
    img.onload = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(
        now.getHours()
      )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const fileName = `IMPORT_${timeStr}.jpg`;

      let watermarkedDataUrl = imageDataUrl;
      let originalDataUrl = imageDataUrl;

      if (applyTimestamp) {
        // Draw image onto an off-screen canvas and apply the watermark overlay
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.naturalWidth || 1920;
        tempCanvas.height = img.naturalHeight || 1080;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(img, 0, 0);

        const result = renderPhotoWithWatermark({
          videoElement: tempCanvas,
          timestampConfig,
          generalSettings,
          location,
          facingMode: 'environment',
          customDate: now,
        });

        watermarkedDataUrl = result.watermarkedDataUrl;
        originalDataUrl = result.originalDataUrl;
      }

      const newMedia: CapturedMedia = {
        id: `import-${Date.now()}`,
        type: 'photo',
        url: watermarkedDataUrl,
        originalUrl: originalDataUrl,
        timestamp: `${now.getDate()} ${now.toLocaleString('en', { month: 'short' })} ${now.getFullYear()} ${pad(
          now.getHours()
        )}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`,
        location: `${location.street}, ${location.subdistrict}, ${location.city}`,
        fileName,
        resolution: `${img.naturalWidth || 1920} x ${img.naturalHeight || 1080}`,
        dateCreated: Date.now(),
      };

      setMediaList((prev) => [newMedia, ...prev]);
      setIsGalleryModalOpen(true);
    };
  };

  // Touch on viewfinder to focus or take photo
  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFocusPoint({ x, y });
    setTimeout(() => setFocusPoint(null), 1000);

    if (generalSettings.touchToTakePhoto && cameraMode === 'photo' && !isRecording) {
      handleShutterPress();
    }
  };

  // CSS Filter for live viewfinder based on selected ColorEffect & WhiteBalance
  const getLiveFilterStyle = () => {
    let filter = '';
    switch (generalSettings.colorEffect) {
      case 'Mono':
        filter += 'grayscale(100%) contrast(110%) ';
        break;
      case 'Sepia':
        filter += 'sepia(80%) brightness(95%) ';
        break;
      case 'Negative':
        filter += 'invert(100%) ';
        break;
      case 'Vivid':
        filter += 'saturate(150%) contrast(108%) ';
        break;
      case 'Cool':
        filter += 'hue-rotate(180deg) saturate(110%) ';
        break;
      default:
        break;
    }

    switch (generalSettings.whiteBalance) {
      case 'daylight':
        filter += 'brightness(105%) saturate(110%) ';
        break;
      case 'cloudy':
        filter += 'sepia(20%) brightness(102%) ';
        break;
      case 'fluorescent':
        filter += 'hue-rotate(10deg) brightness(98%) ';
        break;
      case 'incandescent':
        filter += 'sepia(35%) hue-rotate(-15deg) ';
        break;
      default:
        break;
    }

    return filter.trim() || 'none';
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col justify-between font-sans select-none">
      {/* 1. Camera Viewfinder Area */}
      <div
        onClick={handleViewfinderClick}
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-black cursor-crosshair"
      >
        {/* Flash Screen Animation Overlay */}
        {isShutterFlashing && (
          <div className="absolute inset-0 z-40 bg-white pointer-events-none animate-out fade-out duration-150" />
        )}

        {/* Live Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isSimulatedFeed ? 'hidden' : 'block'
          } ${
            generalSettings.mirrorFrontCamera && facingMode === 'user' ? 'scale-x-[-1]' : ''
          }`}
          style={{
            filter: getLiveFilterStyle(),
            transform: `${generalSettings.mirrorFrontCamera && facingMode === 'user' ? 'scaleX(-1) ' : ''}scale(${zoomLevel})`,
          }}
        />

        {/* Fallback Simulation Canvas (when webcam unavailable) */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isSimulatedFeed ? 'block' : 'hidden'
          } ${
            generalSettings.mirrorFrontCamera && facingMode === 'user' ? 'scale-x-[-1]' : ''
          }`}
          style={{
            filter: getLiveFilterStyle(),
            transform: `${generalSettings.mirrorFrontCamera && facingMode === 'user' ? 'scaleX(-1) ' : ''}scale(${zoomLevel})`,
          }}
        />

        {/* 3x3 Grid Overlay */}
        {generalSettings.showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-b border-white/25" />
            <div className="border-r border-white/25" />
            <div className="border-r border-white/25" />
            <div />
          </div>
        )}

        {/* Autofocus Target Ring Animation */}
        {focusPoint && (
          <div
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{ left: focusPoint.x, top: focusPoint.y }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-400/10 shadow-lg" />
          </div>
        )}

        {/* Countdown Timer Overlay (3... 2... 1...) */}
        {countdownTimer !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
            <div className="w-28 h-28 rounded-full border-4 border-[#00a0e9] bg-black/70 flex items-center justify-center text-white text-6xl font-bold font-mono animate-bounce shadow-2xl">
              {countdownTimer}
            </div>
          </div>
        )}

        {/* Dynamic Watermark Overlay (matching screenshots 1 & 2) */}
        <WatermarkOverlay
          config={timestampConfig}
          settings={generalSettings}
          location={location}
        />

        {/* Zoom Level Indicator / Slider Overlay */}
        {generalSettings.alwaysDisplayZoomSlider && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center bg-black/60 backdrop-blur-md px-2 py-3 rounded-full border border-white/20 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => Math.min(4, z + 0.5));
              }}
              className="text-white text-xs font-bold w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center"
            >
              +
            </button>
            <span className="text-[10px] font-mono text-sky-400 font-bold">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => Math.max(1, z - 0.5));
              }}
              className="text-white text-xs font-bold w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center"
            >
              -
            </button>
          </div>
        )}

        {/* Quick Mode Indicator / Live Camera State Badge */}
        {isSimulatedFeed && (
          <div className="absolute top-14 left-4 z-20 flex items-center gap-2 bg-neutral-900/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-700 text-[11px] text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Interactive Pavement Scene</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              className="ml-1 text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry WebCam</span>
            </button>
          </div>
        )}

        {/* Floating Quick Install APK Pill for Android */}
        {!isInstalled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInstallApkModalOpen(true);
            }}
            className="absolute top-14 right-4 z-20 flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold shadow-lg backdrop-blur-xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang APK</span>
          </button>
        )}
      </div>

      {/* 2. Top Bar Controls */}
      <TopControls
        flashMode={flashMode}
        onToggleFlash={toggleFlash}
        facingMode={facingMode}
        onFlipCamera={flipCamera}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenColorEffects={() => setIsColorEffectsOpen(true)}
        showGrid={generalSettings.showGrid}
        onToggleGrid={() =>
          setGeneralSettings((prev) => ({ ...prev, showGrid: !prev.showGrid }))
        }
        timerSeconds={generalSettings.timer}
        onCycleTimer={cycleTimer}
        isRecording={isRecording}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenInstallApk={() => setIsInstallApkModalOpen(true)}
      />

      {/* 3. Bottom Bar Controls */}
      <BottomControls
        mode={cameraMode}
        onSelectMode={(m) => setCameraMode(m)}
        onShutterPress={handleShutterPress}
        isRecording={isRecording}
        recordingDuration={recordingDuration}
        lastMedia={mediaList[0] || null}
        onOpenGallery={() => setIsGalleryModalOpen(true)}
        onOpenTimestampSettings={() => setIsTimestampModalOpen(true)}
      />

      {/* 4. Modals */}
      {/* Timestamp Configuration Modal (Image 3) */}
      <TimestampModal
        isOpen={isTimestampModalOpen}
        onClose={() => setIsTimestampModalOpen(false)}
        config={timestampConfig}
        onChangeConfig={(cfg) => setTimestampConfig(cfg)}
        location={location}
        onChangeLocation={(loc) => setLocation(loc)}
        onOpenTextOrder={() => setIsTextOrderModalOpen(true)}
        backgroundOpacity={generalSettings.backgroundOpacity}
        onChangeBackgroundOpacity={(val) =>
          setGeneralSettings((prev) => ({ ...prev, backgroundOpacity: val }))
        }
      />

      {/* General Settings Modal (Image 4) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={generalSettings}
        onChangeSettings={(st) => setGeneralSettings(st)}
        onOpenColorEffects={() => setIsColorEffectsOpen(true)}
        onOpenQrCode={() => setIsQrCodeOpen(true)}
        onOpenInstallApk={() => setIsInstallApkModalOpen(true)}
      />

      {/* Text Order Modal */}
      <TextOrderModal
        isOpen={isTextOrderModalOpen}
        onClose={() => setIsTextOrderModalOpen(false)}
        order={timestampConfig.textOrder}
        onChangeOrder={(newOrder) =>
          setTimestampConfig((prev) => ({ ...prev, textOrder: newOrder }))
        }
      />

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        mediaList={mediaList}
        onDeleteMedia={(id) => setMediaList((prev) => prev.filter((m) => m.id !== id))}
        onOpenImport={() => setIsImportModalOpen(true)}
      />

      {/* Import Modal for Local Gallery and Google Drive */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportImage={handleImportImage}
      />

      {/* Install APK / PWA Modal */}
      <InstallApkModal
        isOpen={isInstallApkModalOpen}
        onClose={() => setIsInstallApkModalOpen(false)}
      />

      {/* Color Effect Modal */}
      <ColorEffectModal
        isOpen={isColorEffectsOpen}
        onClose={() => setIsColorEffectsOpen(false)}
        currentEffect={generalSettings.colorEffect}
        onSelectEffect={(eff: ColorEffect) =>
          setGeneralSettings((prev) => ({ ...prev, colorEffect: eff }))
        }
      />

      {/* QR Code Share Modal */}
      <QrCodeModal
        isOpen={isQrCodeOpen}
        onClose={() => setIsQrCodeOpen(false)}
      />
    </div>
  );
}
