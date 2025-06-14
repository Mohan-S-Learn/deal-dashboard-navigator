
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

interface CopyFromDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopyFromDeal: (dealId: string, quoteId: string, newQuoteName: string) => void;
}

// Mock data for deals - this would come from your data source
const mockDeals = [
  { id: 'DEAL001', name: 'ABC Corp Infrastructure', quoteCount: 3 },
  { id: 'DEAL002', name: 'XYZ Ltd Migration', quoteCount: 2 },
  { id: 'DEAL003', name: 'TechStart Security', quoteCount: 4 }
];

// Mock quotes for selected deal - this would be fetched based on selected deal
const mockQuotesForDeal = {
  'DEAL001': [
    { id: 'Q001', name: 'Basic Package', revenue: 150000 },
    { id: 'Q002', name: 'Enhanced Package', revenue: 200000 },
    { id: 'Q003', name: 'Premium Package', revenue: 300000 }
  ],
  'DEAL002': [
    { id: 'Q004', name: 'Migration Phase 1', revenue: 120000 },
    { id: 'Q005', name: 'Migration Complete', revenue: 250000 }
  ],
  'DEAL003': [
    { id: 'Q006', name: 'Security Essentials', revenue: 80000 },
    { id: 'Q007', name: 'Advanced Security', revenue: 140000 },
    { id: 'Q008', name: 'Enterprise Security', revenue: 220000 },
    { id: 'Q009', name: 'Complete Solution', revenue: 350000 }
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Copy Quote from Another Deal</DialogTitle>
          <DialogDescription>
            Select a deal and then choose a quote scenario from that deal to copy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Deal Selection */}
            <div className="space-y-2">
              <Label>Select Deal</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {mockDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className={`p-3 rounded-md cursor-pointer border transition-colors ${
                      selectedDealId === deal.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleDealSelect(deal.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="selectedDeal"
                        value={deal.id}
                        checked={selectedDealId === deal.id}
                        onChange={() => handleDealSelect(deal.id)}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium">{deal.name}</div>
                        <div className="text-sm text-gray-500">{deal.quoteCount} quote scenarios</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Selection */}
            {selectedDeal && availableQuotes.length > 0 && (
              <div className="space-y-2">
                <Label>Select Quote from {selectedDeal.name}</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {availableQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className={`p-3 rounded-md cursor-pointer border transition-colors ${
                        selectedQuoteId === quote.id 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedQuoteId(quote.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="selectedQuote"
                          value={quote.id}
                          checked={selectedQuoteId === quote.id}
                          onChange={() => setSelectedQuoteId(quote.id)}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{quote.name}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(quote.revenue)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Quote Name */}
            {selectedQuote && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newQuoteNameFromDeal" className="text-right">
                  New Name
                </Label>
                <Input
                  id="newQuoteNameFromDeal"
                  value={newQuoteName}
                  onChange={(e) => setNewQuoteName(e.target.value)}
                  className="col-span-3"
                  placeholder={`Copy of ${selectedQuote.name}`}
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
