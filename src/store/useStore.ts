import { create } from 'zustand';
import { Photo, Album } from '../types';

interface Store {
  photos: Photo[];
  albums: Album[];
  darkMode: boolean;
  addPhoto: (photo: Photo) => void;
  removePhoto: (photoId: string) => void;
  addAlbum: (title: string) => void;
  removeAlbum: (albumId: string) => void;
  updateAlbum: (albumId: string, title: string) => void;
  toggleFavorite: (photoId: string) => void;
  toggleDarkMode: () => void;
  addPhotoToAlbum: (albumId: string, photo: Photo) => void;
  removePhotoFromAlbum: (albumId: string, photoId: string) => void;
  updatePhotoInAlbum: (albumId: string, photoId: string, updates: Partial<Photo>) => void;
  getFavoritePhotos: () => { albumId: string; photo: Photo }[];
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const initialPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    title: 'Forest',
    favorite: false,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    title: 'Mountains',
    favorite: true,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    title: 'Forest Path',
    favorite: false,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    title: 'Waterfall',
    favorite: false,
  }
];

const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useStore = create<Store>((set, get) => ({
  photos: loadFromStorage('photos', initialPhotos),
  albums: loadFromStorage('albums', []),
  darkMode: loadFromStorage('darkMode', false),
  addPhoto: (photo: Photo) =>
    set((state) => {
      const newPhotos = [...state.photos, photo];
      saveToStorage('photos', newPhotos);
      return { photos: newPhotos };
    }),
  removePhoto: (photoId: string) =>
    set((state) => {
      const newPhotos = state.photos.filter((photo) => photo.id !== photoId);
      saveToStorage('photos', newPhotos);
      return { photos: newPhotos };
    }),
  addAlbum: (title: string) =>
    set((state) => {
      const newAlbums = [
        ...state.albums,
        {
          id: Math.random().toString(36).substr(2, 9),
          title,
          photos: [],
          createdAt: new Date(),
        },
      ];
      saveToStorage('albums', newAlbums);
      return { albums: newAlbums };
    }),
  removeAlbum: (albumId) =>
    set((state) => {
      const newAlbums = state.albums.filter((album) => album.id !== albumId);
      saveToStorage('albums', newAlbums);
      return { albums: newAlbums };
    }),
  updateAlbum: (albumId, title) =>
    set((state) => {
      const newAlbums = state.albums.map((album) =>
        album.id === albumId ? { ...album, title } : album
      );
      saveToStorage('albums', newAlbums);
      return { albums: newAlbums };
    }),
  toggleFavorite: (photoId) =>
    set((state) => {
      const newPhotos = state.photos.map((photo) =>
        photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
      );
      saveToStorage('photos', newPhotos);
      return { photos: newPhotos };
    }),
  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.darkMode;
      saveToStorage('darkMode', newDarkMode);
      return { darkMode: newDarkMode };
    }),
  addPhotoToAlbum: (albumId, photo) =>
    set((state) => {
      const newAlbums = state.albums.map((album) =>
        album.id === albumId
          ? { ...album, photos: [...album.photos, photo] }
          : album
      );
      saveToStorage('albums', newAlbums);
      return { albums: newAlbums };
    }),
  removePhotoFromAlbum: (albumId, photoId) =>
    set((state) => {
      const newAlbums = state.albums.map((album) =>
        album.id === albumId
          ? { ...album, photos: album.photos.filter((photo) => photo.id !== photoId) }
          : album
      );
      saveToStorage('albums', newAlbums);
      return { albums: newAlbums };
    }),
  updatePhotoInAlbum: (albumId, photoId, updates) =>
    set((state) => {
      const newAlbums = state.albums.map((album) =>
        album.id === albumId
          ? {
              ...album,
              photos: album.photos.map((photo) =>
                photo.id === photoId ? { ...photo, ...updates } : photo
              ),
            }
          : album
      );
      const newPhotos = state.photos.map((photo) =>
        photo.id === photoId ? { ...photo, ...updates } : photo
      );
      saveToStorage('albums', newAlbums);
      saveToStorage('photos', newPhotos);
      return { albums: newAlbums, photos: newPhotos };
    }),
  getFavoritePhotos: () => {
    const state = get();
    const favoritePhotos: { albumId: string; photo: Photo }[] = [];
    
    state.photos.forEach((photo) => {
      if (photo.favorite) {
        favoritePhotos.push({ albumId: '', photo });
      }
    });
    
    state.albums.forEach((album) => {
      album.photos.forEach((photo) => {
        if (photo.favorite) {
          favoritePhotos.push({ albumId: album.id, photo });
        }
      });
    });
    
    return favoritePhotos;
  },
}));