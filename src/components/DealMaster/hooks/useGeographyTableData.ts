
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Geography } from '../types';

interface GeographyRowData {
  id: string;
  geographyId: number | null;
  region: string;
  country: string;
  city: string;
}

export const useGeographyTableData = (
  geographies: Geography[],
  onDataChange: (data: number[]) => void
) => {
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
              const row = {
                id: (index + 1).toString(),
                geographyId: item.geography_id,
                region: geo?.region || '',
                country: geo?.country || '',
                city: geo?.city || ''
              };
              console.log('Geography - Creating loaded row:', row);
              return row;
            });
            
            console.log('Geography - Setting loaded rows:', loadedRows);
            setSelectedRows(loadedRows);
            
            // Immediately notify parent with the loaded geography IDs
            const validGeographyIds = loadedRows
              .filter(row => row.geographyId !== null && row.geographyId !== undefined)
              .map(row => row.geographyId as number);
            
            console.log('Geography - Immediately notifying parent with loaded IDs:', validGeographyIds);
            onDataChange(validGeographyIds);
          } else {
            console.log('Geography - No existing data found, using default empty row');
            // Still notify parent with empty array for new quotes
            onDataChange([]);
          }
        }
      } catch (error) {
        console.error('Geography - Error in loadExistingData:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadExistingData();
  }, [isInitialized, onDataChange]);

  // Send data to parent whenever selectedRows changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const validGeographyIds = selectedRows
      .filter(row => {
        const isValid = row.geographyId !== null && row.geographyId !== undefined;
        console.log(`Geography - Row ${row.id} geography ID ${row.geographyId} is valid: ${isValid}`);
        return isValid;
      })
      .map(row => row.geographyId as number);
    
    console.log('Geography - selectedRows changed, sending to parent:', validGeographyIds);
    console.log('Geography - Current selectedRows:', selectedRows);
    
    // Always notify parent, even with empty array
    onDataChange(validGeographyIds);
  }, [selectedRows, onDataChange, isInitialized]);

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
            // Find the matching geography based on region, country, and city
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

  return {
    selectedRows,
    updateRow,
    addRows,
    removeRow,
    copyFirstRowToAll,
    getDuplicates,
    isDuplicate
  };
};
