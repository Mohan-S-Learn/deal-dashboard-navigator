import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteRevenue, CostCategory } from '../types';
import { ServiceCategory, Geography } from '../../DealMaster/types';

interface AddRevenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (revenue: Omit<QuoteRevenue, 'id'>) => void;
  dealId: string;
  quoteName: string;
  costCategories: CostCategory[];
  serviceCategories: ServiceCategory[];
  geographies: Geography[];
  selectedGeographies: number[];
}

export const AddRevenueDialog: React.FC<AddRevenueDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
  dealId,
  quoteName,
  costCategories,
  serviceCategories,
  geographies,
  selectedGeographies
}) => {
  const [formData, setFormData] = useState({
    service_category_level_1_id: null as number | null,
    service_category_level_2_id: null as number | null,
    service_category_level_3_id: null as number | null,
    service_category_level_4_id: null as number | null,
    experience_years: 1,
    cost_category_id: null as number | null,
    geography_id: null as number | null,
    benchmark_rate_usd_per_hour: 0,
    cb_cost_usd_per_hour: 0,
    margin_percent: 0,
  });

  const getFilteredCategories = (level: number, parentId?: number | null) => {
    return serviceCategories.filter(cat => 
      cat.level === level && 
      (level === 1 ? cat.parent_id === null : cat.parent_id === parentId)
    );
  };

  const getResourceSkills = () => {
    return serviceCategories.filter(cat => 
      cat.level === 4 && 
      cat.parent_id === formData.service_category_level_3_id
    );
  };

  const getAvailableGeographies = () => {
    return geographies.filter(geo => selectedGeographies.includes(geo.id));
  };

  // Filter cost categories based on service category level 3
  const getFilteredCostCategories = () => {
    return costCategories.filter(cc => 
      !cc.service_category_level_3_id || 
      cc.service_category_level_3_id === formData.service_category_level_3_id
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service_category_level_4_id) {
      alert('Please select a resource skill');
      return;
    }

    onAdd({
      Deal_Id: dealId,
      Quote_Name: quoteName,
      service_category_level_1_id: formData.service_category_level_1_id,
      service_category_level_2_id: formData.service_category_level_2_id,
      service_category_level_3_id: formData.service_category_level_3_id,
      service_category_level_4_id: formData.service_category_level_4_id,
      experience_years: formData.experience_years,
      cost_category_id: formData.cost_category_id,
      geography_id: formData.geography_id,
      benchmark_rate_usd_per_hour: formData.benchmark_rate_usd_per_hour,
      cb_cost_usd_per_hour: formData.cb_cost_usd_per_hour,
      margin_percent: formData.margin_percent,
    });

    setFormData({
      service_category_level_1_id: null,
      service_category_level_2_id: null,
      service_category_level_3_id: null,
      service_category_level_4_id: null,
      experience_years: 1,
      cost_category_id: null,
      geography_id: null,
      benchmark_rate_usd_per_hour: 0,
      cb_cost_usd_per_hour: 0,
      margin_percent: 0,
    });
  };

  const handleLevel3Change = (value: string) => {
    const id = parseInt(value);
    setFormData(prev => ({
      ...prev,
      service_category_level_3_id: id,
      service_category_level_4_id: null,
      cost_category_id: null // Reset cost category when level 3 changes
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Revenue Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Revenue Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
