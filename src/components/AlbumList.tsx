import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun, Upload, Heart, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Album } from '../types';
import { PhotoCard } from './PhotoCard';
import { UploadModal } from './UploadModal';

export const AlbumList: React.FC = () => {
  const {
    albums,
    darkMode,
    toggleDarkMode,
    toggleFavorite,
    addAlbum,
    removeAlbum,
    getFavoritePhotos,
    removePhotoFromAlbum,
    updatePhotoInAlbum,
  } = useStore();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [showNewAlbumInput, setShowNewAlbumInput] = useState(false);

  const favoritePhotos = getFavoritePhotos();

  const handleCreateAlbum = () => {
    if (newAlbumTitle.trim()) {
      addAlbum(newAlbumTitle.trim());
      setNewAlbumTitle('');
      setShowNewAlbumInput(false);
    }
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      removeAlbum(albumId);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Photo Albums
          </h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2 rounded-full ${
                darkMode 
                  ? `${showFavorites ? 'bg-red-600' : 'bg-gray-800'} text-white` 
                  : `${showFavorites ? 'bg-red-500' : 'bg-gray-200'} text-gray-600`
              }`}
            >
              <Heart className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewAlbumInput(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              New Album
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showNewAlbumInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    placeholder="Enter album title"
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateAlbum()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateAlbum}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    Create Album
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewAlbumInput(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    } text-gray-500`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showFavorites ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePhotos.map(({ albumId, photo }) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onFavorite={() => toggleFavorite(albumId, photo.id)}
                onDelete={() => removePhotoFromAlbum(albumId, photo.id)}
                onEdit={(updates) => updatePhotoInAlbum(albumId, photo.id, updates)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                layout
                className={`p-6 rounded-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className={`text-xl font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {album.title}
                  </h2>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedAlbum(album);
                        setIsUploadModalOpen(true);
                      }}
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Upload className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteAlbum(album.id)}
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-100 hover:bg-red-200'
                      }`}
                    >
                      <Trash2 className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-red-600'}`} />
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {album.photos.map((photo) => (
                      <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onFavorite={() => toggleFavorite(album.id, photo.id)}
                        onDelete={() => removePhotoFromAlbum(album.id, photo.id)}
                        onEdit={(updates) => updatePhotoInAlbum(album.id, photo.id, updates)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedAlbum(null);
        }}
        album={selectedAlbum}
      />
    </div>
  );
};