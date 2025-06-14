
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DealMasterHeaderProps {
  dealId: string;
  quoteName: string;
  onBack: () => void;
  onSave: () => void;
}

export const DealMasterHeader: React.FC<DealMasterHeaderProps> = ({
  dealId,
  quoteName,
  onBack,
  onSave
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Scenarios</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Deal Master</h1>
              <p className="text-gray-500 font-medium">Deal ID: {dealId} | Quote: {quoteName}</p>
            </div>
          </div>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
