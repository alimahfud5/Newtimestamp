import React from 'react';
import { X, Smartphone, Download, Check, ExternalLink, QrCode, Sparkles, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isAndroid, isIOS } = usePWAInstall();

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://timestampcamera.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}`;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      alert('Untuk menginstal di Android:\n1. Buka link ini di Google Chrome HP\n2. Tekan menu titik tiga (⋮) di kanan atas\n3. Pilih "Tambahkan ke Layar Utama" atau "Instal Aplikasi"');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden text-neutral-800 text-sm font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00a0e9]/10 flex items-center justify-center text-[#00a0e9]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 text-base leading-tight">Instal Timestamp Camera</h2>
              <p className="text-[11px] text-neutral-500">Android APK & PWA Siap Pakai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* App Card Preview */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-neutral-900 to-slate-800 text-white shadow-md">
            <img
              src="/pwa-192x192.png"
              alt="Icon"
              className="w-14 h-14 rounded-xl shadow border border-white/20"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">Timestamp Camera</h3>
              <p className="text-xs text-sky-300">WebAPK Standalone • Fullscreen</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Bebas Iklan
                </span>
                <span>•</span>
                <span>GPS Stempel Real-time</span>
              </div>
            </div>
          </div>

          {/* Quick Install Action Button */}
          {isInstalled ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Aplikasi sudah terpasang di perangkat Anda sebagai aplikasi mandiri!</span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-[#00a0e9] hover:bg-[#0086c3] active:scale-98 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isInstallable ? 'Pasang Aplikasi Sekarang' : 'Instal di Android (WebAPK)'}</span>
            </button>
          )}

          {/* Step by step for Android Phone */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/70 space-y-2.5">
            <h4 className="font-semibold text-xs text-neutral-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#00a0e9]" />
              <span>Cara Pasang Langsung di HP Android:</span>
            </h4>
            <ol className="text-xs text-neutral-600 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>
                Buka link aplikasi ini di browser <strong>Google Chrome</strong> di ponsel Anda.
              </li>
              <li>
                Ketuk tombol menu titik tiga (<strong>⋮</strong>) di sudut kanan atas Chrome.
              </li>
              <li>
                Pilih <strong>"Tambahkan ke Layar Utama"</strong> (atau <strong>"Instal Aplikasi"</strong>).
              </li>
              <li>
                Android secara otomatis mengubahnya menjadi <strong>WebAPK</strong> dengan ikon di menu aplikasi ponsel dan beroperasi secara fullscreen tanpa bingkai browser.
              </li>
            </ol>
          </div>

          {/* QR Code to Open on Phone */}
          <div className="border border-neutral-200 rounded-xl p-4 flex flex-col items-center text-center space-y-2 bg-white">
            <h4 className="font-semibold text-xs text-neutral-800 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#00a0e9]" />
              <span>Buka di Smartphone via Scan QR:</span>
            </h4>
            <div className="p-2 border border-neutral-200 rounded-lg bg-neutral-50 shadow-xs">
              <img src={qrUrl} alt="QR Code" className="w-36 h-36 object-contain" />
            </div>
            <p className="text-[11px] text-neutral-500">
              Arahkan kamera HP ke kode QR di atas untuk membuka & memasang langsung di ponsel Anda.
            </p>
          </div>

          {/* Standalone APK File generation info (PWABuilder / Bubblewrap) */}
          <div className="border border-sky-100 rounded-xl p-3.5 bg-sky-50/60 text-xs text-neutral-700 space-y-1.5">
            <p className="font-semibold text-sky-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Ingin File .APK untuk Play Store / Distribusi Offline?</span>
            </p>
            <p className="text-[11px] text-neutral-600 leading-normal">
              Aplikasi ini sudah memenuhi standar resmi PWA & WebAPK. Anda dapat langsung mengonversinya menjadi file biner <code className="bg-sky-100 px-1 py-0.5 rounded font-mono text-[10px]">.apk</code> atau <code className="bg-sky-100 px-1 py-0.5 rounded font-mono text-[10px]">.aab</code> menggunakan <strong>PWABuilder</strong> (layanan resmi Microsoft/Google) secara gratis:
            </p>
            <a
              href={`https://www.pwabuilder.com/?url=${encodeURIComponent(appUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00a0e9] hover:underline pt-1"
            >
              <span>Buka PWABuilder untuk unduh .apk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
