import React, { useState } from 'react';
import { mockDeals } from '../data/mockData';
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
import { FileText, DollarSign, User, Plus, Copy, FileSearch } from 'lucide-react';

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

  // Mock quote versions data
  const quoteVersions = [
    {
      id: 'QT-001-v1.0',
      quoteName: 'Initial Cloud Migration Quote',
      createdDate: deal.createdDate,
      createdBy: deal.dealOwner,
      revenue: deal.totalRevenue * 0.8,
      marginPercent: deal.marginPercent - 5,
      status: 'Draft'
    },
    {
      id: 'QT-001-v1.1',
      quoteName: 'Revised Cloud Migration Quote',
      createdDate: new Date(new Date(deal.createdDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: deal.dealOwner,
      revenue: deal.totalRevenue * 0.9,
      marginPercent: deal.marginPercent - 2,
      status: 'Review'
    },
    {
      id: 'QT-001-v2.0',
      quoteName: 'Final Cloud Migration Quote',
      createdDate: new Date(new Date(deal.createdDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: deal.dealOwner,
      revenue: deal.totalRevenue,
      marginPercent: deal.marginPercent,
      status: 'Current'
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

  const handleCreateNewQuote = () => {
    console.log('Creating new quote from beginning');
    // TODO: Implement new quote creation
  };

  const handleCopyFromExisting = () => {
    console.log('Copying from existing quote in same deal');
    // TODO: Implement copy from existing quote
  };

  const handleCopyFromOtherDeal = () => {
    console.log('Copying from another deal');
    // TODO: Implement copy from other deal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Deal Info Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{deal.name}</h2>
              <p className="text-sm text-gray-500">Deal ID: {deal.id}</p>
            </div>
            <Badge className={getStatusColor(deal.status)}>
              {deal.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deal Summary Cards */}
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

        {/* Quote Creation Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Quote</CardTitle>
            <CardDescription>
              Choose how you want to create a new quote version
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleCreateNewQuote}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Plus className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Create New</div>
                  <div className="text-sm text-muted-foreground">Start from beginning</div>
                </div>
              </Button>

              <Button 
                onClick={handleCopyFromExisting}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Copy className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Copy Existing</div>
                  <div className="text-sm text-muted-foreground">From this deal</div>
                </div>
              </Button>

              <Button 
                onClick={handleCopyFromOtherDeal}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <FileSearch className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Copy from Deal</div>
                  <div className="text-sm text-muted-foreground">From another deal</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quote Versions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Versions</CardTitle>
            <CardDescription>
              All quote versions created for this deal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Quote Name</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Margin %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quoteVersions.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell className="font-medium">{quote.quoteName}</TableCell>
                      <TableCell>{formatDate(quote.createdDate)}</TableCell>
                      <TableCell>{quote.createdBy}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(quote.revenue)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{quote.marginPercent.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                        </div>
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

export default VersionManagement;
