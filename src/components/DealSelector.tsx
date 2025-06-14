
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDeals, formatCurrency, getStatusColor } from './dealData';

interface DealSelectorProps {
  selectedDealId: string;
  onDealSelect: (dealId: string) => void;
}

const DealSelector: React.FC<DealSelectorProps> = ({ selectedDealId, onDealSelect }) => {
  return (
    <div className="space-y-3 relative z-50">
      <Label className="text-base font-semibold">Select Deal</Label>
      <Select value={selectedDealId} onValueChange={onDealSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a deal from My Deals..." />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] z-[9999] bg-white">
          {mockDeals.map((deal) => (
            <SelectItem key={deal.id} value={deal.id}>
              <div className="w-full py-2">
                <div className="font-semibold text-gray-900 mb-1">{deal.name}</div>
                <div className="text-sm text-gray-600 mb-2">{deal.client}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-700">{formatCurrency(deal.value)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{deal.quoteCount} quotes</span>
                    <Badge className={`${getStatusColor(deal.status)} text-xs`}>
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DealSelector;
