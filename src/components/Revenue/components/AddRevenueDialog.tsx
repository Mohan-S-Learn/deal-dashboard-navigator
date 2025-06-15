
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { QuoteRevenue, ResourceSkill, CostCategory } from '../types';
import { ServiceCategory, Geography } from '../../DealMaster/types';

interface AddRevenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (revenue: Omit<QuoteRevenue, 'id'>) => void;
  dealId: string;
  quoteName: string;
  resourceSkills: ResourceSkill[];
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
  resourceSkills,
  costCategories,
  serviceCategories,
  geographies,
  selectedGeographies
}) => {
  const [formData, setFormData] = useState({
    service_category_level_1_id: '',
    service_category_level_2_id: '',
    service_category_level_3_id: '',
    resource_skill_id: '',
    experience_years: '',
    cost_category_id: '',
    geography_id: '',
    benchmark_rate_usd_per_hour: '',
    cb_cost_usd_per_hour: '',
    margin_percent: ''
  });

  const level1Categories = serviceCategories.filter(sc => sc.level === 1);
  const level2Categories = serviceCategories.filter(sc => sc.level === 2 && sc.parent_id === parseInt(formData.service_category_level_1_id));
  const level3Categories = serviceCategories.filter(sc => sc.level === 3 && sc.parent_id === parseInt(formData.service_category_level_2_id));
  const availableGeographies = geographies.filter(g => selectedGeographies.includes(g.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const revenue: Omit<QuoteRevenue, 'id'> = {
      Deal_Id: dealId,
      Quote_Name: quoteName,
      service_category_level_1_id: formData.service_category_level_1_id ? parseInt(formData.service_category_level_1_id) : undefined,
      service_category_level_2_id: formData.service_category_level_2_id ? parseInt(formData.service_category_level_2_id) : undefined,
      service_category_level_3_id: formData.service_category_level_3_id ? parseInt(formData.service_category_level_3_id) : undefined,
      resource_skill_id: parseInt(formData.resource_skill_id),
      experience_years: parseInt(formData.experience_years),
      cost_category_id: formData.cost_category_id ? parseInt(formData.cost_category_id) : undefined,
      geography_id: formData.geography_id ? parseInt(formData.geography_id) : undefined,
      benchmark_rate_usd_per_hour: formData.benchmark_rate_usd_per_hour ? parseFloat(formData.benchmark_rate_usd_per_hour) : undefined,
      cb_cost_usd_per_hour: formData.cb_cost_usd_per_hour ? parseFloat(formData.cb_cost_usd_per_hour) : undefined,
      margin_percent: formData.margin_percent ? parseFloat(formData.margin_percent) : undefined,
      is_benchmark_rate_overridden: false,
      is_cb_cost_overridden: false
    };

    onAdd(revenue);
    setFormData({
      service_category_level_1_id: '',
      service_category_level_2_id: '',
      service_category_level_3_id: '',
      resource_skill_id: '',
      experience_years: '',
      cost_category_id: '',
      geography_id: '',
      benchmark_rate_usd_per_hour: '',
      cb_cost_usd_per_hour: '',
      margin_percent: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Revenue Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level1">Service Category Level 1</Label>
              <Select value={formData.service_category_level_1_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_category_level_1_id: value, service_category_level_2_id: '', service_category_level_3_id: '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level 1" />
                </SelectTrigger>
                <SelectContent>
                  {level1Categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level2">Service Category Level 2</Label>
              <Select value={formData.service_category_level_2_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_category_level_2_id: value, service_category_level_3_id: '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level 2" />
                </SelectTrigger>
                <SelectContent>
                  {level2Categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level3">Service Category Level 3</Label>
              <Select value={formData.service_category_level_3_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_category_level_3_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level 3" />
                </SelectTrigger>
                <SelectContent>
                  {level3Categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resource_skill">Resource Skill</Label>
              <Select value={formData.resource_skill_id} onValueChange={(value) => setFormData(prev => ({ ...prev, resource_skill_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Resource Skill" />
                </SelectTrigger>
                <SelectContent>
                  {resourceSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id.toString()}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience_years">Experience (Years)</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="cost_category">Cost Category</Label>
              <Select value={formData.cost_category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cost_category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Cost Category" />
                </SelectTrigger>
                <SelectContent>
                  {costCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="geography">Geography</Label>
              <Select value={formData.geography_id} onValueChange={(value) => setFormData(prev => ({ ...prev, geography_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Geography" />
                </SelectTrigger>
                <SelectContent>
                  {availableGeographies.map((geo) => (
                    <SelectItem key={geo.id} value={geo.id.toString()}>
                      {geo.city}, {geo.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="benchmark_rate">Benchmark Rate ($/hr)</Label>
              <Input
                id="benchmark_rate"
                type="number"
                step="0.01"
                value={formData.benchmark_rate_usd_per_hour}
                onChange={(e) => setFormData(prev => ({ ...prev, benchmark_rate_usd_per_hour: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="cb_cost">C&B Cost ($/hr)</Label>
              <Input
                id="cb_cost"
                type="number"
                step="0.01"
                value={formData.cb_cost_usd_per_hour}
                onChange={(e) => setFormData(prev => ({ ...prev, cb_cost_usd_per_hour: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="margin_percent">Margin %</Label>
              <Input
                id="margin_percent"
                type="number"
                step="0.01"
                value={formData.margin_percent}
                onChange={(e) => setFormData(prev => ({ ...prev, margin_percent: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Revenue Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
