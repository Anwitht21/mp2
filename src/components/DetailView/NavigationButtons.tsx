import React from 'react';
import styles from './DetailView.module.css';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  currentIndex: number;
  total: number;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentIndex,
  total,
}) => {
  return (
    <div className={styles.navigation}>
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={styles.navButton}
        aria-label="Previous photo"
      >
        ← Previous
      </button>
      
      <span className={styles.counter}>
        {currentIndex} / {total}
      </span>
      
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={styles.navButton}
        aria-label="Next photo"
      >
        Next →
      </button>
    </div>
  );
};

export default NavigationButtons;

