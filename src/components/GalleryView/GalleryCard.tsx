import React from 'react';
import { Photo } from '../../types/nasa';
import styles from './GalleryView.module.css';

interface GalleryCardProps {
  photo: Photo;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ photo, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.cardImage}>
        <img
          src={photo.img_src}
          alt={`${photo.rover?.name || 'Mars Rover'} - ${photo.camera?.full_name || 'Camera'}`}
          loading="lazy"
        />
        <div className={styles.cardOverlay}>
          <div className={styles.cardInfo}>
            <span className={styles.roverName}>{photo.rover?.name || 'Unknown Rover'}</span>
            <span className={styles.cameraName}>{photo.camera?.name || 'CAMERA'}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardDetails}>
        <p className={styles.cardDate}>{photo.earth_date || 'Unknown Date'}</p>
        <p className={styles.cardSol}>Sol {photo.sol || 0}</p>
      </div>
    </div>
  );
};

export default GalleryCard;

