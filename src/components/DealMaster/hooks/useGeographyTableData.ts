
import { useState, useEffect } from 'react';
import { Geography } from '../types';
import { GeographyRowData } from './types/geographyTableTypes';
import { loadExistingGeographyData } from '../services/geographyTableService';
import { findMatchingGeography, extractValidGeographyIds, getDuplicateGeographyIds } from '../utils/geographyMatching';

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
    const loadData = async () => {
      if (isInitialized) return;
      
      try {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');
        
        if (pathParts.length >= 4 && pathParts[1] === 'deal-master') {
          const dealId = pathParts[2];
          const quoteName = decodeURIComponent(pathParts[3]);
          
          const loadedRows = await loadExistingGeographyData(dealId, quoteName);
          
          if (loadedRows.length > 0) {
            console.log('Geography Hook - Setting loaded rows:', loadedRows);
            setSelectedRows(loadedRows);
            
            // Immediately notify parent with the loaded geography IDs
            const validGeographyIds = extractValidGeographyIds(loadedRows);
            console.log('Geography Hook - Immediately notifying parent with loaded IDs:', validGeographyIds);
            onDataChange(validGeographyIds);
          } else {
            console.log('Geography Hook - No existing data found, using default empty row');
            // Still notify parent with empty array for new quotes
            onDataChange([]);
          }
        }
      } catch (error) {
        console.error('Geography Hook - Error in loadData:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, [isInitialized, onDataChange]);

  // Send data to parent whenever selectedRows changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const validGeographyIds = extractValidGeographyIds(selectedRows);
    
    console.log('Geography Hook - selectedRows changed, sending to parent:', validGeographyIds);
    console.log('Geography Hook - Current selectedRows:', selectedRows);
    
    // Always notify parent, even with empty array
    onDataChange(validGeographyIds);
  }, [selectedRows, onDataChange, isInitialized]);

  const updateRow = (id: string, field: keyof GeographyRowData, value: string | number) => {
    console.log(`Geography Hook - Updating row ${id}, field ${field}, value:`, value);
    
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
            console.log('Geography Hook - Updated row with region:', updatedRow);
            return updatedRow;
          } else if (field === 'country') {
            const updatedRow = {
              ...row,
              country: value as string,
              city: '',
              geographyId: null
            };
            console.log('Geography Hook - Updated row with country:', updatedRow);
            return updatedRow;
          } else if (field === 'city') {
            // Find the matching geography based on region, country, and city
            const matchingGeo = findMatchingGeography(geographies, row.region, row.country, value as string);
            const updatedRow = {
              ...row,
              city: value as string,
              geographyId: matchingGeo ? matchingGeo.id : null
            };
            console.log('Geography Hook - Updated row with city:', updatedRow);
            console.log('Geography Hook - Matching geography found:', matchingGeo);
            return updatedRow;
          }
        }
        return row;
      });
      
      console.log('Geography Hook - All rows after update:', newRows);
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
    console.log('Geography Hook - Adding new rows:', newRows);
    setSelectedRows(prev => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    if (selectedRows.length > 1) {
      console.log('Geography Hook - Removing row:', id);
      setSelectedRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const copyFirstRowToAll = () => {
    if (selectedRows.length > 0) {
      const firstRow = selectedRows[0];
      console.log('Geography Hook - Copying first row to all:', firstRow);
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
    return getDuplicateGeographyIds(selectedRows);
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
