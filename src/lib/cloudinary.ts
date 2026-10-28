import type { CloudinaryUploadResponse, SiteSettings } from '@/types';

/**
 * Configuration Cloudinary par défaut
 */
export const DEFAULT_CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

export const DEFAULT_CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Récupère la configuration Cloudinary active (paramètres admin ou variables d'environnement)
 */
export function getCloudinaryConfig(settings?: SiteSettings | null): {
  cloudName: string;
  uploadPreset: string;
  isConfigured: boolean;
} {
  const cloudName =
    settings?.cloudinary_cloud_name?.trim() ||
    DEFAULT_CLOUDINARY_CLOUD_NAME?.trim() ||
    '';
  const uploadPreset =
    settings?.cloudinary_upload_preset?.trim() ||
    DEFAULT_CLOUDINARY_UPLOAD_PRESET?.trim() ||
    '';

  return {
    cloudName,
    uploadPreset,
    isConfigured: Boolean(cloudName && uploadPreset),
  };
}

export interface UploadOptions {
  cloudName?: string;
  uploadPreset?: string;
  folder?: string;
  tags?: string[];
  onProgress?: (percent: number) => void;
}

/**
 * Téléverse un fichier (Image ou Vidéo) directement vers Cloudinary via l'API REST
 * avec suivi de progression en temps réel.
 */
export function uploadToCloudinary(
  file: File,
  options?: UploadOptions
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const cloudName = options?.cloudName || DEFAULT_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = options?.uploadPreset || DEFAULT_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return reject(
        new Error(
          'Cloudinary n’est pas configuré. Veuillez renseigner le Cloud Name et l’Upload Preset dans les paramètres.'
        )
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/auto/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    // Suivi de progression du téléversement
    if (xhr.upload && options?.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          options.onProgress?.(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          // Pour les vidéos Cloudinary, la miniature peut être générée en .jpg
          if (response.resource_type === 'video' && !response.thumbnail_url) {
            response.thumbnail_url = response.secure_url.replace(
              /\.[^/.]+$/,
              '.jpg'
            );
          }
          resolve(response as CloudinaryUploadResponse);
        } else {
          const errMsg =
            response.error?.message ||
            `Erreur Cloudinary HTTP ${xhr.status} : ${xhr.statusText}`;
          reject(new Error(errMsg));
        }
      } catch (err: any) {
        reject(
          new Error(
            `Réponse Cloudinary invalide : ${err?.message || 'Erreur inconnue'}`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          'Erreur réseau lors de la communication avec les serveurs Cloudinary. Vérifiez votre connexion Internet.'
        )
      );
    };

    xhr.send(formData);
  });
}

/**
 * Vérifie si une URL pointe vers un média hébergé sur Cloudinary
 */
export function isCloudinaryUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.includes('cloudinary.com');
}

/**
 * Injecte des transformations Cloudinary (f_auto, q_auto, w_800, etc.)
 * dans une URL Cloudinary existante
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  transformations: string = 'f_auto,q_auto'
): string {
  if (!url || !isCloudinaryUrl(url)) return url;

  // L'URL type Cloudinary est : https://res.cloudinary.com/<cloud>/image/upload/[v12345/]<public_id>.<ext>
  // On insère les transformations juste après /upload/
  const uploadToken = '/upload/';
  const idx = url.indexOf(uploadToken);
  if (idx === -1) return url;

  const prefix = url.substring(0, idx + uploadToken.length);
  const suffix = url.substring(idx + uploadToken.length);

  // Si des transformations sont déjà présentes avant la version, on évite les doublons simples
  if (suffix.startsWith(transformations)) return url;

  return `${prefix}${transformations}/${suffix}`;
}

/**
 * Génère une miniature carrée optimisée pour les avatars ou vignettes
 */
export function getSquareThumbnailUrl(url: string, size: number = 300): string {
  return getOptimizedCloudinaryUrl(
    url,
    `c_fill,g_auto,w_${size},h_${size},f_auto,q_auto`
  );
}
