
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
import { mockDeals, formatCurrency } from '../data/mockData';

interface DealSelectorProps {
  selectedDealId: string;
  onDealSelect: (dealId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

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
                <div className="text-sm text-gray-600 mb-2">Owner: {deal.dealOwner}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-700">{formatCurrency(deal.totalRevenue)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{deal.marginPercent}% margin</span>
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
