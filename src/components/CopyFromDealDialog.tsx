import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CopyFromDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopyFromDeal: (dealId: string, quoteId: string, newQuoteName: string) => void;
}

// Expanded mock data for deals from "My Deals" page
const mockDeals = [
  { 
    id: 'DEAL001', 
    name: 'ABC Corp Infrastructure Upgrade', 
    client: 'ABC Corporation',
    value: 450000,
    status: 'Active',
    quoteCount: 3 
  },
  { 
    id: 'DEAL002', 
    name: 'XYZ Ltd Cloud Migration', 
    client: 'XYZ Limited',
    value: 280000,
    status: 'Proposal',
    quoteCount: 2 
  },
  { 
    id: 'DEAL003', 
    name: 'TechStart Security Implementation', 
    client: 'TechStart Inc',
    value: 650000,
    status: 'Active',
    quoteCount: 4 
  },
  { 
    id: 'DEAL004', 
    name: 'Global Corp Digital Transformation', 
    client: 'Global Corp',
    value: 1200000,
    status: 'Negotiation',
    quoteCount: 5 
  },
  { 
    id: 'DEAL005', 
    name: 'StartupX Platform Development', 
    client: 'StartupX',
    value: 85000,
    status: 'Proposal',
    quoteCount: 2 
  },
  { 
    id: 'DEAL006', 
    name: 'Enterprise Solutions Modernization', 
    client: 'Enterprise Solutions Ltd',
    value: 750000,
    status: 'Active',
    quoteCount: 3 
  }
];

// Expanded mock quotes for selected deal
const mockQuotesForDeal = {
  'DEAL001': [
    { id: 'Q001', name: 'Basic Infrastructure Package', revenue: 150000, margin: 18 },
    { id: 'Q002', name: 'Enhanced Infrastructure with Support', revenue: 200000, margin: 22 },
    { id: 'Q003', name: 'Premium Infrastructure Solution', revenue: 300000, margin: 25 }
  ],
  'DEAL002': [
    { id: 'Q004', name: 'Phase 1 - Assessment & Planning', revenue: 120000, margin: 20 },
    { id: 'Q005', name: 'Complete Migration Package', revenue: 250000, margin: 24 }
  ],
  'DEAL003': [
    { id: 'Q006', name: 'Security Essentials', revenue: 180000, margin: 19 },
    { id: 'Q007', name: 'Advanced Security Suite', revenue: 340000, margin: 23 },
    { id: 'Q008', name: 'Enterprise Security Platform', revenue: 520000, margin: 27 },
    { id: 'Q009', name: 'Complete Security Solution', revenue: 650000, margin: 29 }
  ],
  'DEAL004': [
    { id: 'Q010', name: 'Foundation Package', revenue: 400000, margin: 20 },
    { id: 'Q011', name: 'Standard Transformation', revenue: 700000, margin: 24 },
    { id: 'Q012', name: 'Advanced Digital Suite', revenue: 950000, margin: 26 },
    { id: 'Q013', name: 'Premium Transformation', revenue: 1200000, margin: 28 },
    { id: 'Q014', name: 'Enterprise Plus Package', revenue: 1450000, margin: 30 }
  ],
  'DEAL005': [
    { id: 'Q015', name: 'MVP Development', revenue: 60000, margin: 15 },
    { id: 'Q016', name: 'Full Platform Development', revenue: 85000, margin: 18 }
  ],
  'DEAL006': [
    { id: 'Q017', name: 'Modernization Phase 1', revenue: 250000, margin: 21 },
    { id: 'Q018', name: 'Complete Modernization', revenue: 500000, margin: 25 },
    { id: 'Q019', name: 'Premium Modernization Suite', revenue: 750000, margin: 28 }
  ]
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Proposal': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Negotiation': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const CopyFromDealDialog: React.FC<CopyFromDealDialogProps> = ({
  open,
  onOpenChange,
  onCopyFromDeal
}) => {
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [newQuoteName, setNewQuoteName] = useState('');

  const selectedDeal = mockDeals.find(d => d.id === selectedDealId);
  const availableQuotes = selectedDealId ? mockQuotesForDeal[selectedDealId as keyof typeof mockQuotesForDeal] || [] : [];
  const selectedQuote = availableQuotes.find(q => q.id === selectedQuoteId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDealId && selectedQuoteId && newQuoteName.trim()) {
      onCopyFromDeal(selectedDealId, selectedQuoteId, newQuoteName.trim());
      setSelectedDealId('');
      setSelectedQuoteId('');
      setNewQuoteName('');
    }
  };

  const handleDealSelect = (dealId: string) => {
    setSelectedDealId(dealId);
    setSelectedQuoteId(''); // Reset quote selection when deal changes
    setNewQuoteName(''); // Reset name when deal changes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Copy Quote from Another Deal</DialogTitle>
          <DialogDescription>
            Select a deal from your "My Deals" and choose a quote scenario to copy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Deal Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Select Deal</Label>
              <Select value={selectedDealId} onValueChange={handleDealSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a deal..." />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  {mockDeals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{deal.name}</div>
                          <div className="text-sm text-gray-600">{deal.client}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold text-green-700">{formatCurrency(deal.value)}</span>
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

            {/* Quote Selection */}
            {selectedDeal && availableQuotes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-semibold">Select Quote from {selectedDeal.name}</Label>
                <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a quote..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    {availableQuotes.map((quote) => (
                      <SelectItem key={quote.id} value={quote.id} className="cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{quote.name}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-bold text-green-700">{formatCurrency(quote.revenue)}</span>
                              <span className="text-xs text-indigo-600 font-medium">{quote.margin}% margin</span>
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* New Quote Name */}
            {selectedQuote && (
              <div className="space-y-2">
                <Label htmlFor="newQuoteNameFromDeal" className="text-base font-semibold">
                  New Quote Name
                </Label>
                <Input
                  id="newQuoteNameFromDeal"
                  value={newQuoteName}
                  onChange={(e) => setNewQuoteName(e.target.value)}
                  placeholder={`Copy of ${selectedQuote.name}`}
                  className="w-full"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedDealId || !selectedQuoteId || !newQuoteName.trim()}
            >
              Copy Quote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CopyFromDealDialog;
