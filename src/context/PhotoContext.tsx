import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Photo } from '../types/nasa';

interface PhotoContextType {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  currentPhotoIndex: number;
  setCurrentPhotoIndex: (index: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PhotoContext.Provider
      value={{
        photos,
        setPhotos,
        currentPhotoIndex,
        setCurrentPhotoIndex,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = (): PhotoContextType => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};

