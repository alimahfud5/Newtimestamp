import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Cloud,
  FolderOpen,
  Check,
  Loader2,
  LogOut,
  Image as ImageIcon,
  Sparkles,
  Search,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  signInWithGoogleDrive,
  logoutGoogleDrive,
  fetchGoogleDrivePhotos,
  downloadDriveImageAsDataUrl,
  DriveFileItem,
  initDriveAuth,
} from '../utils/googleDrive';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportImage: (imageDataUrl: string, fileName: string, applyTimestamp: boolean) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportImage,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'drive'>('gallery');
  const [applyTimestamp, setApplyTimestamp] = useState<boolean>(true);

  // Local Gallery state
  const [selectedLocalPreview, setSelectedLocalPreview] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');

  // Google Drive state
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState<boolean>(false);
  const [isDownloadingItem, setIsDownloadingItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize Drive Auth listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user, token) => {
        setDriveUser(user);
        setDriveToken(token);
        loadDriveFiles(token);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sample Drive files fallback for demonstration if user is offline or not yet connected
  const sampleCloudPhotos: DriveFileItem[] = [
    {
      id: 'sample-drive-1',
      name: 'Project_Site_Semarang.jpg',
      mimeType: 'image/jpeg',
      thumbnailLink: '/assets/aistudio/Screenshot_20261111_131626_Timestamp_Camera_c62512e7.jpg',
      modifiedTime: '2026-11-11T06:16:26Z',
      size: '2.4 MB',
    },
    {
      id: 'sample-drive-2',
      name: 'Roadwork_Inspection_Day2.jpg',
      mimeType: 'image/jpeg',
      thumbnailLink: '/assets/aistudio/Screenshot_20261111_131637_Timestamp_Camera_ca82e08e.jpg',
      modifiedTime: '2026-11-11T06:16:37Z',
      size: '3.1 MB',
    },
  ];

  const loadDriveFiles = async (token: string) => {
    setIsLoadingDrive(true);
    setAuthError(null);
    try {
      const files = await fetchGoogleDrivePhotos(token);
      setDriveFiles(files);
    } catch (err: unknown) {
      console.warn('Could not fetch real Drive files, showing sample cloud photos:', err);
      setDriveFiles(sampleCloudPhotos);
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoadingDrive(true);
    setAuthError(null);
    try {
      const { user, accessToken } = await signInWithGoogleDrive();
      setDriveUser(user);
      setDriveToken(accessToken);
      await loadDriveFiles(accessToken);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setAuthError(errorMsg);
      // Still show sample cloud drive photos so user can test the workflow
      setDriveFiles(sampleCloudPhotos);
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogleDrive();
    setDriveUser(null);
    setDriveToken(null);
    setDriveFiles([]);
  };

  // Handle local file selection
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedLocalPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit local photo import
  const handleConfirmLocalImport = () => {
    if (!selectedLocalPreview) return;
    onImportImage(selectedLocalPreview, localFileName || 'Imported_Photo.jpg', applyTimestamp);
    onClose();
    setSelectedLocalPreview(null);
  };

  // Handle Drive file selection
  const handleSelectDriveFile = async (file: DriveFileItem) => {
    setIsDownloadingItem(file.id);
    try {
      let dataUrl: string;
      if (driveToken && !file.id.startsWith('sample-')) {
        dataUrl = await downloadDriveImageAsDataUrl(file.id, driveToken);
      } else {
        // Use thumbnail/sample image
        dataUrl = file.thumbnailLink || '/assets/aistudio/Screenshot_20261111_131626_Timestamp_Camera_c62512e7.jpg';
      }
      onImportImage(dataUrl, file.name, applyTimestamp);
      onClose();
    } catch (err) {
      console.error('Failed to import Drive photo:', err);
      alert('Could not download image from Drive. Please try another file.');
    } finally {
      setIsDownloadingItem(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-neutral-800 text-sm font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/90">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#00a0e9]" />
            <h2 className="font-semibold text-neutral-900 text-base">Import Foto / Video</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/70 p-1 gap-1">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-white text-[#00a0e9] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeri Perangkat</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'drive'
                ? 'bg-white text-[#00a0e9] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Google Drive</span>
          </button>
        </div>

        {/* Global Timestamp Option */}
        <div className="px-5 py-2.5 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-900">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Otomatis beri stempel waktu & lokasi ke foto yang diimport</span>
          </div>
          <button
            onClick={() => setApplyTimestamp(!applyTimestamp)}
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              applyTimestamp ? 'bg-[#00a0e9]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                applyTimestamp ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Tab 1: Local Device Gallery */}
        {activeTab === 'gallery' && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-4">
            {!selectedLocalPreview ? (
              <label className="border-2 border-dashed border-neutral-300 hover:border-[#00a0e9] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-neutral-50/50 hover:bg-sky-50/30 transition-all text-center">
                <div className="w-14 h-14 rounded-full bg-[#00a0e9]/10 flex items-center justify-center text-[#00a0e9]">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">Pilih foto dari Galeri HP / Komputer</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Mendukung format JPG, PNG, WEBP, MP4</p>
                </div>
                <span className="px-4 py-2 bg-[#00a0e9] hover:bg-[#0086c3] text-white rounded-lg text-xs font-semibold shadow-xs">
                  Buka Galeri File
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleLocalFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-full max-h-[46vh] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-900 flex items-center justify-center">
                  <img
                    src={selectedLocalPreview}
                    alt="Preview"
                    className="max-h-[46vh] w-auto object-contain"
                  />
                  <button
                    onClick={() => setSelectedLocalPreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 font-mono truncate max-w-xs">{localFileName}</p>

                <div className="flex gap-2 w-full pt-1">
                  <button
                    onClick={() => setSelectedLocalPreview(null)}
                    className="flex-1 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50"
                  >
                    Pilih Foto Lain
                  </button>
                  <button
                    onClick={handleConfirmLocalImport}
                    className="flex-1 py-2.5 rounded-lg bg-[#00a0e9] hover:bg-[#0086c3] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Import & Simpan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Google Drive */}
        {activeTab === 'drive' && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
            {/* User auth state banner */}
            {!driveUser ? (
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 text-sm">Hubungkan ke Google Drive</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Pilih dan import foto langsung dari akun Google Drive Anda dengan izin akses baca.
                  </p>
                </div>

                {authError && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded w-full">{authError}</p>
                )}

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoadingDrive}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 active:scale-98 transition-all flex items-center gap-3 text-xs font-semibold text-neutral-700 shadow-xs"
                >
                  {isLoadingDrive ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00a0e9]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-100 border border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00a0e9] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {driveUser.displayName?.charAt(0) || driveUser.email?.charAt(0) || 'G'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-neutral-800 leading-tight">
                      {driveUser.displayName || 'Google User'}
                    </p>
                    <p className="text-[10px] text-neutral-500 leading-tight">{driveUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogout}
                  title="Sign out"
                  className="p-1.5 text-neutral-500 hover:text-red-500 rounded hover:bg-neutral-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* File search & list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-700">
                  {driveUser ? 'Foto Google Drive Anda' : 'Contoh Foto Cloud Drive'}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {driveFiles.length} file
                </span>
              </div>

              {isLoadingDrive ? (
                <div className="py-8 flex flex-col items-center justify-center text-neutral-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00a0e9]" />
                  <span className="text-xs">Memuat foto dari Google Drive...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 max-h-[40vh] overflow-y-auto pr-1">
                  {(driveFiles.length > 0 ? driveFiles : sampleCloudPhotos).map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleSelectDriveFile(file)}
                      disabled={isDownloadingItem === file.id}
                      className="border border-neutral-200 rounded-lg overflow-hidden hover:border-[#00a0e9] hover:shadow-md transition-all text-left bg-neutral-50 group relative cursor-pointer"
                    >
                      <div className="aspect-video w-full bg-neutral-800 overflow-hidden relative flex items-center justify-center">
                        <img
                          src={file.thumbnailLink || '/assets/aistudio/Screenshot_20261111_131626_Timestamp_Camera_c62512e7.jpg'}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isDownloadingItem === file.id && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-neutral-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {file.size || 'Google Drive'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Foto yang diimport akan masuk ke Galeri applet
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
