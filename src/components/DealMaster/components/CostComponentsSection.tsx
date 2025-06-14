
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuoteData } from '../types';

interface CostComponentsSectionProps {
  quoteData: QuoteData;
  onNumberChange: (field: keyof QuoteData, value: string) => void;
}

export const CostComponentsSection: React.FC<CostComponentsSectionProps> = ({
  quoteData,
  onNumberChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Components (% of Revenue)</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Travel (%)</Label>
          <Input 
            type="number" 
            value={quoteData.travel_percent || ''} 
            onChange={(e) => onNumberChange('travel_percent', e.target.value)}
            placeholder="0.00"
            max="100"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Training (%)</Label>
          <Input 
            type="number" 
            value={quoteData.training_percent || ''} 
            onChange={(e) => onNumberChange('training_percent', e.target.value)}
            placeholder="0.00"
            max="100"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Other Costs (%)</Label>
          <Input 
            type="number" 
            value={quoteData.other_costs_percent || ''} 
            onChange={(e) => onNumberChange('other_costs_percent', e.target.value)}
            placeholder="0.00"
            max="100"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Infrastructure (%)</Label>
          <Input 
            type="number" 
            value={quoteData.infrastructure_percent || ''} 
            onChange={(e) => onNumberChange('infrastructure_percent', e.target.value)}
            placeholder="0.00"
            max="100"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Compliance (%)</Label>
          <Input 
            type="number" 
            value={quoteData.compliance_percent || ''} 
            onChange={(e) => onNumberChange('compliance_percent', e.target.value)}
            placeholder="0.00"
            max="100"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Licenses (%)</Label>
          <Input 
            type="number" 
            value={quoteData.licenses_percent || ''} 
            onChange={(e) => onNumberChange('licenses_percent', e.target.value)}
            placeholder="0.00"
            max="100"
            step="0.01"
          />
        </div>
      </CardContent>
    </Card>
  );
};
