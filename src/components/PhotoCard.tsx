import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Edit, Trash, X, Check, Wand2, FolderPlus, Eye } from 'lucide-react';
import { Photo } from '../types';
import { EditDialog } from './EditDialog';
import { useStore } from '../store/useStore';
import { AddToAlbumDialog } from './AddToAlbumDialog';

interface PhotoCardProps {
  photo: Photo;
  onFavorite: () => void;
  onDelete: () => void;
  onEdit: (updates: Partial<Photo>) => void;
  onView: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onFavorite,
  onDelete,
  onEdit,
  onView,
}) => {
  const { darkMode } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(photo.title);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddToAlbumDialog, setShowAddToAlbumDialog] = useState(false);
  const [filters, setFilters] = useState({
    grayscale: 0,
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const [filterHistory, setFilterHistory] = useState<typeof filters[]>([]);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({ title: editedTitle });
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTitle(photo.title);
    setIsEditing(false);
  };

  const getFilterStyle = () => {
    return {
      filter: `
        grayscale(${filters.grayscale}%)
        blur(${filters.blur}px)
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
      `
    };
  };

  const handleFilterChange = (name: keyof typeof filters, value: number) => {
    setTempFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveFilters = () => {
    setFilterHistory([...filterHistory, filters]);
    setFilters(tempFilters);
    onEdit({ filters: tempFilters });
    setShowEditDialog(false);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      grayscale: 0,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
    };
    setTempFilters(defaultFilters);
  };

  const handleUndoFilters = () => {
    if (filterHistory.length > 0) {
      const previousFilters = filterHistory[filterHistory.length - 1];
      setTempFilters(previousFilters);
      setFilterHistory(filterHistory.slice(0, -1));
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditDialog(true);
  };

  const handleAddToAlbum = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddToAlbumDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative group rounded-lg overflow-hidden"
    >
      {/* Delete button in top right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transform transition-transform"
      >
        <Trash className="w-4 h-4" />
      </motion.button>

      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        style={getFilterStyle()}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {isEditing ? (
            <div className="flex gap-2 mb-2" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-white/90 text-gray-900 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSave(e as unknown as React.MouseEvent)}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1 rounded-full bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full bg-red-500 hover:bg-red-600"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <h3 className="text-white font-medium mb-2">{photo.title}</h3>
          )}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleView}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Heart
                className={`w-5 h-5 ${
                  photo.favorite ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEdit}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Wand2 className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Edit className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToAlbum}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <FolderPlus className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      <EditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        filters={tempFilters}
        onFilterChange={handleFilterChange}
        onSave={handleSaveFilters}
        onUndo={handleUndoFilters}
        onReset={handleResetFilters}
        hasHistory={filterHistory.length > 0}
        darkMode={darkMode}
      />

      <AddToAlbumDialog
        isOpen={showAddToAlbumDialog}
        onClose={() => setShowAddToAlbumDialog(false)}
        photo={photo}
        darkMode={darkMode}
      />
    </motion.div>
  );
};