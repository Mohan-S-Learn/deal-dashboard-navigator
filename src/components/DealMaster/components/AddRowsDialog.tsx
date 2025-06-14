
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddRowsDialogProps {
  title: string;
  onAddRows: (count: number) => void;
  buttonText: string;
}

export const AddRowsDialog: React.FC<AddRowsDialogProps> = ({
  title,
  onAddRows,
  buttonText
}) => {
  const [rowCount, setRowCount] = useState(1);
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    onAddRows(rowCount);
    setOpen(false);
    setRowCount(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{buttonText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Number of rows to add</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={rowCount}
              onChange={(e) => setRowCount(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              Add {rowCount} Row{rowCount > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
