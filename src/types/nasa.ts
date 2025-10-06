export interface Camera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface Rover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: Camera[];
}

export interface Photo {
  id: number;
  sol: number;
  camera: Camera;
  img_src: string;
  earth_date: string;
  rover: Rover;
}

export interface PhotosResponse {
  photos: Photo[];
  latest_photos?: Photo[];
}

export interface RoverResponse {
  rover: Rover;
}

export interface RoverManifest {
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  photos: {
    sol: number;
    earth_date: string;
    total_photos: number;
    cameras: string[];
  }[];
}

export interface ManifestResponse {
  photo_manifest: RoverManifest;
}

export type SortField = 'earth_date' | 'sol' | 'camera' | 'id';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  rovers: string[];
  cameras: string[];
  searchQuery: string;
}

