import apiClient from './api';
import { PhotosResponse, RoverResponse, ManifestResponse, Photo } from '../types/nasa';

const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached data for:', key);
    return cached.data as T;
  }
  return null;
};

const setCachedData = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const getPhotosBySol = async (
  rover: string,
  sol: number,
  page: number = 1
): Promise<Photo[]> => {
  const cacheKey = `photos-${rover}-${sol}-${page}`;
  const cached = getCachedData<Photo[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiClient.get<PhotosResponse>(`/rovers/${rover}/photos`, {
      params: { sol, page },
    });
    setCachedData(cacheKey, response.data.photos);
    return response.data.photos;
  } catch (error) {
    console.error('Error fetching photos by sol:', error);
    throw error;
  }
};

export const getPhotosByEarthDate = async (
  rover: string,
  earthDate: string,
  page: number = 1
): Promise<Photo[]> => {
  const cacheKey = `photos-${rover}-${earthDate}-${page}`;
  const cached = getCachedData<Photo[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiClient.get<PhotosResponse>(`/rovers/${rover}/photos`, {
      params: { earth_date: earthDate, page },
    });
    setCachedData(cacheKey, response.data.photos);
    return response.data.photos;
  } catch (error) {
    console.error('Error fetching photos by earth date:', error);
    throw error;
  }
};

export const getLatestPhotos = async (rover: string): Promise<Photo[]> => {
  const cacheKey = `latest-${rover}`;
  const cached = getCachedData<Photo[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiClient.get<PhotosResponse>(`/rovers/${rover}/latest_photos`);
    
    if (response.data.latest_photos && response.data.latest_photos.length > 0) {
      const photos = response.data.latest_photos;
      setCachedData(cacheKey, photos);
      return photos;
    }
    
    const roverInfo = await apiClient.get<RoverResponse>(`/rovers/${rover}`);
    const maxSol = roverInfo.data.rover.max_sol;
    
    for (let i = 0; i < 10; i++) {
      const sol = maxSol - i;
      const photosResponse = await apiClient.get<PhotosResponse>(`/rovers/${rover}/photos`, {
        params: { sol }
      });
      
      if (photosResponse.data.photos.length > 0) {
        setCachedData(cacheKey, photosResponse.data.photos);
        return photosResponse.data.photos;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching latest photos:', error);
    try {
      const fallbackDate = rover === 'curiosity' ? '2024-01-01' : '2018-06-01';
      const fallbackResponse = await apiClient.get<PhotosResponse>(`/rovers/${rover}/photos`, {
        params: { earth_date: fallbackDate }
      });
      return fallbackResponse.data.photos || [];
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

export const getRoverInfo = async (rover: string): Promise<RoverResponse> => {
  const cacheKey = `rover-${rover}`;
  const cached = getCachedData<RoverResponse>(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiClient.get<RoverResponse>(`/rovers/${rover}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching rover info:', error);
    throw error;
  }
};

export const getRoverManifest = async (rover: string): Promise<ManifestResponse> => {
  const cacheKey = `manifest-${rover}`;
  const cached = getCachedData<ManifestResponse>(cacheKey);
  if (cached) return cached;

  try {
    const response = await apiClient.get<ManifestResponse>(`/manifests/${rover}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching rover manifest:', error);
    throw error;
  }
};

export const getPhotosFromAllRovers = async (): Promise<Photo[]> => {
  const cacheKey = 'all-rovers-photos';
  const cached = getCachedData<Photo[]>(cacheKey);
  if (cached) return cached;

  try {
    console.log('📸 Fetching photos from all rovers...');
    const rovers = ['curiosity', 'opportunity', 'spirit'];
    const promises = rovers.map((rover) => 
      getLatestPhotos(rover).catch((err) => {
        console.warn(`⚠️ Failed to fetch photos for ${rover}:`, err.message);
        return [];
      })
    );
    const results = await Promise.all(promises);
    const allPhotos = results.flat();
    console.log(`✅ Total photos fetched: ${allPhotos.length}`);
    
    if (allPhotos.length === 0) {
      console.warn('⚠️ No photos found from any rover, trying fallback...');
      const fallbackPhotos = await getPhotosByEarthDate('curiosity', '2024-01-01').catch(() => []);
      if (fallbackPhotos.length > 0) {
        setCachedData(cacheKey, fallbackPhotos);
        return fallbackPhotos;
      }
    }
    
    setCachedData(cacheKey, allPhotos);
    return allPhotos;
  } catch (error) {
    console.error('Error fetching photos from all rovers:', error);
    throw error;
  }
};

export const getPhotosByDateRange = async (
  startDate: string,
  endDate?: string
): Promise<Photo[]> => {
  try {
    const rovers = ['curiosity', 'opportunity', 'spirit'];
    const promises = rovers.map((rover) =>
      getPhotosByEarthDate(rover, startDate).catch(() => [])
    );
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching photos by date range:', error);
    throw error;
  }
};

