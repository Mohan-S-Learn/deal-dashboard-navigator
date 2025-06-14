
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory, SelectedCategories } from '../types';

interface ServiceCategoriesSectionProps {
  serviceCategories: ServiceCategory[];
  selectedCategories: SelectedCategories;
  onCategoryChange: (level: keyof SelectedCategories, value: number | null) => void;
}

export const ServiceCategoriesSection: React.FC<ServiceCategoriesSectionProps> = ({
  serviceCategories,
  selectedCategories,
  onCategoryChange
}) => {
  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Categories</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Service Level 1</Label>
          <Select 
            value={selectedCategories.level1?.toString() || ''} 
            onValueChange={(value) => onCategoryChange('level1', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
              {getFilteredCategories(1).map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Service Level 2</Label>
          <Select 
            value={selectedCategories.level2?.toString() || ''} 
            onValueChange={(value) => onCategoryChange('level2', parseInt(value))}
            disabled={!selectedCategories.level1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service subcategory" />
            </SelectTrigger>
            <SelectContent>
              {getFilteredCategories(2, selectedCategories.level1).map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Service Level 3</Label>
          <Select 
            value={selectedCategories.level3?.toString() || ''} 
            onValueChange={(value) => onCategoryChange('level3', parseInt(value))}
            disabled={!selectedCategories.level2}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select specific service" />
            </SelectTrigger>
            <SelectContent>
              {getFilteredCategories(3, selectedCategories.level2).map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
