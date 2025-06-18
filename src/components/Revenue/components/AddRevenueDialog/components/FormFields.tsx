
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CostCategory } from '../../../types';
import { Geography } from '../../../../DealMaster/types';
import { AddRevenueFormData } from '../hooks/useAddRevenueForm';

interface FormFieldsProps {
  formData: AddRevenueFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddRevenueFormData>>;
  costCategories: CostCategory[];
  geographies: Geography[];
  selectedGeographies: number[];
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  setFormData,
  costCategories,
  geographies,
  selectedGeographies
}) => {
  const getAvailableGeographies = () => {
    return geographies.filter(geo => selectedGeographies.includes(geo.id));
  };

  const getFilteredCostCategories = () => {
    return costCategories.filter(cc => 
      !cc.service_category_level_3_id || 
      cc.service_category_level_3_id === formData.service_category_level_3_id
    );
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Experience (Years)</Label>
        <Input
          type="number"
          min="0"
          value={formData.experience_years}
          onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Cost Category</Label>
        <Select 
          value={formData.cost_category_id?.toString() || ''} 
          onValueChange={(value) => {
            setFormData(prev => ({ ...prev, cost_category_id: parseInt(value) }));
          }}
          disabled={!formData.service_category_level_3_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Cost Category" />
          </SelectTrigger>
          <SelectContent>
            {getFilteredCostCategories().map(cat => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Geography</Label>
        <Select 
          value={formData.geography_id?.toString() || ''} 
          onValueChange={(value) => {
            setFormData(prev => ({ ...prev, geography_id: parseInt(value) }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Geography" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableGeographies().map(geo => (
              <SelectItem key={geo.id} value={geo.id.toString()}>
                {geo.city}, {geo.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Benchmark Rate ($/hr)</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.benchmark_rate_usd_per_hour}
          onChange={(e) => setFormData(prev => ({ ...prev, benchmark_rate_usd_per_hour: parseFloat(e.target.value) || 0 }))}
        />
      </div>

      <div className="space-y-2">
        <Label>C&B Cost ($/hr)</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.cb_cost_usd_per_hour}
          onChange={(e) => setFormData(prev => ({ ...prev, cb_cost_usd_per_hour: parseFloat(e.target.value) || 0 }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Margin %</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.margin_percent}
          onChange={(e) => setFormData(prev => ({ ...prev, margin_percent: parseFloat(e.target.value) || 0 }))}
        />
      </div>
    </>
  );
};
