
import { Geography } from '../types';

export const findMatchingGeography = (
  geographies: Geography[],
  region: string,
  country: string,
  city: string
): Geography | undefined => {
  return geographies.find(g => 
    g.region === region && 
    g.country === country && 
    g.city === city
  );
};

export const extractValidGeographyIds = (rows: any[]): number[] => {
  return rows
    .filter(row => {
      const isValid = row.geographyId !== null && row.geographyId !== undefined;
      console.log(`Geography Utils - Row ${row.id} geography ID ${row.geographyId} is valid: ${isValid}`);
      return isValid;
    })
    .map(row => row.geographyId as number);
};

export const getDuplicateGeographyIds = (rows: any[]): number[] => {
  const geographyCount: Record<number, number> = {};
  rows.forEach(row => {
    if (row.geographyId) {
      geographyCount[row.geographyId] = (geographyCount[row.geographyId] || 0) + 1;
    }
  });
  return Object.keys(geographyCount).map(Number).filter(geoId => geographyCount[geoId] > 1);
};
