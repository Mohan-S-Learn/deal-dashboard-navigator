
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Deal, formatCurrency } from '../data/mockData';

export interface Quote {
  id: string;
  name: string;
  revenue: number;
  margin: number;
}

interface QuoteSelectorProps {
  selectedDeal: Deal | undefined;
  availableQuotes: Quote[];
  selectedQuoteId: string;
  onQuoteSelect: (quoteId: string) => void;
  loading?: boolean;
}

const QuoteSelector: React.FC<QuoteSelectorProps> = ({
  selectedDeal,
  availableQuotes,
  selectedQuoteId,
  onQuoteSelect,
  loading = false
}) => {
  console.log('QuoteSelector - selectedDeal:', selectedDeal);
  console.log('QuoteSelector - availableQuotes:', availableQuotes);
  console.log('QuoteSelector - selectedQuoteId:', selectedQuoteId);

  if (!selectedDeal) {
    console.log('QuoteSelector - No deal selected');
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Loading quotes for {selectedDeal.name}...
        </Label>
        <div className="w-full h-10 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (availableQuotes.length === 0) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          No quotes found for {selectedDeal.name}
        </Label>
        <div className="text-sm text-gray-500">
          This deal doesn't have any quote scenarios yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        Select Quote from {selectedDeal.name}
      </Label>
      <Select value={selectedQuoteId} onValueChange={onQuoteSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a quote scenario..." />
        </SelectTrigger>
        <SelectContent className="max-h-[250px] z-[60] bg-white border border-gray-200 shadow-lg">
          {availableQuotes.map((quote) => (
            <SelectItem 
              key={quote.id} 
              value={quote.id}
              className="hover:bg-gray-100 focus:bg-gray-100"
            >
              <div className="w-full py-2">
                <div className="font-medium text-gray-900 mb-1">{quote.name}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-700">{formatCurrency(quote.revenue)}</span>
                  <span className="text-sm text-indigo-600 font-semibold">{quote.margin}% margin</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuoteSelector;
