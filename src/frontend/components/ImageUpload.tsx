import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

interface ImageUploadProps {
  bookId: string;
  onUploadSuccess: (coverUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ bookId, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('cover', file);

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/cover`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onUploadSuccess(data.cover_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-purple-500 bg-purple-50/10' : 'border-gray-600 hover:border-purple-500'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-300">
          {isUploading ? (
            'Uploading...'
          ) : (
            <>
              Drag and drop your cover image here, or <span className="text-purple-500">browse</span>
              <br />
              <span className="text-gray-500 text-xs mt-2">
                Supports: JPG, PNG, GIF, WEBP (max 16MB)
              </span>
            </>
          )}
        </p>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload; 