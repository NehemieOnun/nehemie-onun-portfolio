import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, RefreshCw, RotateCcw, AlertCircle, ImagePlus, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

interface ProfileCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photoUrl: string) => void;
  onResetDefault: () => void;
  currentPhotoUrl: string;
}

export const ProfileCameraModal: React.FC<ProfileCameraModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  onResetDefault,
  currentPhotoUrl,
}) => {
  const { t } = useLanguage();
  const { playClick } = useAudio();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraActive(false);
      setCameraError(
        t(
          'Votre navigateur ne prend pas en charge l\'accès à la caméra ou la connexion n\'est pas sécurisée (HTTPS requis).',
          'Your browser does not support camera access or the connection is not secure (HTTPS required).'
        )
      );
      return;
    }

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1024 },
          height: { ideal: 1024 },
          facingMode: 'user',
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);

      const isPermissionDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        (err?.message && err.message.toLowerCase().includes('permission'));

      if (isPermissionDenied) {
        setCameraError(
          t(
            'L\'accès à la caméra a été refusé ou ignoré par le navigateur. Vous pouvez autoriser la caméra dans les paramètres de votre navigateur ou importer une image ci-dessous.',
            'Camera permission was dismissed or denied by your browser. You can allow camera access in browser settings or upload an image file below.'
          )
        );
      } else {
        setCameraError(
          t(
            'Impossible d\'accéder à l\'appareil photo. Veuillez vérifier les autorisations ou utiliser l\'importation de fichier.',
            'Unable to access camera. Please check camera permissions or upload an image file instead.'
          )
        );
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Manage camera lifecycle based on modal state and tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, capturedImage]);

  if (!isOpen) return null;

  // Capture Snapshot from Live Video
  const handleCapture = () => {
    playClick();
    if (!videoRef.current || !canvasRef.current) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Square crop center
    const size = Math.min(video.videoWidth, video.videoHeight) || 600;
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    canvas.width = 600;
    canvas.height = 600;

    // Draw image flipped horizontally for natural mirror feel
    ctx.translate(600, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 600, 600);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t('Veuillez sélectionner un fichier image valide.', 'Please select a valid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSave = () => {
    playClick();
    if (capturedImage) {
      onSavePhoto(capturedImage);
    }
    onClose();
  };

  const handleRetake = () => {
    playClick();
    setCapturedImage(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleReset = () => {
    playClick();
    onResetDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2563EB]/20 text-blue-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {t('Photo de Profil', 'Profile Photo')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('Prenez une photo en direct ou importez une image', 'Take a live snapshot or upload a file')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 gap-2 bg-[#0B1120] border-b border-white/10">
          <button
            onClick={() => {
              playClick();
              setActiveTab('camera');
              setCapturedImage(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'camera'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t('Caméra en direct', 'Live Camera')}</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab('upload');
              stopCamera();
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{t('Importer fichier', 'Upload Image')}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[320px]">
          {/* Flash Effect */}
          {flash && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200" />}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* PREVIEW OF CAPTURED / SELECTED IMAGE */}
          {capturedImage ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="relative w-56 h-56 rounded-full border-4 border-[#2563EB] overflow-hidden shadow-2xl bg-black">
                <img src={capturedImage} alt="Captured preview" className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                  <span>{t('Recommencer', 'Retake')}</span>
                </button>

                <button
                  onClick={handleConfirmSave}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{t('Appliquer cette photo', 'Use This Photo')}</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* LIVE CAMERA VIEW */
            <div className="flex flex-col items-center gap-4 w-full">
              {cameraError ? (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-4 max-w-md w-full">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                  <p className="text-xs sm:text-sm text-red-200 leading-relaxed font-medium">{cameraError}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                    <button
                      onClick={startCamera}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t('Réessayer la caméra', 'Retry Camera')}</span>
                    </button>
                    <button
                      onClick={() => {
                        playClick();
                        setActiveTab('upload');
                        stopCamera();
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('Importer une photo', 'Upload Image File')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-64 h-64 rounded-full border-4 border-[#2563EB]/40 overflow-hidden shadow-2xl bg-black group flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />

                  {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                      <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                  )}

                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 pointer-events-none" />
                </div>
              )}

              {isCameraActive && !cameraError && (
                <button
                  onClick={handleCapture}
                  className="mt-2 py-3 px-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-900/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('Prendre la photo', 'Snap Photo')}</span>
                </button>
              )}
            </div>
          ) : (
            /* FILE UPLOAD VIEW */
            <div className="flex flex-col items-center gap-4 w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 px-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#2563EB] bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
              >
                <div className="p-4 rounded-full bg-[#2563EB]/20 text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <ImagePlus className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {t('Cliquez pour choisir une photo', 'Click to browse an image')}
                </p>
                <p className="text-xs text-slate-400">
                  {t('Formats supportés: JPG, PNG, WEBP', 'Supported formats: JPG, PNG, WEBP')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Reset button */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Photo originale', 'Reset to Default Photo')}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500">
            1:1 Avatar Crop
          </span>
        </div>
      </div>
    </div>
  );
};
