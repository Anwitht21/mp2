import React, { useState } from 'react';
import styles from './GalleryView.module.css';

interface FilterPanelProps {
  availableRovers: string[];
  availableCameras: string[];
  selectedRovers: string[];
  selectedCameras: string[];
  onRoverToggle: (rover: string) => void;
  onCameraToggle: (camera: string) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  availableRovers,
  availableCameras,
  selectedRovers,
  selectedCameras,
  onRoverToggle,
  onCameraToggle,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const hasActiveFilters = selectedRovers.length > 0 || selectedCameras.length > 0;

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <h3>Filters</h3>
        <div className={styles.filterActions}>
          {hasActiveFilters && (
            <button onClick={onClearFilters} className={styles.clearFiltersButton}>
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.toggleButton}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.filterContent}>
          <div className={styles.filterGroup}>
            <h4>Rovers</h4>
            <div className={styles.checkboxGroup}>
              {availableRovers.map((rover) => (
                <label key={rover} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedRovers.includes(rover)}
                    onChange={() => onRoverToggle(rover)}
                  />
                  <span className={styles.checkboxLabel}>{rover}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Cameras</h4>
            <div className={styles.checkboxGroup}>
              {availableCameras.map((camera) => (
                <label key={camera} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedCameras.includes(camera)}
                    onChange={() => onCameraToggle(camera)}
                  />
                  <span className={styles.checkboxLabel}>{camera}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

