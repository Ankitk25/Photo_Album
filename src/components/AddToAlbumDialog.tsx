import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Photo } from '../types';

interface AddToAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
  darkMode: boolean;
}

export const AddToAlbumDialog: React.FC<AddToAlbumDialogProps> = ({
  isOpen,
  onClose,
  photo,
  darkMode,
}) => {
  const { albums, addPhotoToAlbum } = useStore();

  const handleAddToAlbum = (albumId: string) => {
    addPhotoToAlbum(albumId, { ...photo });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-md rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl overflow-hidden`}
          >
            <div className={`flex justify-between items-center p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Add to Album
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

            <div className="p-4">
              {albums.length === 0 ? (
                <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No albums available. Create an album first.
                </p>
              ) : (
                <div className="space-y-2">
                  {albums.map((album) => (
                    <motion.button
                      key={album.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToAlbum(album.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <span>{album.title}</span>
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};