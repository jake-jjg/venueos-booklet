export interface UploadFileOptions {
  file: File;
  venueName: string;
  bucket?: string;
}

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Converts a venue name to a URL-safe folder name.
 * Example: "My Awesome Venue" → "my-awesome-venue"
 */
function normalizeVenueName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generates a unique filename using timestamp and original filename.
 * Example: "image.jpg" → "1234567890-image.jpg"
 */
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = originalFilename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special chars with underscore
    .replace(/_+/g, "_"); // Replace multiple underscores with single one
  return `${timestamp}-${sanitizedFilename}`;
}

export const useStorageUpload = () => {
  const supabase = useSupabaseClient();

  const uploading = useState("file_uploading", () => false);
  const error = useState<string | null>("file_upload_error", () => null);

  /**
   * Uploads a file to Supabase Storage.
   *
   * @param file - The File object to upload
   * @param venueName - The venue name used for folder organization
   * @param bucket - The storage bucket name (defaults to "client-media")
   * @returns Promise with the public URL and storage path of the uploaded file
   *
   * @example
   * const { uploadFile, uploading, error } = useStorageUpload()
   * const result = await uploadFile(file, "My Venue")
   * if (result) {
   *   console.log(result.url) // Public URL
   * }
   */
  const uploadFile = async (
    file: File,
    venueName: string,
    bucket: string = "client-media",
  ): Promise<UploadResult | null> => {
    uploading.value = true;
    error.value = null;

    try {
      // Validate file
      if (!file) {
        throw new Error("No file provided");
      }

      if (file.size === 0) {
        throw new Error("File is empty");
      }

      // Generate folder and file path
      const folderName = normalizeVenueName(venueName);
      const uniqueFilename = generateUniqueFilename(file.name);
      const filePath = `${folderName}/${uniqueFilename}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false, // Don't overwrite existing files
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (!data) {
        throw new Error("Upload succeeded but no data returned");
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return {
        url: publicUrl,
        path: data.path,
      };
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      error.value = errorMessage;
      console.error("File upload error:", e);
      return null;
    } finally {
      uploading.value = false;
    }
  };

  /**
   * Deletes a file from Supabase Storage.
   *
   * @param path - The storage path of the file to delete
   * @param bucket - The storage bucket name (defaults to "client-media")
   * @returns Promise indicating success or failure
   */
  const deleteFile = async (
    path: string,
    bucket: string = "client-media",
  ): Promise<boolean> => {
    error.value = null;

    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) {
        throw new Error(`Delete failed: ${deleteError.message}`);
      }

      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      error.value = errorMessage;
      console.error("File delete error:", e);
      return false;
    }
  };

  /**
   * Clears the error state.
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    error,
    clearError,
  };
};
