
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, AlertTriangle } from 'lucide-react';
import { ServiceCategory } from '../types';
import { AddRowsDialog } from './AddRowsDialog';
import { supabase } from '@/integrations/supabase/client';

interface ServiceCategoriesTableSectionProps {
  serviceCategories: ServiceCategory[];
  selectedCategories: any;
  onCategoryChange: (level: any, value: number | null) => void;
  onDataChange: (data: any[]) => void;
}

interface ServiceCategoryRowData {
  id: string;
  level1: number | null;
  level2: number | null;
  level3: number | null;
}

export const ServiceCategoriesTableSection: React.FC<ServiceCategoriesTableSectionProps> = ({
  serviceCategories,
  onDataChange
}) => {
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

  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

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

  const duplicates = getDuplicates();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Service Categories</CardTitle>
          <div className="flex gap-2">
            <Button onClick={copyFirstRowToAll} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy First Row to All
            </Button>
            <AddRowsDialog
              title="Add Service Category Rows"
              buttonText="Add Rows"
              onAddRows={addRows}
            />
          </div>
        </div>
        {duplicates.length > 0 && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Duplicate service categories detected. Please select different values.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Level 1</TableHead>
              <TableHead>Service Level 2</TableHead>
              <TableHead>Service Level 3</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryRows.map((row) => (
              <TableRow key={row.id} className={isDuplicate(row) ? 'bg-red-50' : ''}>
                <TableCell>
                  <Select 
                    value={row.level1?.toString() || ''} 
                    onValueChange={(value) => updateCategoryRow(row.id, 'level1', value)}
                  >
                    <SelectTrigger className={`w-full ${isDuplicate(row) ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {getFilteredCategories(1).map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select 
                    value={row.level2?.toString() || ''} 
                    onValueChange={(value) => updateCategoryRow(row.id, 'level2', value)}
                    disabled={!row.level1}
                  >
                    <SelectTrigger className={`w-full ${isDuplicate(row) ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select service subcategory" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {getFilteredCategories(2, row.level1).map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select 
                    value={row.level3?.toString() || ''} 
                    onValueChange={(value) => updateCategoryRow(row.id, 'level3', value)}
                    disabled={!row.level2}
                  >
                    <SelectTrigger className={`w-full ${isDuplicate(row) ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select specific service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {getFilteredCategories(3, row.level2).map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeRow(row.id)}
                    disabled={categoryRows.length === 1}
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
