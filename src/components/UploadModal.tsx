import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image } from 'lucide-react';
import { useStore } from '../store/useStore';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, darkMode }) => {
  const { addPhoto } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    try {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photo = {
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            title: title || file.name,
            favorite: false
          };
          addPhoto(photo);
        };
        reader.readAsDataURL(file);
      }

      setTitle('');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-lg rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl overflow-hidden`}
          >
            <div className={`flex justify-between items-center p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Upload Photos
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Photo Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter photo title (optional)"
                />
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? darkMode
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500 bg-blue-50'
                    : darkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="flex flex-col items-center">
                  <Image
                    className={`w-12 h-12 mb-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <p
                    className={`text-sm mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Drag and drop your photos here, or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      browse
                    </button>
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            <div className={`flex justify-end gap-2 p-4 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } ${uploading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};