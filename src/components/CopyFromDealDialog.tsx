
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
import DealSelector from './DealSelector';
import QuoteSelector, { Quote } from './QuoteSelector';
import { mockDeals } from '../data/mockData';

interface CopyFromDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopyFromDeal: (dealId: string, quoteId: string, newQuoteName: string) => void;
}

// Mock quotes for each deal from My Deals page
const mockQuotesForDeal: Record<string, Quote[]> = {
  'DEAL-001': [
    { id: 'Q001', name: 'Basic Cloud Migration', revenue: 200000, margin: 30 },
    { id: 'Q002', name: 'Enhanced Cloud Migration with Support', revenue: 300000, margin: 35 },
    { id: 'Q003', name: 'Premium Cloud Migration Solution', revenue: 450000, margin: 40 }
  ],
  'DEAL-002': [
    { id: 'Q004', name: 'Phase 1 - Digital Assessment', revenue: 350000, margin: 38 },
    { id: 'Q005', name: 'Complete Digital Transformation', revenue: 600000, margin: 42 },
    { id: 'Q006', name: 'Premium Transformation Suite', revenue: 780000, margin: 45 }
  ],
  'DEAL-003': [
    { id: 'Q007', name: 'Security Essentials Package', revenue: 180000, margin: 25 },
    { id: 'Q008', name: 'Advanced Security Suite', revenue: 250000, margin: 28 },
    { id: 'Q009', name: 'Enterprise Security Platform', revenue: 320000, margin: 32 }
  ],
  'DEAL-004': [
    { id: 'Q010', name: 'Basic Analytics Platform', revenue: 500000, margin: 35 },
    { id: 'Q011', name: 'Advanced Analytics Suite', revenue: 750000, margin: 38 },
    { id: 'Q012', name: 'Enterprise Analytics Platform', revenue: 950000, margin: 42 }
  ],
  'DEAL-005': [
    { id: 'Q013', name: 'MVP Mobile App', revenue: 100000, margin: 40 },
    { id: 'Q014', name: 'Full Mobile App Development', revenue: 180000, margin: 45 }
  ],
  'DEAL-006': [
    { id: 'Q015', name: 'AI Implementation Phase 1', revenue: 600000, margin: 48 },
    { id: 'Q016', name: 'Complete AI Implementation', revenue: 900000, margin: 52 },
    { id: 'Q017', name: 'Premium AI Services Suite', revenue: 1200000, margin: 55 }
  ]
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
  const availableQuotes = selectedDealId ? mockQuotesForDeal[selectedDealId] || [] : [];
  const selectedQuote = availableQuotes.find(q => q.id === selectedQuoteId);

  // Debug logging
  console.log('Selected Deal ID:', selectedDealId);
  console.log('Available Quotes:', availableQuotes);
  console.log('Selected Deal:', selectedDeal);

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
    console.log('Deal selected:', dealId);
    setSelectedDealId(dealId);
    setSelectedQuoteId(''); // Reset quote selection when deal changes
    setNewQuoteName(''); // Reset name when deal changes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-visible z-50">
        <DialogHeader>
          <DialogTitle>Copy Quote from Another Deal</DialogTitle>
          <DialogDescription>
            Select a deal from your "My Deals" and choose a quote scenario to copy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="relative z-40">
              <DealSelector 
                selectedDealId={selectedDealId}
                onDealSelect={handleDealSelect}
              />
            </div>

            <div className="relative z-30">
              <QuoteSelector
                selectedDeal={selectedDeal}
                availableQuotes={availableQuotes}
                selectedQuoteId={selectedQuoteId}
                onQuoteSelect={setSelectedQuoteId}
              />
            </div>

            {selectedQuote && (
              <div className="space-y-3">
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
          <DialogFooter className="pt-6">
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
              className="bg-blue-600 hover:bg-blue-700"
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
