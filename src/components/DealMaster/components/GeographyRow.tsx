
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Geography } from '../types';

interface GeographyRowData {
  id: string;
  geographyId: number | null;
  region: string;
  country: string;
  city: string;
}

interface GeographyRowProps {
  row: GeographyRowData;
  geographies: Geography[];
  isDuplicate: boolean;
  canRemove: boolean;
  onUpdate: (id: string, field: keyof GeographyRowData, value: string | number) => void;
  onRemove: (id: string) => void;
}

export const GeographyRow: React.FC<GeographyRowProps> = ({
  row,
  geographies,
  isDuplicate,
  canRemove,
  onUpdate,
  onRemove
}) => {
  // Group geographies by region and country
  const groupedGeographies = React.useMemo(() => {
    const regions: Record<string, Record<string, Geography[]>> = {};
    
    geographies.forEach(geo => {
      if (!regions[geo.region]) {
        regions[geo.region] = {};
      }
      if (!regions[geo.region][geo.country]) {
        regions[geo.region][geo.country] = [];
      }
      regions[geo.region][geo.country].push(geo);
    });
    
    return regions;
  }, [geographies]);

  const getUniqueRegions = () => {
    return Object.keys(groupedGeographies).sort();
  };

  const getCountriesForRegion = (region: string) => {
    return region ? Object.keys(groupedGeographies[region] || {}).sort() : [];
  };

  const getCitiesForCountry = (region: string, country: string) => {
    return region && country ? groupedGeographies[region]?.[country] || [] : [];
  };

  return (
    <TableRow className={isDuplicate ? 'bg-red-50' : ''}>
      <TableCell>
        <Select 
          value={row.region || ''} 
          onValueChange={(value) => onUpdate(row.id, 'region', value)}
        >
          <SelectTrigger className={`w-full ${isDuplicate ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {getUniqueRegions().map(region => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select 
          value={row.country || ''} 
          onValueChange={(value) => onUpdate(row.id, 'country', value)}
          disabled={!row.region}
        >
          <SelectTrigger className={`w-full ${isDuplicate ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {getCountriesForRegion(row.region).map(country => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select 
          value={row.city || ''} 
          onValueChange={(value) => onUpdate(row.id, 'city', value)}
          disabled={!row.country}
        >
          <SelectTrigger className={`w-full ${isDuplicate ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {getCitiesForCountry(row.region, row.country).map(geo => (
              <SelectItem key={geo.id} value={geo.city}>
                {geo.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onRemove(row.id)}
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
