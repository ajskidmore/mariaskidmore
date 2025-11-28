import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploadProps {
  currentImageURL?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  folder?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export const ImageUpload = ({
  currentImageURL,
  onUploadComplete,
  onRemove,
  label = 'Upload Image',
  folder = 'images',
  aspectRatio = 'square',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImageURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, progress, error } = useImageUpload();

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    const url = await uploadImage(file, folder);
    if (url) {
      onUploadComplete(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark-text-primary">
        {label}
      </label>

      <div className={`relative ${aspectRatioClasses[aspectRatio]} w-full max-w-md rounded-lg overflow-hidden bg-gray-800 border-2 border-dashed border-gray-700 hover:border-primary-500 transition-colors`}>
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                disabled={uploading}
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary-400 transition-colors"
            disabled={uploading}
          >
            <ImageIcon className="w-12 h-12" />
            <span className="text-sm font-medium">Click to upload</span>
            <span className="text-xs">PNG, JPG up to 5MB</span>
          </button>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-white">{Math.round(progress)}%</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
