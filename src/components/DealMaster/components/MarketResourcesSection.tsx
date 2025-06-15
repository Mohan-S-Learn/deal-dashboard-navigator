
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
  console.log('=== MarketResourcesSection Debug ===');
  console.log('quoteData.market_id:', quoteData?.market_id);
  console.log('markets array:', markets);
  console.log('resourceTypes array:', resourceTypes);
  console.log('selectedResourceTypes:', selectedResourceTypes);

  // Ensure we have valid arrays
  const safeMarkets = Array.isArray(markets) ? markets : [];
  const safeResourceTypes = Array.isArray(resourceTypes) ? resourceTypes : [];

  // Get the selected market
  const selectedMarket = safeMarkets.find(m => m.id === quoteData?.market_id);
  console.log('selectedMarket found:', selectedMarket);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market & Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Market</Label>
          <Select 
            value={quoteData?.market_id ? quoteData.market_id.toString() : undefined} 
            onValueChange={(value) => {
              console.log('Market selection changed to:', value);
              onMarketChange(parseInt(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select market">
                {selectedMarket ? selectedMarket.name : "Select market"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {safeMarkets.map(market => {
                console.log('Rendering market option:', market.id, market.name);
                return (
                  <SelectItem key={market.id} value={market.id.toString()}>
                    {market.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {safeMarkets.length === 0 && (
            <p className="text-sm text-red-500">No markets available</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Resource Categories</Label>
          <div className="space-y-2">
            {safeResourceTypes.map(rt => {
              const isChecked = selectedResourceTypes.includes(rt.id);
              console.log(`Resource type ${rt.id} (${rt.name}) checked:`, isChecked);
              return (
                <div key={rt.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`resource-${rt.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      console.log(`Resource type ${rt.id} changed to:`, checked);
                      onResourceTypeChange(rt.id, checked as boolean);
                    }}
                  />
                  <Label htmlFor={`resource-${rt.id}`} className="text-sm font-medium">
                    {rt.name}
                  </Label>
                </div>
              );
            })}
          </div>
          {safeResourceTypes.length === 0 && (
            <p className="text-sm text-red-500">No resource types available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
