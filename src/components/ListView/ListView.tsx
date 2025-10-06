import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Photo, SortField, SortOrder } from '../../types/nasa';
import { getPhotosFromAllRovers } from '../../services/nasaService';
import { sortPhotos } from '../../utils/sorting';
import { filterPhotos } from '../../utils/filtering';
import { usePhotoContext } from '../../context/PhotoContext';
import SearchBar from './SearchBar';
import PhotoListItem from './PhotoListItem';
import styles from './ListView.module.css';

const ListView: React.FC = () => {
  const navigate = useNavigate();
  const { setPhotos: setContextPhotos, setCurrentPhotoIndex } = usePhotoContext();
  
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('earth_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const photos = await getPhotosFromAllRovers();
        setAllPhotos(photos);
        setDisplayedPhotos(photos);
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
    let filtered = filterPhotos(allPhotos, {
      rovers: [],
      cameras: [],
      searchQuery,
    });

    filtered = sortPhotos(filtered, sortField, sortOrder);
    setDisplayedPhotos(filtered);
  }, [allPhotos, searchQuery, sortField, sortOrder]);

  const handlePhotoClick = (photo: Photo) => {
    const photoIndex = displayedPhotos.findIndex((p) => p.id === photo.id);
    setContextPhotos(displayedPhotos);
    setCurrentPhotoIndex(photoIndex);
    navigate(`/photo/${photo.id}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
        <h2>List View</h2>
        <p className={styles.subtitle}>
          Showing {displayedPhotos.length} of {allPhotos.length} photos
        </p>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className={styles.controls}>
        <div className={styles.sortControls}>
          <label htmlFor="sortField">Sort by:</label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className={styles.select}
          >
            <option value="earth_date">Earth Date</option>
            <option value="sol">Sol (Mars Day)</option>
            <option value="camera">Camera Name</option>
            <option value="id">Photo ID</option>
          </select>

          <button onClick={toggleSortOrder} className={styles.sortButton}>
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>

      {displayedPhotos.length === 0 ? (
        <div className={styles.empty}>
          <h3>No photos found</h3>
          <p>Try adjusting your search query</p>
        </div>
      ) : (
        <div className={styles.list}>
          {displayedPhotos.map((photo) => (
            <PhotoListItem
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

export default ListView;

