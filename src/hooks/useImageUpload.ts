import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import { validateImageFile } from '../utils/validators';
import type { UploadProgress } from '../types';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  /**
   * Upload an image to Firebase Storage
   * @param file - The image file to upload
   * @param folder - The storage folder path
   * @param filename - Optional custom filename (will generate if not provided)
   * @returns Promise with the download URL or null if failed
   */
  const uploadImage = async (
    file: File,
    folder: string,
    filename?: string
  ): Promise<string | null> => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return null;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      // Generate filename if not provided
      const finalFilename = filename || `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${finalFilename}`);

      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(percent));
          },
          (error) => {
            // Handle upload error
            setError(error.message || 'Upload failed');
            setUploading(false);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setDownloadURL(url);
              setUploading(false);
              setProgress(100);
              resolve(url);
            } catch (err: any) {
              setError(err.message || 'Failed to get download URL');
              setUploading(false);
              reject(err);
            }
          }
        );
      });
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploading(false);
      return null;
    }
  };

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl - The full download URL of the image
   * @returns Promise<boolean> - true if deleted successfully
   */
  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      setError(null);

      // Extract the storage path from the download URL
      const decodedUrl = decodeURIComponent(imageUrl);
      const pathStart = decodedUrl.indexOf('/o/') + 3;
      const pathEnd = decodedUrl.indexOf('?');
      const storagePath = decodedUrl.substring(pathStart, pathEnd);

      const imageRef = ref(storage, storagePath);
      await deleteObject(imageRef);

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
      return false;
    }
  };

  /**
   * Reset the upload state
   */
  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setDownloadURL(null);
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    progress,
    error,
    downloadURL,
    reset,
  };
};

/**
 * Hook for uploading multiple images
 */
export const useMultipleImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloadURLs, setDownloadURLs] = useState<string[]>([]);

  const uploadImages = async (
    files: File[],
    folder: string
  ): Promise<string[]> => {
    try {
      setUploading(true);
      setErrors({});
      setProgress({});
      setDownloadURLs([]);

      const uploadPromises = files.map(async (file, index) => {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setErrors((prev) => ({
            ...prev,
            [file.name]: validation.error || 'Invalid file',
          }));
          return null;
        }

        const filename = `${Date.now()}-${index}-${file.name}`;
        const storageRef = ref(storage, `${folder}/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string | null>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress((prev) => ({
                ...prev,
                [file.name]: Math.round(percent),
              }));
            },
            (error) => {
              setErrors((prev) => ({
                ...prev,
                [file.name]: error.message || 'Upload failed',
              }));
              reject(error);
            },
            async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              } catch (err: any) {
                setErrors((prev) => ({
                  ...prev,
                  [file.name]: err.message || 'Failed to get download URL',
                }));
                reject(err);
              }
            }
          );
        });
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      setDownloadURLs(successfulUploads);
      setUploading(false);

      return successfulUploads;
    } catch (err: any) {
      setUploading(false);
      return [];
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress({});
    setErrors({});
    setDownloadURLs([]);
  };

  return {
    uploadImages,
    uploading,
    progress,
    errors,
    downloadURLs,
    reset,
  };
};
