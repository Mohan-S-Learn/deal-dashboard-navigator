
import React from 'react';
import { mockDeals } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Clock, User, DollarSign } from 'lucide-react';

interface VersionManagementProps {
  dealId: string;
  onBack: () => void;
}

const VersionManagement: React.FC<VersionManagementProps> = ({ dealId, onBack }) => {
  const deal = mockDeals.find(d => d.id === dealId);

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Deal not found</p>
            <Button onClick={onBack} className="mt-4 w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock version data
  const versions = [
    {
      id: 'v1.0',
      name: 'Initial Proposal',
      createdBy: deal.dealOwner,
      createdDate: deal.createdDate,
      revenue: deal.totalRevenue * 0.8,
      margin: deal.marginPercent - 5,
      status: 'Draft',
      description: 'Initial proposal with basic requirements'
    },
    {
      id: 'v1.1',
      name: 'Revised Proposal',
      createdBy: deal.dealOwner,
      createdDate: new Date(new Date(deal.createdDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: deal.totalRevenue * 0.9,
      margin: deal.marginPercent - 2,
      status: 'Review',
      description: 'Updated proposal with additional services'
    },
    {
      id: 'v2.0',
      name: 'Final Proposal',
      createdBy: deal.dealOwner,
      createdDate: new Date(new Date(deal.createdDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: deal.totalRevenue,
      margin: deal.marginPercent,
      status: 'Current',
      description: 'Final approved proposal with all requirements'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current': return 'bg-green-100 text-green-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                <p className="text-sm text-gray-500">Deal ID: {deal.id}</p>
              </div>
            </div>
            <Badge className={getStatusColor(deal.status)}>
              {deal.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deal Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(deal.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Margin</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deal.marginPercent}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deal Owner</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{deal.dealOwner}</div>
            </CardContent>
          </Card>
        </div>

        {/* Version History */}
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>
              Track changes and iterations of this deal proposal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div key={version.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {version.name} ({version.id})
                        </h3>
                        <p className="text-sm text-gray-500">{version.description}</p>
                      </div>
                      <Badge className={getStatusColor(version.status)}>
                        {version.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{version.createdBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(version.createdDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(version.revenue)}</span>
                      </div>
                      <div>
                        <span className="font-medium">{version.margin.toFixed(1)}% margin</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VersionManagement;
