import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
          Gallery
        </Link>
        <Link to="/list" className={`${styles.navLink} ${isActive('/list')}`}>
          List View
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;

