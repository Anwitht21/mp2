import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Photo } from '../../types/nasa';
import { usePhotoContext } from '../../context/PhotoContext';
import { getPhotosFromAllRovers } from '../../services/nasaService';
import NavigationButtons from './NavigationButtons';
import styles from './DetailView.module.css';

const DetailView: React.FC = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const navigate = useNavigate();
  const { photos, currentPhotoIndex, setPhotos, setCurrentPhotoIndex } = usePhotoContext();
  
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhoto = async () => {
      setLoading(true);
      setError(null);

      try {
        if (photos.length > 0) {
          const photo = photos.find((p) => p.id === Number(photoId));
          if (photo) {
            setCurrentPhoto(photo);
            const index = photos.findIndex((p) => p.id === Number(photoId));
            setCurrentPhotoIndex(index);
            setLoading(false);
            return;
          }
        }

        const allPhotos = await getPhotosFromAllRovers();
        const photo = allPhotos.find((p) => p.id === Number(photoId));
        
        if (photo) {
          setCurrentPhoto(photo);
          setPhotos(allPhotos);
          const index = allPhotos.findIndex((p) => p.id === Number(photoId));
          setCurrentPhotoIndex(index);
        } else {
          setError('Photo not found');
        }
      } catch (err) {
        setError('Failed to load photo. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId]);

  const handlePrevious = () => {
    if (currentPhotoIndex > 0 && photos.length > 0) {
      const prevPhoto = photos[currentPhotoIndex - 1];
      navigate(`/photo/${prevPhoto.id}`);
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < photos.length - 1 && photos.length > 0) {
      const nextPhoto = photos[currentPhotoIndex + 1];
      navigate(`/photo/${nextPhoto.id}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading photo...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPhoto) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>{error || 'Photo not found'}</h3>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <img
            src={currentPhoto.img_src}
            alt={`${currentPhoto.rover?.name || 'Mars Rover'} - ${currentPhoto.camera?.full_name || 'Camera'}`}
            className={styles.image}
          />
          <NavigationButtons
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={currentPhotoIndex > 0}
            hasNext={currentPhotoIndex < photos.length - 1}
            currentIndex={currentPhotoIndex + 1}
            total={photos.length}
          />
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.header}>
            <h2>{currentPhoto.rover?.name || 'Mars Rover'}</h2>
            <span className={styles.badge}>{currentPhoto.camera?.name || 'CAMERA'}</span>
          </div>

          <div className={styles.details}>
            <div className={styles.detailGroup}>
              <h3>Photo Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Photo ID:</span>
                <span className={styles.value}>{currentPhoto.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Earth Date:</span>
                <span className={styles.value}>{currentPhoto.earth_date}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Sol (Mars Day):</span>
                <span className={styles.value}>{currentPhoto.sol}</span>
              </div>
            </div>

            <div className={styles.detailGroup}>
              <h3>Camera Details</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Camera Name:</span>
                <span className={styles.value}>{currentPhoto.camera?.name || 'Unknown'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Full Name:</span>
                <span className={styles.value}>{currentPhoto.camera?.full_name || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Camera ID:</span>
                <span className={styles.value}>{currentPhoto.camera?.id || 'N/A'}</span>
              </div>
            </div>

            <div className={styles.detailGroup}>
              <h3>Rover Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.label}>Rover:</span>
                <span className={styles.value}>{currentPhoto.rover.name || 'Unknown'}</span>
              </div>
              {currentPhoto.rover.landing_date && (
                <div className={styles.detailItem}>
                  <span className={styles.label}>Landing Date:</span>
                  <span className={styles.value}>{currentPhoto.rover.landing_date}</span>
                </div>
              )}
              {currentPhoto.rover.launch_date && (
                <div className={styles.detailItem}>
                  <span className={styles.label}>Launch Date:</span>
                  <span className={styles.value}>{currentPhoto.rover.launch_date}</span>
                </div>
              )}
              {currentPhoto.rover.status && (
                <div className={styles.detailItem}>
                  <span className={styles.label}>Status:</span>
                  <span className={`${styles.value} ${styles.status}`}>
                    {currentPhoto.rover.status}
                  </span>
                </div>
              )}
              {currentPhoto.rover.total_photos && (
                <div className={styles.detailItem}>
                  <span className={styles.label}>Total Photos:</span>
                  <span className={styles.value}>{currentPhoto.rover.total_photos.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <a
            href={currentPhoto.img_src}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewOriginal}
          >
            View Original Image →
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetailView;

