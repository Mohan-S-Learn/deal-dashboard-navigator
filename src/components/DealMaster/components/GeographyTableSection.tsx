
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, AlertTriangle } from 'lucide-react';
import { Geography, SelectedGeographyRow } from '../types';
import { AddRowsDialog } from './AddRowsDialog';

interface GeographyTableSectionProps {
  geographies: Geography[];
  selectedGeographies: number[];
  onGeographyChange: (geographyId: number, checked: boolean) => void;
}

export const GeographyTableSection: React.FC<GeographyTableSectionProps> = ({
  geographies
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

  const copyFirstRowToAll = () => {
    if (selectedRows.length > 0) {
      const firstRow = selectedRows[0];
      setSelectedRows(prev => prev.map((row, index) => 
        index === 0 ? row : {
          ...row,
          region: firstRow.region,
          country: firstRow.country,
          city: firstRow.city
        }
      ));
    }
  };

  const getDuplicates = () => {
    const valueCount: Record<string, number> = {};
    selectedRows.forEach(row => {
      if (row.region && row.country && row.city) {
        const key = `${row.region}-${row.country}-${row.city}`;
        valueCount[key] = (valueCount[key] || 0) + 1;
      }
    });
    return Object.keys(valueCount).filter(key => valueCount[key] > 1);
  };

  const isDuplicate = (row: SelectedGeographyRow) => {
    if (!row.region || !row.country || !row.city) return false;
    const key = `${row.region}-${row.country}-${row.city}`;
    return getDuplicates().includes(key);
  };

  const duplicates = getDuplicates();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Geography & Service Locations</CardTitle>
          <div className="flex gap-2">
            <Button onClick={copyFirstRowToAll} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy First Row to All
            </Button>
            <AddRowsDialog
              title="Add Geography Rows"
              buttonText="Add Rows"
              onAddRows={addRows}
            />
          </div>
        </div>
        {duplicates.length > 0 && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Duplicate locations detected. Please select different values.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedRows.map((row, index) => (
              <TableRow key={row.id} className={isDuplicate(row) ? 'bg-red-50' : ''}>
                <TableCell>
                  <Select value={row.region} onValueChange={(value) => updateRow(row.id, 'region', value)}>
                    <SelectTrigger className={`w-full ${isDuplicate(row) ? 'border-red-500' : ''}`}>
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
                    value={row.country} 
                    onValueChange={(value) => updateRow(row.id, 'country', value)}
                    disabled={!row.region}
                  >
                    <SelectTrigger className={`w-full ${isDuplicate(row) ? 'border-red-500' : ''}`}>
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
                    value={row.city} 
                    onValueChange={(value) => updateRow(row.id, 'city', value)}
                    disabled={!row.country}
                  >
                    <SelectTrigger className={`w-full ${isDuplicate(row) ? 'border-red-500' : ''}`}>
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
                    onClick={() => removeRow(row.id)}
                    disabled={selectedRows.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
