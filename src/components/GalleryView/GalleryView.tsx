import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Photo } from '../../types/nasa';
import { getPhotosFromAllRovers } from '../../services/nasaService';
import { filterPhotos, getUniqueCameras, getUniqueRovers } from '../../utils/filtering';
import { usePhotoContext } from '../../context/PhotoContext';
import FilterPanel from './FilterPanel';
import GalleryCard from './GalleryCard';
import styles from './GalleryView.module.css';

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  const { setPhotos: setContextPhotos, setCurrentPhotoIndex } = usePhotoContext();
  
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedRovers, setSelectedRovers] = useState<string[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  
  const [availableRovers, setAvailableRovers] = useState<string[]>([]);
  const [availableCameras, setAvailableCameras] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const photos = await getPhotosFromAllRovers();
        setAllPhotos(photos);
        setDisplayedPhotos(photos);
        
        setAvailableRovers(getUniqueRovers(photos));
        setAvailableCameras(getUniqueCameras(photos));
      } catch (err) {
        setError('Failed to load photos. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const filtered = filterPhotos(allPhotos, {
      rovers: selectedRovers,
      cameras: selectedCameras,
      searchQuery: '',
    });
    setDisplayedPhotos(filtered);
  }, [allPhotos, selectedRovers, selectedCameras]);

  const handlePhotoClick = (photo: Photo) => {
    const photoIndex = displayedPhotos.findIndex((p) => p.id === photo.id);
    setContextPhotos(displayedPhotos);
    setCurrentPhotoIndex(photoIndex);
    navigate(`/photo/${photo.id}`);
  };

  const handleRoverToggle = (rover: string) => {
    setSelectedRovers((prev) =>
      prev.includes(rover)
        ? prev.filter((r) => r !== rover)
        : [...prev, rover]
    );
  };

  const handleCameraToggle = (camera: string) => {
    setSelectedCameras((prev) =>
      prev.includes(camera)
        ? prev.filter((c) => c !== camera)
        : [...prev, camera]
    );
  };

  const clearFilters = () => {
    setSelectedRovers([]);
    setSelectedCameras([]);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading Mars Rover photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gallery View</h2>
        <p className={styles.subtitle}>
          Showing {displayedPhotos.length} of {allPhotos.length} photos
        </p>
      </div>

      <FilterPanel
        availableRovers={availableRovers}
        availableCameras={availableCameras}
        selectedRovers={selectedRovers}
        selectedCameras={selectedCameras}
        onRoverToggle={handleRoverToggle}
        onCameraToggle={handleCameraToggle}
        onClearFilters={clearFilters}
      />

      {displayedPhotos.length === 0 ? (
        <div className={styles.empty}>
          <h3>No photos found</h3>
          <p>Try adjusting your filters</p>
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={styles.gallery}>
          {displayedPhotos.map((photo) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              onClick={() => handlePhotoClick(photo)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryView;

