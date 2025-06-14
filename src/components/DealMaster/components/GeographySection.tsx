
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Geography, SelectedGeographyRow } from '../types';
import { AddRowsDialog } from './AddRowsDialog';

interface GeographySectionProps {
  geographies: Geography[];
  selectedGeographies: number[];
  onGeographyChange: (geographyId: number, checked: boolean) => void;
}

export const GeographySection: React.FC<GeographySectionProps> = ({
  geographies,
  selectedGeographies,
  onGeographyChange
}) => {
  const [selectedRows, setSelectedRows] = useState<SelectedGeographyRow[]>([
    { id: '1', region: '', country: '', city: '' }
  ]);

  // Group geographies by region and country
  const groupedGeographies = useMemo(() => {
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

  const updateRow = (id: string, field: keyof SelectedGeographyRow, value: string) => {
    setSelectedRows(prev => prev.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Reset dependent fields when parent changes
        if (field === 'region') {
          updatedRow.country = '';
          updatedRow.city = '';
        } else if (field === 'country') {
          updatedRow.city = '';
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  const addRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) => ({
      id: Date.now().toString() + i,
      region: '',
      country: '',
      city: ''
    }));
    setSelectedRows(prev => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    if (selectedRows.length > 1) {
      setSelectedRows(prev => prev.filter(row => row.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Geography & Service Locations</CardTitle>
          <AddRowsDialog
            title="Add Geography Rows"
            buttonText="Add Rows"
            onAddRows={addRows}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedRows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={row.region} onValueChange={(value) => updateRow(row.id, 'region', value)}>
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select 
                  value={row.country} 
                  onValueChange={(value) => updateRow(row.id, 'country', value)}
                  disabled={!row.region}
                >
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Select 
                  value={row.city} 
                  onValueChange={(value) => updateRow(row.id, 'city', value)}
                  disabled={!row.country}
                >
                  <SelectTrigger>
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
              </div>

              <div className="flex items-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeRow(row.id)}
                  disabled={selectedRows.length === 1}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
