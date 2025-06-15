
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { QuoteResourceEffort, EffortInputMode } from '../types';
import { CostCategory } from '../../Revenue/types';
import { ServiceCategory } from '../../DealMaster/types';

interface AddResourceEffortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (effort: Omit<QuoteResourceEffort, 'id'>) => void;
  dealId: string;
  quoteName: string;
  costCategories: CostCategory[];
  serviceCategories: ServiceCategory[];
  inputMode: EffortInputMode;
}

export const AddResourceEffortDialog: React.FC<AddResourceEffortDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
  dealId,
  quoteName,
  costCategories,
  serviceCategories,
  inputMode
}) => {
  const [formData, setFormData] = useState({
    service_category_level_1_id: '',
    service_category_level_2_id: '',
    service_category_level_3_id: '',
    service_category_level_4_id: '',
    experience_years: '',
    cost_category_id: '',
    effort_year: '',
    effort_month: '1',
    hours_allocated: ''
  });

  const level1Categories = serviceCategories.filter(sc => sc.level === 1);
  const level2Categories = serviceCategories.filter(sc => 
    sc.level === 2 && 
    sc.parent_id === parseInt(formData.service_category_level_1_id)
  );
  const level3Categories = serviceCategories.filter(sc => 
    sc.level === 3 && 
    sc.parent_id === parseInt(formData.service_category_level_2_id)
  );
  const level4Categories = serviceCategories.filter(sc => 
    sc.level === 4 && 
    sc.parent_id === parseInt(formData.service_category_level_3_id)
  );

  // Filter cost categories based on service category level 3
  const filteredCostCategories = costCategories.filter(cc => 
    !cc.service_category_level_3_id || 
    cc.service_category_level_3_id === parseInt(formData.service_category_level_3_id)
  );

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMode === 'year') {
      // Create 12 entries (one for each month) with distributed hours
      const hoursPerMonth = parseFloat(formData.hours_allocated) / 12;
      for (let month = 1; month <= 12; month++) {
        const effort: Omit<QuoteResourceEffort, 'id'> = {
          Deal_Id: dealId,
          Quote_Name: quoteName,
          service_category_level_1_id: formData.service_category_level_1_id ? parseInt(formData.service_category_level_1_id) : undefined,
          service_category_level_2_id: formData.service_category_level_2_id ? parseInt(formData.service_category_level_2_id) : undefined,
          service_category_level_3_id: formData.service_category_level_3_id ? parseInt(formData.service_category_level_3_id) : undefined,
          service_category_level_4_id: parseInt(formData.service_category_level_4_id),
          experience_years: parseInt(formData.experience_years),
          cost_category_id: formData.cost_category_id ? parseInt(formData.cost_category_id) : undefined,
          effort_year: parseInt(formData.effort_year),
          effort_month: month,
          hours_allocated: hoursPerMonth
        };
        onAdd(effort);
      }
    } else {
      // Create single monthly entry
      const effort: Omit<QuoteResourceEffort, 'id'> = {
        Deal_Id: dealId,
        Quote_Name: quoteName,
        service_category_level_1_id: formData.service_category_level_1_id ? parseInt(formData.service_category_level_1_id) : undefined,
        service_category_level_2_id: formData.service_category_level_2_id ? parseInt(formData.service_category_level_2_id) : undefined,
        service_category_level_3_id: formData.service_category_level_3_id ? parseInt(formData.service_category_level_3_id) : undefined,
        service_category_level_4_id: parseInt(formData.service_category_level_4_id),
        experience_years: parseInt(formData.experience_years),
        cost_category_id: formData.cost_category_id ? parseInt(formData.cost_category_id) : undefined,
        effort_year: parseInt(formData.effort_year),
        effort_month: parseInt(formData.effort_month),
        hours_allocated: parseFloat(formData.hours_allocated)
      };
      onAdd(effort);
    }

    setFormData({
      service_category_level_1_id: '',
      service_category_level_2_id: '',
      service_category_level_3_id: '',
      service_category_level_4_id: '',
      experience_years: '',
      cost_category_id: '',
      effort_year: '',
      effort_month: '1',
      hours_allocated: ''
    });
  };

  const handleLevel3Change = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      service_category_level_3_id: value, 
      service_category_level_4_id: '',
      cost_category_id: '' // Reset cost category when level 3 changes
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Resource Effort ({inputMode === 'year' ? 'By Year' : 'By Month'})</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level1">Service Category Level 1</Label>
              <Select value={formData.service_category_level_1_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_category_level_1_id: value, service_category_level_2_id: '', service_category_level_3_id: '', service_category_level_4_id: '', cost_category_id: '' }))}>
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
              <Select value={formData.service_category_level_2_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_category_level_2_id: value, service_category_level_3_id: '', service_category_level_4_id: '', cost_category_id: '' }))}>
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
              <Select value={formData.service_category_level_3_id} onValueChange={handleLevel3Change}>
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
              <Label htmlFor="level4">Resource Skill (Level 4)</Label>
              <Select 
                value={formData.service_category_level_4_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_category_level_4_id: value }))}
                disabled={!formData.service_category_level_3_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Resource Skill" />
                </SelectTrigger>
                <SelectContent>
                  {level4Categories.map((skill) => (
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
              <Select 
                value={formData.cost_category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, cost_category_id: value }))}
                disabled={!formData.service_category_level_3_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Cost Category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCostCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effort_year">Year</Label>
              <Input
                id="effort_year"
                type="number"
                value={formData.effort_year}
                onChange={(e) => setFormData(prev => ({ ...prev, effort_year: e.target.value }))}
                required
              />
            </div>

            {inputMode === 'month' && (
              <div>
                <Label htmlFor="effort_month">Month</Label>
                <Select value={formData.effort_month} onValueChange={(value) => setFormData(prev => ({ ...prev, effort_month: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="hours_allocated">
                Hours Allocated {inputMode === 'year' ? '(Per Year)' : '(Per Month)'}
              </Label>
              <Input
                id="hours_allocated"
                type="number"
                step="0.01"
                value={formData.hours_allocated}
                onChange={(e) => setFormData(prev => ({ ...prev, hours_allocated: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Resource Effort</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
