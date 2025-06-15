
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { AddRowsDialog } from './AddRowsDialog';

interface ServiceCategoriesTableActionsProps {
  onCopyFirstRowToAll: () => void;
  onAddRows: (count: number) => void;
}

export const ServiceCategoriesTableActions: React.FC<ServiceCategoriesTableActionsProps> = ({
  onCopyFirstRowToAll,
  onAddRows
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onCopyFirstRowToAll} variant="outline" size="sm">
        <Copy className="h-4 w-4 mr-2" />
        Copy First Row to All
      </Button>
      <AddRowsDialog
        title="Add Service Category Rows"
        buttonText="Add Rows"
        onAddRows={onAddRows}
      />
    </div>
  );
};
