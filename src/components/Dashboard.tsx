
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, DollarSign, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { syncDealsToDatabase } from '../services/dataSync';

interface Deal {
  id: string;
  name: string;
  dealOwner: string;
  status: string;
  totalRevenue: number;
  marginPercent: number;
  createdDate: string;
}

interface DashboardProps {
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

const Dashboard: React.FC<DashboardProps> = ({ onDealClick }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // First sync mock deals to database
      await syncDealsToDatabase();
      
      // Then load deals from database
      await loadDealsFromDatabase();
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDealsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('Deals')
        .select('*')
        .order('Created_Date', { ascending: false });

      if (error) {
        console.error('Error loading deals:', error);
        return;
      }

      const formattedDeals = data.map(deal => ({
        id: deal.Deal_Id,
        name: deal.Deal_Name,
        dealOwner: deal.Deal_Owner,
        status: deal.Status,
        totalRevenue: deal.Total_Revenue,
        marginPercent: deal['Margin%'],
        createdDate: deal.Created_Date
      }));

      setDeals(formattedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
    }
  };

  const totalRevenue = deals.reduce((sum, deal) => sum + deal.totalRevenue, 0);
  const activeDeals = deals.filter(deal => deal.status === 'Active').length;
  const avgMargin = deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.marginPercent, 0) / deals.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Deals Dashboard</h1>
              <p className="text-gray-600 font-medium mt-2">Manage and track your IT services deals</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deals</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{deals.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{activeDeals}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Margin</CardTitle>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-700">{avgMargin.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Deals Grid */}
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
      </main>
    </div>
  );
};

export default Dashboard;
