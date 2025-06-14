
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockDeals, formatCurrency, formatDate } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { LogOut, TrendingUp, DollarSign, Users, Calendar, Sparkles } from 'lucide-react';

interface DashboardProps {
  onDealClick: (dealId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onDealClick }) => {
  const { user, logout } = useAuth();
  const [deals] = useState(mockDeals);

  const totalRevenue = deals.reduce((sum, deal) => sum + deal.totalRevenue, 0);
  const averageMargin = deals.reduce((sum, deal) => sum + deal.marginPercent, 0) / deals.length;
  const activeDeals = deals.filter(deal => deal.status === 'Active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with user info and logout */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h2>
          </div>
          <p className="text-gray-600 text-lg">Here's your portfolio overview and recent activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-emerald-700">Total Revenue</CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">Across all deals</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-indigo-700">Average Margin</CardTitle>
              <div className="p-2 bg-indigo-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-900">{averageMargin.toFixed(1)}%</div>
              <p className="text-xs text-indigo-600 font-medium mt-1">Profit margin</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-violet-700">Active Deals</CardTitle>
              <div className="p-2 bg-violet-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-900">{activeDeals}</div>
              <p className="text-xs text-violet-600 font-medium mt-1">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-100 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-amber-700">Total Deals</CardTitle>
              <div className="p-2 bg-amber-500 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{deals.length}</div>
              <p className="text-xs text-amber-600 font-medium mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Deals Table */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Your Deals Portfolio</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Click on any deal name to access the Scenario Builder
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/70">
                    <TableHead className="font-bold text-gray-700 py-4">Deal ID</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Deal Name</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Total Revenue</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Margin %</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Deal Owner</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Created Date</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal, index) => (
                    <TableRow key={deal.id} className={`hover:bg-blue-50/50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <TableCell className="font-mono text-sm text-gray-600 py-4">{deal.id}</TableCell>
                      <TableCell className="py-4">
                        <button
                          onClick={() => onDealClick(deal.id)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-base transition-all duration-200 hover:bg-blue-50 px-2 py-1 rounded"
                        >
                          {deal.name}
                        </button>
                      </TableCell>
                      <TableCell className="font-bold text-lg text-green-700 py-4">
                        {formatCurrency(deal.totalRevenue)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-base text-indigo-600">{deal.marginPercent}%</span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700 py-4">{deal.dealOwner}</TableCell>
                      <TableCell className="text-gray-600 py-4">{formatDate(deal.createdDate)}</TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusColor(deal.status)} font-semibold px-3 py-1 border`}>
                          {deal.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
