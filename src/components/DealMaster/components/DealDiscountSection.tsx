
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuoteData } from '../types';

interface DealDiscountSectionProps {
  quoteData: QuoteData;
  onNumberChange: (field: keyof QuoteData, value: string) => void;
}

export const DealDiscountSection: React.FC<DealDiscountSectionProps> = ({
  quoteData,
  onNumberChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Discount</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Discount Amount ($)</Label>
          <Input 
            type="number" 
            value={quoteData.deal_discount_amount || ''} 
            onChange={(e) => onNumberChange('deal_discount_amount', e.target.value)}
            placeholder="Enter discount amount"
          />
        </div>
        <div className="space-y-2">
          <Label>Discount Percent (%)</Label>
          <Input 
            type="number" 
            value={quoteData.deal_discount_percent || ''} 
            onChange={(e) => onNumberChange('deal_discount_percent', e.target.value)}
            placeholder="Enter discount percentage"
            max="100"
            step="0.01"
          />
        </div>
      </CardContent>
    </Card>
  );
};
