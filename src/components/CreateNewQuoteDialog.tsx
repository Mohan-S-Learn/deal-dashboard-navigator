
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

interface CreateNewQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateQuote: (quoteName: string) => void;
}

const CreateNewQuoteDialog: React.FC<CreateNewQuoteDialogProps> = ({
  open,
  onOpenChange,
  onCreateQuote
}) => {
  const [quoteName, setQuoteName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteName.trim()) {
      onCreateQuote(quoteName.trim());
      setQuoteName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Quote Scenario</DialogTitle>
          <DialogDescription>
            Enter a name for your new quote scenario. This will start from scratch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quoteName" className="text-right">
                Name
              </Label>
              <Input
                id="quoteName"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Premium Package"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!quoteName.trim()}>
              Create Quote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewQuoteDialog;
