
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
import { Building2, LogOut, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

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
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">IT Services Portal</h1>
                <p className="text-sm text-gray-500">Deal Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Across all deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Profit margin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDeals}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deals.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Deals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Deals</CardTitle>
            <CardDescription>
              Click on any deal name to view version management details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal ID</TableHead>
                    <TableHead>Deal Name</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Margin %</TableHead>
                    <TableHead>Deal Owner</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{deal.id}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => onDealClick(deal.id)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {deal.name}
                        </button>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(deal.totalRevenue)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{deal.marginPercent}%</span>
                      </TableCell>
                      <TableCell>{deal.dealOwner}</TableCell>
                      <TableCell>{formatDate(deal.createdDate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(deal.status)}>
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
