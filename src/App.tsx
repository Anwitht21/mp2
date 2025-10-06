import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PhotoProvider } from './context/PhotoContext';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import GalleryView from './components/GalleryView/GalleryView';
import ListView from './components/ListView/ListView';
import DetailView from './components/DetailView/DetailView';
import styles from './components/Layout/Layout.module.css';
import './App.css';

const App: React.FC = () => {
  return (
    <PhotoProvider>
      <BrowserRouter basename="/mp2">
        <div className={styles.layout}>
          <Header />
          <Navigation />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<GalleryView />} />
              <Route path="/list" element={<ListView />} />
              <Route path="/photo/:photoId" element={<DetailView />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </PhotoProvider>
  );
};

export default App;
