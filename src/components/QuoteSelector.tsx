
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
}

const QuoteSelector: React.FC<QuoteSelectorProps> = ({
  selectedDeal,
  availableQuotes,
  selectedQuoteId,
  onQuoteSelect
}) => {
  if (!selectedDeal || availableQuotes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 relative z-40">
      <Label className="text-base font-semibold">
        Select Quote from {selectedDeal.name}
      </Label>
      <Select value={selectedQuoteId} onValueChange={onQuoteSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a quote scenario..." />
        </SelectTrigger>
        <SelectContent className="max-h-[250px] z-[9998] bg-white">
          {availableQuotes.map((quote) => (
            <SelectItem key={quote.id} value={quote.id}>
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
