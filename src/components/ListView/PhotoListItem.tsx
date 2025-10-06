import React from 'react';
import { Photo } from '../../types/nasa';
import styles from './ListView.module.css';

interface PhotoListItemProps {
  photo: Photo;
  onClick: () => void;
}

const PhotoListItem: React.FC<PhotoListItemProps> = ({ photo, onClick }) => {
  return (
    <div className={styles.listItem} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.thumbnail}>
        <img src={photo.img_src} alt={`${photo.rover?.name || 'Mars Rover'} - ${photo.camera?.full_name || 'Camera'}`} />
      </div>
      
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <h3>{photo.rover?.name || 'Unknown Rover'}</h3>
          <span className={styles.badge}>{photo.camera?.name || 'CAMERA'}</span>
        </div>
        
        <div className={styles.itemDetails}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Camera:</span>
            <span>{photo.camera?.full_name || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Earth Date:</span>
            <span>{photo.earth_date || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Sol:</span>
            <span>{photo.sol || 0}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Photo ID:</span>
            <span>{photo.id || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className={styles.arrow}>→</div>
    </div>
  );
};

export default PhotoListItem;

