
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface QuoteVersion {
  id: string;
  quoteName: string;
  createdDate: string;
  createdBy: string;
  revenue: number;
  marginPercent: number;
  status: 'Draft' | 'Active' | 'Archived';
}

interface CopyExistingQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopyQuote: (selectedQuoteId: string, newQuoteName: string) => void;
  quoteVersions: QuoteVersion[];
}

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
    case 'Draft': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Archived': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const CopyExistingQuoteDialog: React.FC<CopyExistingQuoteDialogProps> = ({
  open,
  onOpenChange,
  onCopyQuote,
  quoteVersions
}) => {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [newQuoteName, setNewQuoteName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuoteId && newQuoteName.trim()) {
      onCopyQuote(selectedQuoteId, newQuoteName.trim());
      setSelectedQuoteId('');
      setNewQuoteName('');
    }
  };

  const selectedQuote = quoteVersions.find(q => q.id === selectedQuoteId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Copy Existing Quote Scenario</DialogTitle>
          <DialogDescription>
            Select a quote scenario from this deal to copy and give it a new name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Quote to Copy</Label>
              <div className="border rounded-md max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Quote Name</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteVersions.map((quote) => (
                      <TableRow 
                        key={quote.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedQuoteId === quote.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedQuoteId(quote.id)}
                      >
                        <TableCell>
                          <input
                            type="radio"
                            name="selectedQuote"
                            value={quote.id}
                            checked={selectedQuoteId === quote.id}
                            onChange={() => setSelectedQuoteId(quote.id)}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{quote.quoteName}</TableCell>
                        <TableCell className="font-bold text-green-700">
                          {formatCurrency(quote.revenue)}
                        </TableCell>
                        <TableCell className="font-bold text-indigo-600">
                          {quote.marginPercent}%
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(quote.status)} font-semibold px-2 py-1 border`}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {selectedQuote && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newQuoteName" className="text-right">
                  New Name
                </Label>
                <Input
                  id="newQuoteName"
                  value={newQuoteName}
                  onChange={(e) => setNewQuoteName(e.target.value)}
                  className="col-span-3"
                  placeholder={`Copy of ${selectedQuote.quoteName}`}
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
              disabled={!selectedQuoteId || !newQuoteName.trim()}
            >
              Copy Quote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CopyExistingQuoteDialog;
