// src/services/storageService.js
// Handles media and image uploads for events, merchandise, and leadership profiles
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * Resizes an image file in the browser using HTML5 Canvas to keep base64 payload small.
 * @param {File} file 
 * @param {number} maxDimension - Max width or height in pixels
 * @param {number} quality - JPEG compression quality between 0.1 and 1.0
 * @returns {Promise<string>} Data URL
 */
export function compressImageToDataUrl(file, maxDimension = 960, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to process image format."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image either to Supabase Storage (if configured & authenticated)
 * or converts to an optimized Data URL for local persistence.
 * @param {File} file
 * @param {Object} options
 * @param {string} options.folder - e.g. "events", "merchandise", "officials"
 * @param {string} [options.bucket] - default "ufa-media"
 * @returns {Promise<{ url: string, isRemote: boolean, error?: string }>}
 */
export async function uploadImage(file, { folder = "events", bucket = "ufa-media" } = {}) {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Validate MIME type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
  }

  // 5MB limit
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Image exceeds maximum allowed size of 5MB.");
  }

  // Try Supabase Storage upload if authenticated
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = `${folder}/${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            return {
              url: urlData.publicUrl,
              isRemote: true,
              path: filePath
            };
          }
        } else {
          console.warn("Supabase Storage upload returned error, falling back to local encoding:", uploadError.message);
        }
      }
    } catch (err) {
      console.warn("Could not upload to Supabase storage, using fallback:", err);
    }
  }

  // Fallback: Optimized Data URL
  const dataUrl = await compressImageToDataUrl(file);
  return {
    url: dataUrl,
    isRemote: false
  };
}

