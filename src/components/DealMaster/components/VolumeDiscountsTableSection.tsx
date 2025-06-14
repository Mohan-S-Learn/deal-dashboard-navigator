
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Copy, AlertTriangle } from 'lucide-react';
import { VolumeDiscountRange } from '../types';
import { AddRowsDialog } from './AddRowsDialog';

interface VolumeDiscountsTableSectionProps {
  volumeDiscounts: VolumeDiscountRange[];
  onAddVolumeDiscount: () => void;
  onRemoveVolumeDiscount: (index: number) => void;
  onUpdateVolumeDiscount: (index: number, field: keyof VolumeDiscountRange, value: number) => void;
}

export const VolumeDiscountsTableSection: React.FC<VolumeDiscountsTableSectionProps> = ({
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

  const copyFirstRowToAll = () => {
    if (volumeDiscounts.length > 0) {
      const firstRow = volumeDiscounts[0];
      volumeDiscounts.forEach((_, index) => {
        if (index > 0) {
          onUpdateVolumeDiscount(index, 'range_start', firstRow.range_start);
          onUpdateVolumeDiscount(index, 'range_end', firstRow.range_end || 0);
          onUpdateVolumeDiscount(index, 'discount_percent', firstRow.discount_percent);
        }
      });
    }
  };

  const getDuplicateRanges = () => {
    const rangeCount: Record<string, number> = {};
    volumeDiscounts.forEach(discount => {
      const key = `${discount.range_start}-${discount.range_end || 'unlimited'}-${discount.discount_percent}`;
      rangeCount[key] = (rangeCount[key] || 0) + 1;
    });
    return Object.keys(rangeCount).filter(key => rangeCount[key] > 1);
  };

  const isDuplicateRange = (discount: VolumeDiscountRange) => {
    const key = `${discount.range_start}-${discount.range_end || 'unlimited'}-${discount.discount_percent}`;
    return getDuplicateRanges().includes(key);
  };

  const duplicates = getDuplicateRanges();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Volume Discounts</CardTitle>
          <div className="flex gap-2">
            <Button onClick={copyFirstRowToAll} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy First Row to All
            </Button>
            <AddRowsDialog
              title="Add Volume Discount Rows"
              buttonText="Add Rows"
              onAddRows={addMultipleRows}
            />
          </div>
        </div>
        {duplicates.length > 0 && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Duplicate discount ranges detected. Please adjust values.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Range Start ($)</TableHead>
              <TableHead>Range End ($)</TableHead>
              <TableHead>Discount (%)</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volumeDiscounts.map((discount, index) => (
              <TableRow key={index} className={isDuplicateRange(discount) ? 'bg-red-50' : ''}>
                <TableCell>
                  <Input 
                    type="number" 
                    value={discount.range_start} 
                    onChange={(e) => onUpdateVolumeDiscount(index, 'range_start', parseFloat(e.target.value) || 0)}
                    className={isDuplicateRange(discount) ? 'border-red-500' : ''}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={discount.range_end || ''} 
                    onChange={(e) => onUpdateVolumeDiscount(index, 'range_end', parseFloat(e.target.value) || 0)}
                    placeholder="Leave empty for unlimited"
                    className={isDuplicateRange(discount) ? 'border-red-500' : ''}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={discount.discount_percent} 
                    onChange={(e) => onUpdateVolumeDiscount(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                    max="100"
                    step="0.01"
                    className={isDuplicateRange(discount) ? 'border-red-500' : ''}
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onRemoveVolumeDiscount(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {volumeDiscounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No volume discount ranges defined
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
