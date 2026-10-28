import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Cloud,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Trash2,
  UploadCloud,
  Video,
} from 'lucide-react';
import type { SiteSettings } from '@/types';
import {
  getCloudinaryConfig,
  isCloudinaryUrl,
  uploadToCloudinary,
} from '@/lib/cloudinary';

export interface CloudinaryUploaderProps {
  label?: string;
  currentUrl?: string | null;
  thumbnailUrl?: string | null;
  mediaType?: 'image' | 'video';
  onChange: (result: {
    url: string;
    thumbnailUrl?: string;
    mediaType: 'image' | 'video';
    format?: string;
    width?: number;
    height?: number;
    originalFilename?: string;
  }) => void;
  onRemove?: () => void;
  folder?: string;
  settings?: SiteSettings | null;
  accept?: string;
  helpText?: string;
  allowManualUrl?: boolean;
}

export default function CloudinaryUploader({
  label,
  currentUrl,
  thumbnailUrl,
  mediaType = 'image',
  onChange,
  onRemove,
  folder = 'couronne-toque',
  settings,
  accept = 'image/*,video/*',
  helpText,
  allowManualUrl = true,
}: CloudinaryUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentUrl || '');

  const config = getCloudinaryConfig(settings);

  // Gestion du téléversement d'un fichier sélectionné
  async function handleFile(file: File) {
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadToCloudinary(file, {
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        folder,
        onProgress: (percent) => setUploadProgress(percent),
      });

      const detectedType: 'image' | 'video' =
        res.resource_type === 'video' ? 'video' : 'image';

      onChange({
        url: res.secure_url || res.url,
        thumbnailUrl: res.thumbnail_url || res.secure_url,
        mediaType: detectedType,
        format: res.format,
        width: res.width,
        height: res.height,
        originalFilename: res.original_filename || file.name,
      });
      setManualUrl(res.secure_url);
    } catch (err: any) {
      console.error('Erreur Cloudinary:', err);
      setErrorMsg(
        err?.message ||
          'Une erreur est survenue lors de l’envoi du média sur Cloudinary.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function handleApplyManualUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    const isVid =
      manualUrl.endsWith('.mp4') ||
      manualUrl.endsWith('.webm') ||
      manualUrl.includes('youtube.com') ||
      manualUrl.includes('vimeo.com');

    onChange({
      url: manualUrl.trim(),
      thumbnailUrl: manualUrl.trim(),
      mediaType: isVid ? 'video' : 'image',
    });
    setShowManualInput(false);
  }

  const hasMedia = Boolean(currentUrl && currentUrl.trim().length > 0);
  const isCloudinary = isCloudinaryUrl(currentUrl);

  return (
    <div className="cloudinary-uploader-box">
      {label && (
        <div className="cloudinary-uploader-header">
          <label className="cloudinary-label">{label}</label>
          {isCloudinary && (
            <span className="cloudinary-badge">
              <Cloud size={12} />
              <span>Stocké sur Cloudinary</span>
            </span>
          )}
        </div>
      )}

      {/* ZONE D'AFFICHAGE DU MÉDIA EXISTANT */}
      {hasMedia && !isUploading && (
        <div className="cloudinary-preview-card">
          <div className="cloudinary-preview-thumb">
            {mediaType === 'video' ? (
              <div className="cloudinary-video-thumb">
                <img
                  src={thumbnailUrl || currentUrl!}
                  alt="Aperçu vidéo"
                  onError={(e) => {
                    // Repli si l'image thumbnail échoue
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="video-overlay-icon">
                  <Video size={22} />
                </div>
              </div>
            ) : (
              <img
                src={thumbnailUrl || currentUrl!}
                alt="Aperçu du média"
                loading="lazy"
              />
            )}
          </div>

          <div className="cloudinary-preview-meta">
            <div className="cloudinary-url-info">
              <span className="cloudinary-media-type">
                {mediaType === 'video' ? 'Vidéo' : 'Image'}
              </span>
              <a
                href={currentUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="cloudinary-link"
                title={currentUrl!}
              >
                <span>{currentUrl}</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="cloudinary-preview-actions">
              <button
                type="button"
                className="btn-cloudinary-action"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={14} />
                <span>Remplacer</span>
              </button>
              {onRemove && (
                <button
                  type="button"
                  className="btn-cloudinary-action danger"
                  onClick={onRemove}
                >
                  <Trash2 size={14} />
                  <span>Supprimer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ZONE DE CHARGEMENT / PROGRESSION */}
      {isUploading && (
        <div className="cloudinary-uploading-card">
          <div className="uploading-spinner-row">
            <Loader2 size={24} className="spin-animate" />
            <div>
              <p className="uploading-title">
                Téléversement sur Cloudinary en cours...
              </p>
              <p className="uploading-subtitle">
                Stockage CDN & optimisation haute fidélité
              </p>
            </div>
            <span className="uploading-percentage">{uploadProgress}%</span>
          </div>

          <div className="cloudinary-progress-bar-wrap">
            <div
              className="cloudinary-progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ZONE DE GLISSER-DÉPOSER (Affichée si pas de média ou pour remplacement) */}
      {!hasMedia && !isUploading && (
        <div
          className={`cloudinary-dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="dropzone-icon-circle">
            <UploadCloud size={28} />
          </div>
          <div className="dropzone-text">
            <p className="dropzone-primary">
              <strong>Cliquez pour choisir un fichier</strong> ou glissez-déposez ici
            </p>
            <p className="dropzone-secondary">
              Images ou vidéos (JPEG, PNG, WEBP, MP4, WebM) · Cloud :{' '}
              <strong className="font-mono">{config.cloudName}</strong>
            </p>
          </div>
        </div>
      )}

      {/* MESSAGE D'ERREUR ÉVENTUEL */}
      {errorMsg && (
        <div className="cloudinary-error-box">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* BASULE POUR URL MANUELLE */}
      {allowManualUrl && !isUploading && (
        <div className="cloudinary-footer-tools">
          <button
            type="button"
            className="toggle-manual-btn"
            onClick={() => setShowManualInput(!showManualInput)}
          >
            <LinkIcon size={12} />
            <span>
              {showManualInput
                ? 'Masquer la saisie d’URL'
                : 'Ou coller une URL existante'}
            </span>
          </button>

          {showManualInput && (
            <div className="manual-url-form mt-2">
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... ou https://..."
                className="manual-url-input"
              />
              <button
                type="button"
                className="button button-dark btn-apply-manual"
                onClick={handleApplyManualUrl}
              >
                Appliquer
              </button>
            </div>
          )}
        </div>
      )}

      {helpText && <p className="cloudinary-help-text">{helpText}</p>}

      {/* INPUT FILE CACHÉ */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
