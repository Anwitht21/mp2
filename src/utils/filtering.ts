import { Photo, FilterOptions } from '../types/nasa';

export const filterPhotos = (photos: Photo[], filters: FilterOptions): Photo[] => {
  return photos.filter((photo) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        photo.camera.name.toLowerCase().includes(query) ||
        photo.camera.full_name.toLowerCase().includes(query) ||
        photo.rover.name.toLowerCase().includes(query) ||
        photo.earth_date.includes(query) ||
        photo.sol.toString().includes(query);

      if (!matchesSearch) return false;
    }

    if (filters.rovers.length > 0) {
      const matchesRover = filters.rovers.some(
        (rover) => rover.toLowerCase() === photo.rover.name.toLowerCase()
      );
      if (!matchesRover) return false;
    }

    if (filters.cameras.length > 0) {
      const matchesCamera = filters.cameras.some(
        (camera) => camera.toLowerCase() === photo.camera.name.toLowerCase()
      );
      if (!matchesCamera) return false;
    }

    return true;
  });
};

export const getUniqueCameras = (photos: Photo[]): string[] => {
  const cameras = new Set<string>();
  photos.forEach((photo) => cameras.add(photo.camera.name));
  return Array.from(cameras).sort();
};

export const getUniqueRovers = (photos: Photo[]): string[] => {
  const rovers = new Set<string>();
  photos.forEach((photo) => rovers.add(photo.rover.name));
  return Array.from(rovers).sort();
};

