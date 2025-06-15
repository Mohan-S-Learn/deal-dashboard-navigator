
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { ServiceCategory } from '../types';

interface ServiceCategoryRowData {
  id: string;
  level1: number | null;
  level2: number | null;
  level3: number | null;
}

interface ServiceCategoryRowProps {
  row: ServiceCategoryRowData;
  serviceCategories: ServiceCategory[];
  isDuplicate: boolean;
  canRemove: boolean;
  onUpdate: (id: string, level: keyof Omit<ServiceCategoryRowData, 'id'>, value: string) => void;
  onRemove: (id: string) => void;
}

export const ServiceCategoryRow: React.FC<ServiceCategoryRowProps> = ({
  row,
  serviceCategories,
  isDuplicate,
  canRemove,
  onUpdate,
  onRemove
}) => {
  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

  return (
    <TableRow className={isDuplicate ? 'bg-red-50' : ''}>
      <TableCell>
        <Select 
          value={row.level1?.toString() || ''} 
          onValueChange={(value) => onUpdate(row.id, 'level1', value)}
        >
          <SelectTrigger className={`w-full ${isDuplicate ? 'border-red-500' : ''}`}>
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
          onValueChange={(value) => onUpdate(row.id, 'level2', value)}
          disabled={!row.level1}
        >
          <SelectTrigger className={`w-full ${isDuplicate ? 'border-red-500' : ''}`}>
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
          onValueChange={(value) => onUpdate(row.id, 'level3', value)}
          disabled={!row.level2}
        >
          <SelectTrigger className={`w-full ${isDuplicate ? 'border-red-500' : ''}`}>
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
          onClick={() => onRemove(row.id)}
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
