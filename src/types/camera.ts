export type CameraMode = 'photo' | 'video';
export type FlashMode = 'auto' | 'on' | 'off';
export type FacingMode = 'user' | 'environment';
export type TextSize = 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'default' | 'monospace' | 'serif' | 'roboto' | 'bold' | 'digital';
export type PositionLayout = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center';
export type GPSFormat = 'none' | 'decimal' | 'dms' | 'utm';
export type VideoQuality = 'Normal' | 'High' | 'Low';
export type WhiteBalance = 'auto' | 'daylight' | 'cloudy' | 'fluorescent' | 'incandescent';
export type CameraOrientation = 'Auto' | 'Portrait' | 'Landscape';
export type ColorEffect = 'Normal' | 'Mono' | 'Sepia' | 'Negative' | 'Vivid' | 'Cool';

export interface LocationData {
  street: string;
  subdistrict: string;
  district: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  compassHeading: number;
  isRealLocation: boolean;
}

export interface TimestampConfig {
  fontColor: string;
  textSize: TextSize;
  fontFamily: FontFamily;
  position: PositionLayout;
  dateFormat: string;
  gpsFormat: GPSFormat;
  resolution: string;
  customText: string;
  showCustomText: boolean;
  showMap: boolean;
  showCompass: boolean;
  showAltitudeSpeed: boolean;
  showIndexNumber: boolean;
  indexNumber: number;
  timestampMargins: 'one-line' | 'two-lines' | 'none';
  watermarkLogoUrl: string | null;
  tagText: string;
  textOrder: string[]; // ['datetime', 'street', 'subdistrict', 'district', 'city', 'province', 'custom', 'gps', 'alt-speed']
}

export interface GeneralSettings {
  mirrorFrontCamera: boolean;
  recordVideoWithVoice: boolean;
  keepOriginalPhoto: boolean;
  touchToTakePhoto: boolean;
  openShutterSound: boolean;
  showGrid: boolean;
  alwaysDisplayZoomSlider: boolean;
  useBluetoothMicrophone: boolean;
  doubleTapBatterySave: boolean;
  batterySaveBrightness: number;
  videoQuality: VideoQuality;
  videoSegmentation: string;
  whiteBalance: WhiteBalance;
  cameraOrientation: CameraOrientation;
  timer: number; // 0, 3, 5, 10
  takePhotoInterval: number; // 0, 3, 5, 10, 30
  storeOnSDCard: boolean;
  sdCardPath: string;
  textOpacity: number; // 0 to 100
  backgroundOpacity: number; // 0 to 100
  backgroundColor: string;
  easyToggleCameras: boolean;
  fileNamePrefix: string;
  colorEffect: ColorEffect;
}

export interface CapturedMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  originalUrl?: string;
  timestamp: string;
  location: string;
  fileName: string;
  resolution: string;
  duration?: number;
  dateCreated: number;
}
