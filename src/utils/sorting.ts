import { Photo, SortField, SortOrder } from '../types/nasa';

export const sortPhotos = (
  photos: Photo[],
  field: SortField,
  order: SortOrder
): Photo[] => {
  const sorted = [...photos].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'earth_date':
        comparison = new Date(a.earth_date).getTime() - new Date(b.earth_date).getTime();
        break;
      case 'sol':
        comparison = a.sol - b.sol;
        break;
      case 'camera':
        comparison = a.camera.name.localeCompare(b.camera.name);
        break;
      case 'id':
        comparison = a.id - b.id;
        break;
      default:
        comparison = 0;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

