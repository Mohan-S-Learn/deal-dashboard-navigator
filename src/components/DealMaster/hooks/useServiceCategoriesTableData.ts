
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceCategoryRowData {
  id: string;
  level1: number | null;
  level2: number | null;
  level3: number | null;
}

export const useServiceCategoriesTableData = (onDataChange: (data: any[]) => void) => {
  const [categoryRows, setCategoryRows] = useState<ServiceCategoryRowData[]>([
    { id: '1', level1: null, level2: null, level3: null }
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
          
          console.log('ServiceCategories - Loading existing data for:', { dealId, quoteName });
          
          const { data: existingCategories, error } = await supabase
            .from('QuoteServiceCategory')
            .select('*')
            .eq('Deal_Id', dealId)
            .eq('Quote_Name', quoteName);

          if (error) {
            console.error('ServiceCategories - Error loading existing data:', error);
          } else if (existingCategories && existingCategories.length > 0) {
            console.log('ServiceCategories - Found existing data:', existingCategories);
            
            const loadedRows = existingCategories.map((cat, index) => ({
              id: (index + 1).toString(),
              level1: cat.category_level_1_id,
              level2: cat.category_level_2_id,
              level3: cat.category_level_3_id
            }));
            
            setCategoryRows(loadedRows);
            console.log('ServiceCategories - Set loaded rows:', loadedRows);
          }
        }
      } catch (error) {
        console.error('ServiceCategories - Error in loadExistingData:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadExistingData();
  }, [isInitialized]);

  // Send data to parent whenever it changes
  useEffect(() => {
    console.log('ServiceCategories - Data change detected');
    console.log('ServiceCategories - sending data to parent:', categoryRows);
    onDataChange(categoryRows);
  }, [categoryRows, onDataChange]);

  const updateCategoryRow = (id: string, level: keyof Omit<ServiceCategoryRowData, 'id'>, value: string) => {
    console.log(`ServiceCategories - Updating row ${id}, level ${level}, value:`, value);
    
    const numValue = value && value !== '' ? parseInt(value, 10) : null;
    
    setCategoryRows(prev => {
      const newRows = prev.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [level]: numValue };
          
          // Reset child categories when parent changes
          if (level === 'level1') {
            updatedRow.level2 = null;
            updatedRow.level3 = null;
          } else if (level === 'level2') {
            updatedRow.level3 = null;
          }
          
          console.log(`ServiceCategories - Updated row result:`, updatedRow);
          return updatedRow;
        }
        return row;
      });
      
      console.log('ServiceCategories - All rows after update:', newRows);
      return newRows;
    });
  };

  const addRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) => ({
      id: Date.now().toString() + i,
      level1: null,
      level2: null,
      level3: null
    }));
    console.log('ServiceCategories - Adding new rows:', newRows);
    setCategoryRows(prev => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    if (categoryRows.length > 1) {
      console.log('ServiceCategories - Removing row:', id);
      setCategoryRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const copyFirstRowToAll = () => {
    if (categoryRows.length > 0) {
      const firstRow = categoryRows[0];
      console.log('ServiceCategories - Copying first row to all:', firstRow);
      setCategoryRows(prev => prev.map((row, index) => 
        index === 0 ? row : {
          ...row,
          level1: firstRow.level1,
          level2: firstRow.level2,
          level3: firstRow.level3
        }
      ));
    }
  };

  const getDuplicates = () => {
    const categoryCount: Record<string, number> = {};
    categoryRows.forEach(row => {
      if (row.level1 && row.level2 && row.level3) {
        const key = `${row.level1}-${row.level2}-${row.level3}`;
        categoryCount[key] = (categoryCount[key] || 0) + 1;
      }
    });
    return Object.keys(categoryCount).filter(key => categoryCount[key] > 1);
  };

  const isDuplicate = (row: ServiceCategoryRowData) => {
    if (!row.level1 || !row.level2 || !row.level3) return false;
    const key = `${row.level1}-${row.level2}-${row.level3}`;
    return getDuplicates().includes(key);
  };

  return {
    categoryRows,
    updateCategoryRow,
    addRows,
    removeRow,
    copyFirstRowToAll,
    getDuplicates,
    isDuplicate
  };
};
