
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Market, ResourceType, QuoteData } from '../types';

interface MarketResourcesSectionProps {
  quoteData: QuoteData;
  markets: Market[];
  resourceTypes: ResourceType[];
  selectedResourceTypes: number[];
  onMarketChange: (marketId: number) => void;
  onResourceTypeChange: (resourceTypeId: number, checked: boolean) => void;
}

export const MarketResourcesSection: React.FC<MarketResourcesSectionProps> = ({
  quoteData,
  markets,
  resourceTypes,
  selectedResourceTypes,
  onMarketChange,
  onResourceTypeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market & Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Market</Label>
          <Select 
            value={quoteData.market_id?.toString() || ''} 
            onValueChange={(value) => onMarketChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              {markets.map(market => (
                <SelectItem key={market.id} value={market.id.toString()}>{market.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Resource Categories</Label>
          <div className="space-y-2">
            {resourceTypes.map(rt => (
              <div key={rt.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`resource-${rt.id}`}
                  checked={selectedResourceTypes.includes(rt.id)}
                  onCheckedChange={(checked) => onResourceTypeChange(rt.id, checked as boolean)}
                />
                <Label htmlFor={`resource-${rt.id}`}>{rt.name}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
