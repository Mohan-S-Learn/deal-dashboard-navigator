
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { VolumeDiscountRange } from '../types';
import { AddRowsDialog } from './AddRowsDialog';

interface VolumeDiscountsSectionProps {
  volumeDiscounts: VolumeDiscountRange[];
  onAddVolumeDiscount: () => void;
  onRemoveVolumeDiscount: (index: number) => void;
  onUpdateVolumeDiscount: (index: number, field: keyof VolumeDiscountRange, value: number) => void;
}

export const VolumeDiscountsSection: React.FC<VolumeDiscountsSectionProps> = ({
  volumeDiscounts,
  onAddVolumeDiscount,
  onRemoveVolumeDiscount,
  onUpdateVolumeDiscount
}) => {
  const addMultipleRows = (count: number) => {
    for (let i = 0; i < count; i++) {
      onAddVolumeDiscount();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Volume Discounts</CardTitle>
          <AddRowsDialog
            title="Add Volume Discount Rows"
            buttonText="Add Rows"
            onAddRows={addMultipleRows}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {volumeDiscounts.map((discount, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="flex-1">
                <Label>Range Start ($)</Label>
                <Input 
                  type="number" 
                  value={discount.range_start} 
                  onChange={(e) => onUpdateVolumeDiscount(index, 'range_start', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex-1">
                <Label>Range End ($)</Label>
                <Input 
                  type="number" 
                  value={discount.range_end || ''} 
                  onChange={(e) => onUpdateVolumeDiscount(index, 'range_end', parseFloat(e.target.value) || 0)}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="flex-1">
                <Label>Discount (%)</Label>
                <Input 
                  type="number" 
                  value={discount.discount_percent} 
                  onChange={(e) => onUpdateVolumeDiscount(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                  max="100"
                  step="0.01"
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onRemoveVolumeDiscount(index)}
                className="mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {volumeDiscounts.length === 0 && (
            <p className="text-gray-500 text-center py-8">No volume discount ranges defined</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
