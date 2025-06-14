
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
import QuoteSelector from './QuoteSelector';
import { mockDeals, mockQuotesForDeal } from './dealData';

interface CopyFromDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopyFromDeal: (dealId: string, quoteId: string, newQuoteName: string) => void;
}

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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-visible">
        <DialogHeader>
          <DialogTitle>Copy Quote from Another Deal</DialogTitle>
          <DialogDescription>
            Select a deal from your "My Deals" and choose a quote scenario to copy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <DealSelector 
              selectedDealId={selectedDealId}
              onDealSelect={handleDealSelect}
            />

            <QuoteSelector
              selectedDeal={selectedDeal}
              availableQuotes={availableQuotes}
              selectedQuoteId={selectedQuoteId}
              onQuoteSelect={setSelectedQuoteId}
            />

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
