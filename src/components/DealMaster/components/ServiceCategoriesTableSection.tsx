
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, AlertTriangle } from 'lucide-react';
import { ServiceCategory, SelectedCategories } from '../types';
import { AddRowsDialog } from './AddRowsDialog';

interface ServiceCategoriesTableSectionProps {
  serviceCategories: ServiceCategory[];
  selectedCategories: SelectedCategories;
  onCategoryChange: (level: keyof SelectedCategories, value: number | null) => void;
}

interface ServiceCategoryRow {
  id: string;
  level1: number | null;
  level2: number | null;
  level3: number | null;
}

export const ServiceCategoriesTableSection: React.FC<ServiceCategoriesTableSectionProps> = ({
  serviceCategories
}) => {
  const [categoryRows, setCategoryRows] = useState<ServiceCategoryRow[]>([
    { id: '1', level1: null, level2: null, level3: null }
  ]);

  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

  const updateCategoryRow = (id: string, level: keyof Omit<ServiceCategoryRow, 'id'>, value: number | null) => {
    setCategoryRows(prev => prev.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [level]: value };
        
        // Reset child categories when parent changes
        if (level === 'level1') {
          updatedRow.level2 = null;
          updatedRow.level3 = null;
        } else if (level === 'level2') {
          updatedRow.level3 = null;
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  const addRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) => ({
      id: Date.now().toString() + i,
      level1: null,
      level2: null,
      level3: null
    }));
    setCategoryRows(prev => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    if (categoryRows.length > 1) {
      setCategoryRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const copyFirstRowToAll = () => {
    if (categoryRows.length > 0) {
      const firstRow = categoryRows[0];
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

  const isDuplicate = (row: ServiceCategoryRow) => {
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
            {categoryRows.map((row, index) => (
              <TableRow key={row.id} className={isDuplicate(row) ? 'bg-red-50' : ''}>
                <TableCell>
                  <Select 
                    value={row.level1?.toString() || ''} 
                    onValueChange={(value) => updateCategoryRow(row.id, 'level1', parseInt(value))}
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
                    onValueChange={(value) => updateCategoryRow(row.id, 'level2', parseInt(value))}
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
                    onValueChange={(value) => updateCategoryRow(row.id, 'level3', parseInt(value))}
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
