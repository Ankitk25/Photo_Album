import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun, Heart, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Photo } from '../types';
import { PhotoCard } from './PhotoCard';
import { CreateAlbumModal } from './CreateAlbumModal';
import { UploadModal } from './UploadModal';

interface PhotoGalleryProps {
  currentView: 'all' | 'favorites' | string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ currentView }) => {
  const {
    photos,
    albums,
    darkMode,
    toggleDarkMode,
    getFavoritePhotos,
    toggleFavorite,
    removePhotoFromAlbum,
    updatePhotoInAlbum,
    removePhoto
  } = useStore();
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleDeletePhoto = (photoId: string, albumId?: string) => {
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      if (albumId) {
        removePhotoFromAlbum(albumId, photoId);
      } else {
        removePhoto(photoId);
      }
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const getDisplayPhotos = () => {
    if (currentView === 'favorites') {
      return getFavoritePhotos();
    } else if (currentView === 'all') {
      return photos.map(photo => ({ albumId: '', photo }));
    } else {
      const album = albums.find(a => a.id === currentView);
      return album ? album.photos.map(photo => ({ albumId: album.id, photo })) : [];
    }
  };

  const displayPhotos = getDisplayPhotos();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 pt-20 lg:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentView === 'all' ? 'All Photos' : 
             currentView === 'favorites' ? 'Favorite Photos' :
             albums.find(a => a.id === currentView)?.title || 'Photos'}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Upload Photos</span>
              <span className="sm:hidden">Upload</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateAlbum(true)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create Album</span>
              <span className="sm:hidden">Album</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayPhotos.map(({ albumId, photo }) => (
            <div key={`${albumId}-${photo.id}`} className="relative">
              <PhotoCard
                photo={photo}
                onFavorite={() => toggleFavorite(photo.id)}
                onDelete={() => handleDeletePhoto(photo.id, albumId)}
                onEdit={(updates) => updatePhotoInAlbum(albumId, photo.id, updates)}
                onView={() => {
                  setPreviewPhoto(photo);
                  setImageDimensions(null);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => {
              setPreviewPhoto(null);
              setImageDimensions(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                onLoad={handleImageLoad}
                style={{
                  ...(previewPhoto.filters ? {
                    filter: `
                      grayscale(${previewPhoto.filters.grayscale}%)
                      blur(${previewPhoto.filters.blur}px)
                      brightness(${previewPhoto.filters.brightness}%)
                      contrast(${previewPhoto.filters.contrast}%)
                      saturate(${previewPhoto.filters.saturation}%)
                    `
                  } : {})
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-white text-lg sm:text-xl font-medium mb-2">{previewPhoto.title}</h3>
                {imageDimensions && (
                  <p className="text-white/80 text-xs sm:text-sm">
                    Original dimensions: {imageDimensions.width} × {imageDimensions.height} pixels
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateAlbumModal
        isOpen={showCreateAlbum}
        onClose={() => setShowCreateAlbum(false)}
        darkMode={darkMode}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
};