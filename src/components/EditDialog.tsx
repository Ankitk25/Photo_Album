import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Undo } from 'lucide-react';

interface Filters {
  grayscale: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (name: keyof Filters, value: number) => void;
  onSave: () => void;
  onUndo: () => void;
  onReset: () => void;
  hasHistory: boolean;
  darkMode: boolean;
}

export const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onSave,
  onUndo,
  onReset,
  hasHistory,
  darkMode,
}) => {
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
                Edit Photo
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium block mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Grayscale
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.grayscale}
                    onChange={(e) => onFilterChange('grayscale', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Blur
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.blur}
                    onChange={(e) => onFilterChange('blur', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => onFilterChange('brightness', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Contrast
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => onFilterChange('contrast', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium block mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Saturation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => onFilterChange('saturation', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className={`flex justify-between items-center p-4 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="space-x-2">
                <button
                  onClick={onReset}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Reset
                </button>
                <button
                  onClick={onUndo}
                  disabled={!hasHistory}
                  className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${
                    !hasHistory
                      ? 'opacity-50 cursor-not-allowed'
                      : darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Undo className="w-4 h-4" /> Undo
                </button>
              </div>
              <div className="space-x-2">
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
                <button
                  onClick={onSave}
                  className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${
                    darkMode
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};