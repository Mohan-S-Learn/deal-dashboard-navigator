
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface RevenueHeaderProps {
  dealId: string;
  quoteName: string;
  onBack: () => void;
  onAddRevenue: () => void;
}

export const RevenueHeader: React.FC<RevenueHeaderProps> = ({
  dealId,
  quoteName,
  onBack,
  onAddRevenue
}) => {
  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Deal Master
      </Button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Revenue Calculation</h1>
          <p className="text-gray-600">Deal: {dealId} | Quote: {quoteName}</p>
        </div>
        <Button onClick={onAddRevenue}>
          <Plus className="h-4 w-4 mr-2" />
          Add Revenue Entry
        </Button>
      </div>
    </div>
  );
};
