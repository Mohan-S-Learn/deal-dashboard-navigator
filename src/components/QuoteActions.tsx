
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Copy, FileSearch } from 'lucide-react';

interface QuoteActionsProps {
  onCreateNew: () => void;
  onCopyExisting: () => void;
  onCopyFromDeal: () => void;
}

const QuoteActions: React.FC<QuoteActionsProps> = ({
  onCreateNew,
  onCopyExisting,
  onCopyFromDeal
}) => {
  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-blue-600" />
          <span>Create New Quote Scenario</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={onCreateNew}
            className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium text-sm">Create New</div>
              <div className="text-xs opacity-90">Start from scratch</div>
            </div>
          </Button>
          
          <Button 
            onClick={onCopyExisting}
            variant="outline"
            className="h-12 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium text-sm">Copy Existing</div>
              <div className="text-xs opacity-75">From this deal</div>
            </div>
          </Button>
          
          <Button 
            onClick={onCopyFromDeal}
            variant="outline"
            className="h-12 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FileSearch className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium text-sm">Copy from Deal</div>
              <div className="text-xs opacity-75">From another deal</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteActions;
