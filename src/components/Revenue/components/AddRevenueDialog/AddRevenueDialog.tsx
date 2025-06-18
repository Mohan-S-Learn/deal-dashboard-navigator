
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QuoteRevenue, CostCategory } from '../../types';
import { ServiceCategory, Geography } from '../../../DealMaster/types';
import { useAddRevenueForm } from './hooks/useAddRevenueForm';
import { ServiceCategorySelectors } from './components/ServiceCategorySelectors';
import { FormFields } from './components/FormFields';

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
  const { formData, setFormData, resetForm } = useAddRevenueForm(costCategories);

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

    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Revenue Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ServiceCategorySelectors
              formData={formData}
              setFormData={setFormData}
              serviceCategories={serviceCategories}
            />

            <FormFields
              formData={formData}
              setFormData={setFormData}
              costCategories={costCategories}
              geographies={geographies}
              selectedGeographies={selectedGeographies}
            />
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
