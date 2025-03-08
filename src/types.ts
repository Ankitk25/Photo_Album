import React from 'react';

export interface Photo {
  id: string;
  url: string;
  title: string;
  favorite: boolean;
  filters?: {
    grayscale: number;
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

export interface Album {
  id: string;
  title: string;
  photos: Photo[];
  createdAt: Date;
}