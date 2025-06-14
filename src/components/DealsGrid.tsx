
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  dealOwner: string;
  status: string;
  totalRevenue: number;
  marginPercent: number;
  createdDate: string;
}

interface DealsGridProps {
  deals: Deal[];
  onDealClick: (dealId: string) => void;
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
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const DealsGrid: React.FC<DealsGridProps> = ({ deals, onDealClick }) => {
  return (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-gray-900">Active Deals</CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Click on any deal to manage quote scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card 
              key={deal.id} 
              className="group cursor-pointer border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm"
              onClick={() => onDealClick(deal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {deal.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1 font-medium">ID: {deal.id}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Deal Owner:</span>
                    <span className="text-sm font-semibold text-gray-800">{deal.dealOwner}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Revenue:</span>
                    <span className="text-lg font-bold text-green-700">{formatCurrency(deal.totalRevenue)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Margin:</span>
                    <span className="text-base font-bold text-indigo-600">{deal.marginPercent}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge className={`${getStatusColor(deal.status)} font-semibold px-3 py-1 border`}>
                      {deal.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{deal.createdDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealsGrid;
