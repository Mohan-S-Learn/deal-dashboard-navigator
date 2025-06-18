
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory } from '../../../DealMaster/types';
import { AddRevenueFormData } from '../hooks/useAddRevenueForm';

interface ServiceCategorySelectorProps {
  formData: AddRevenueFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddRevenueFormData>>;
  serviceCategories: ServiceCategory[];
}

export const ServiceCategorySelectors: React.FC<ServiceCategorySelectorProps> = ({
  formData,
  setFormData,
  serviceCategories
}) => {
  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

  const getResourceSkills = () => {
    console.log('Getting resource skills for parent ID:', formData.service_category_level_3_id);
    const skills = serviceCategories.filter(cat => 
      cat.level === 4 && 
      cat.parent_id === formData.service_category_level_3_id
    );
    console.log('Found resource skills:', skills);
    return skills;
  };

  const handleLevel3Change = (value: string) => {
    const id = parseInt(value);
    setFormData(prev => ({
      ...prev,
      service_category_level_3_id: id,
      service_category_level_4_id: null,
      cost_category_id: null
    }));
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Service Category Level 1</Label>
        <Select 
          value={formData.service_category_level_1_id?.toString() || ''} 
          onValueChange={(value) => {
            const id = parseInt(value);
            setFormData(prev => ({
              ...prev,
              service_category_level_1_id: id,
              service_category_level_2_id: null,
              service_category_level_3_id: null,
              service_category_level_4_id: null,
              cost_category_id: null
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Level 1" />
          </SelectTrigger>
          <SelectContent>
            {getFilteredCategories(1).map(cat => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Service Category Level 2</Label>
        <Select 
          value={formData.service_category_level_2_id?.toString() || ''} 
          onValueChange={(value) => {
            const id = parseInt(value);
            setFormData(prev => ({
              ...prev,
              service_category_level_2_id: id,
              service_category_level_3_id: null,
              service_category_level_4_id: null,
              cost_category_id: null
            }));
          }}
          disabled={!formData.service_category_level_1_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Level 2" />
          </SelectTrigger>
          <SelectContent>
            {getFilteredCategories(2, formData.service_category_level_1_id).map(cat => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Service Category Level 3</Label>
        <Select 
          value={formData.service_category_level_3_id?.toString() || ''} 
          onValueChange={handleLevel3Change}
          disabled={!formData.service_category_level_2_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Level 3" />
          </SelectTrigger>
          <SelectContent>
            {getFilteredCategories(3, formData.service_category_level_2_id).map(cat => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Resource Skill (Level 4)</Label>
        <Select 
          value={formData.service_category_level_4_id?.toString() || ''} 
          onValueChange={(value) => {
            setFormData(prev => ({ ...prev, service_category_level_4_id: parseInt(value) }));
          }}
          disabled={!formData.service_category_level_3_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Resource Skill" />
          </SelectTrigger>
          <SelectContent>
            {getResourceSkills().map(skill => (
              <SelectItem key={skill.id} value={skill.id.toString()}>{skill.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
