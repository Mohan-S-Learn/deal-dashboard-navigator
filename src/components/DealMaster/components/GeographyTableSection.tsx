
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, AlertTriangle } from 'lucide-react';
import { Geography } from '../types';
import { AddRowsDialog } from './AddRowsDialog';
import { supabase } from '@/integrations/supabase/client';

interface GeographyTableSectionProps {
  geographies: Geography[];
  selectedGeographies: number[];
  onGeographyChange: (geographyId: number, checked: boolean) => void;
  onDataChange: (data: number[]) => void;
}

interface GeographyRowData {
  id: string;
  geographyId: number | null;
  region: string;
  country: string;
  city: string;
}

export const GeographyTableSection: React.FC<GeographyTableSectionProps> = ({
  geographies,
  onDataChange
}) => {
  const [selectedRows, setSelectedRows] = useState<GeographyRowData[]>([
    { id: '1', geographyId: null, region: '', country: '', city: '' }
  ]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load existing data from database
  useEffect(() => {
    const loadExistingData = async () => {
      if (isInitialized) return;
      
      try {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');
        
        if (pathParts.length >= 4 && pathParts[1] === 'deal-master') {
          const dealId = pathParts[2];
          const quoteName = decodeURIComponent(pathParts[3]);
          
          console.log('Geography - Loading existing data for:', { dealId, quoteName });
          
          const { data: existingGeographies, error } = await supabase
            .from('QuoteGeography')
            .select(`
              geography_id,
              Geography (
                id,
                region,
                country,
                city
              )
            `)
            .eq('Deal_Id', dealId)
            .eq('Quote_Name', quoteName);

          if (error) {
            console.error('Geography - Error loading existing data:', error);
          } else if (existingGeographies && existingGeographies.length > 0) {
            console.log('Geography - Found existing data:', existingGeographies);
            
            const loadedRows = existingGeographies.map((item, index) => {
              const geo = item.Geography as any;
              return {
                id: (index + 1).toString(),
                geographyId: item.geography_id,
                region: geo?.region || '',
                country: geo?.country || '',
                city: geo?.city || ''
              };
            });
            
            setSelectedRows(loadedRows);
            console.log('Geography - Set loaded rows:', loadedRows);
          }
        }
      } catch (error) {
        console.error('Geography - Error in loadExistingData:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadExistingData();
  }, [isInitialized]);

  // Send data to parent whenever it changes
  useEffect(() => {
    const validGeographyIds = selectedRows
      .filter(row => row.geographyId !== null && row.geographyId !== undefined)
      .map(row => row.geographyId as number);
    
    console.log('Geography - Data change detected');
    console.log('Geography - selectedRows:', selectedRows);
    console.log('Geography - sending geography IDs to parent:', validGeographyIds);
    
    onDataChange(validGeographyIds);
  }, [selectedRows, onDataChange]);

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

  const updateRow = (id: string, field: keyof GeographyRowData, value: string | number) => {
    console.log(`Geography - Updating row ${id}, field ${field}, value:`, value);
    
    setSelectedRows(prev => {
      const newRows = prev.map(row => {
        if (row.id === id) {
          if (field === 'region') {
            const updatedRow = {
              ...row,
              region: value as string,
              country: '',
              city: '',
              geographyId: null
            };
            console.log('Geography - Updated row with region:', updatedRow);
            return updatedRow;
          } else if (field === 'country') {
            const updatedRow = {
              ...row,
              country: value as string,
              city: '',
              geographyId: null
            };
            console.log('Geography - Updated row with country:', updatedRow);
            return updatedRow;
          } else if (field === 'city') {
            const matchingGeo = geographies.find(g => 
              g.region === row.region && 
              g.country === row.country && 
              g.city === value
            );
            const updatedRow = {
              ...row,
              city: value as string,
              geographyId: matchingGeo ? matchingGeo.id : null
            };
            console.log('Geography - Updated row with city:', updatedRow);
            console.log('Geography - Matching geography found:', matchingGeo);
            return updatedRow;
          }
        }
        return row;
      });
      
      console.log('Geography - All rows after update:', newRows);
      return newRows;
    });
  };

  const addRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) => ({
      id: Date.now().toString() + i,
      geographyId: null,
      region: '',
      country: '',
      city: ''
    }));
    console.log('Geography - Adding new rows:', newRows);
    setSelectedRows(prev => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    if (selectedRows.length > 1) {
      console.log('Geography - Removing row:', id);
      setSelectedRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const copyFirstRowToAll = () => {
    if (selectedRows.length > 0) {
      const firstRow = selectedRows[0];
      console.log('Geography - Copying first row to all:', firstRow);
      setSelectedRows(prev => prev.map((row, index) => 
        index === 0 ? row : {
          ...row,
          geographyId: firstRow.geographyId,
          region: firstRow.region,
          country: firstRow.country,
          city: firstRow.city
        }
      ));
    }
  };

  const getDuplicates = () => {
    const geographyCount: Record<number, number> = {};
    selectedRows.forEach(row => {
      if (row.geographyId) {
        geographyCount[row.geographyId] = (geographyCount[row.geographyId] || 0) + 1;
      }
    });
    return Object.keys(geographyCount).map(Number).filter(geoId => geographyCount[geoId] > 1);
  };

  const isDuplicate = (row: GeographyRowData) => {
    if (!row.geographyId) return false;
    return getDuplicates().includes(row.geographyId);
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
            {selectedRows.map((row) => (
              <TableRow key={row.id} className={isDuplicate(row) ? 'bg-red-50' : ''}>
                <TableCell>
                  <Select 
                    value={row.region || ''} 
                    onValueChange={(value) => updateRow(row.id, 'region', value)}
                  >
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
                    value={row.country || ''} 
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
                    value={row.city || ''} 
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
