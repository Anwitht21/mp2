import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <h1>🚀 Mars Rover Explorer</h1>
        </Link>
        <p className={styles.subtitle}>Explore NASA's Mars Rover Photo Archive</p>
      </div>
    </header>
  );
};

export default Header;

