
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  dealOwner: string;
  status: string;
  totalRevenue: number;
  marginPercent: number;
  createdDate: string;
}

interface DashboardHeaderProps {
  deals: Deal[];
  totalRevenue: number;
  onScenarioBuilderClick: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  deals, 
  totalRevenue, 
  onScenarioBuilderClick 
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">My Deals Dashboard</h1>
              <Button
                onClick={onScenarioBuilderClick}
                variant="outline"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={deals.length === 0}
              >
                <Settings className="h-4 w-4 mr-2" />
                Scenario Builder
              </Button>
            </div>
            <p className="text-gray-600 font-medium mt-2">Manage and track your IT services deals</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
