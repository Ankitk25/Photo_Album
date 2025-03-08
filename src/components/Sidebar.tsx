import React from 'react';
import { GalleryVertical as Gallery, Album, Heart, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface SidebarProps {
  onViewChange: (view: 'all' | 'favorites' | string) => void;
  currentView: 'all' | 'favorites' | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onViewChange, currentView }) => {
  const { darkMode, albums, removeAlbum } = useStore();

  const handleDeleteAlbum = (albumId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this album?')) {
      removeAlbum(albumId);
      if (currentView === albumId) {
        onViewChange('all');
      }
    }
  };

  return (
    <div className={`w-64 h-screen border-r ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4">
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Photo Gallery
        </h2>
        <nav className="space-y-2">
          <button
            onClick={() => onViewChange('all')}
            className={`w-full flex items-center gap-2 p-2 rounded-lg ${
              currentView === 'all'
                ? darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Gallery className="w-5 h-5" />
            All Photos
          </button>
          <button
            onClick={() => onViewChange('favorites')}
            className={`w-full flex items-center gap-2 p-2 rounded-lg ${
              currentView === 'favorites'
                ? darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-5 h-5" />
            Favorites
          </button>
          
          <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Albums
            </h3>
            <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => onViewChange(album.id)}
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                    currentView === album.id
                      ? darkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Album className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{album.title}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDeleteAlbum(album.id, e)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-full ${
                      darkMode ? 'hover:bg-red-900/50' : 'hover:bg-red-100'
                    }`}
                  >
                    <Trash2 className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};