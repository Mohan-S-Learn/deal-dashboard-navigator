
import React, { useState } from 'react';
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
import { Plus, Copy, FileSearch, Sparkles, Target } from 'lucide-react';

interface VersionManagementProps {
  dealId: string;
  onBack: () => void;
}

interface QuoteVersion {
  id: string;
  quoteName: string;
  createdDate: string;
  createdBy: string;
  revenue: number;
  marginPercent: number;
  status: 'Draft' | 'Active' | 'Archived';
}

const mockQuoteVersions: QuoteVersion[] = [
  {
    id: 'QV001',
    quoteName: 'Standard Infrastructure Package',
    createdDate: '2024-01-15',
    createdBy: 'John Smith',
    revenue: 250000,
    marginPercent: 22,
    status: 'Active'
  },
  {
    id: 'QV002',
    quoteName: 'Enhanced Security Bundle',
    createdDate: '2024-01-10',
    createdBy: 'Sarah Wilson',
    revenue: 180000,
    marginPercent: 18,
    status: 'Draft'
  },
  {
    id: 'QV003',
    quoteName: 'Cloud Migration Phase 1',
    createdDate: '2024-01-05',
    createdBy: 'Mike Johnson',
    revenue: 320000,
    marginPercent: 25,
    status: 'Archived'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const VersionManagement: React.FC<VersionManagementProps> = ({ dealId, onBack }) => {
  const [quoteVersions] = useState<QuoteVersion[]>(mockQuoteVersions);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalRevenue = quoteVersions.reduce((sum, quote) => sum + quote.revenue, 0);
  const averageMargin = quoteVersions.reduce((sum, quote) => sum + quote.marginPercent, 0) / quoteVersions.length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scenario Builder</h1>
              <p className="text-gray-500 font-medium">Deal ID: {dealId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-indigo-700">Total Scenarios</CardTitle>
              <Target className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-indigo-900">{quoteVersions.length}</div>
              <p className="text-xs text-indigo-600 font-medium mt-1">Quote versions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-700">Combined Revenue</CardTitle>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-emerald-900">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">All scenarios</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-violet-700">Avg. Margin</CardTitle>
              <Target className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-violet-900">{averageMargin.toFixed(1)}%</div>
              <p className="text-xs text-violet-600 font-medium mt-1">Across scenarios</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Create New Quote Scenario</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <div className="text-center">
                  <div className="font-medium text-sm">Create New</div>
                  <div className="text-xs opacity-90">Start from scratch</div>
                </div>
              </Button>
              
              <Button 
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

        {/* Quote Versions Table */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Quote Scenarios</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Manage and compare different pricing scenarios for this deal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/70">
                    <TableHead className="font-bold text-gray-700 py-4">Quote Name</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Created Date</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Created By</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Revenue</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Margin %</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quoteVersions.map((quote, index) => (
                    <TableRow key={quote.id} className={`hover:bg-blue-50/50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <TableCell className="py-4">
                        <div className="font-semibold text-gray-900 text-base">{quote.quoteName}</div>
                        <div className="text-sm text-gray-500 font-mono">{quote.id}</div>
                      </TableCell>
                      <TableCell className="text-gray-600 py-4">{quote.createdDate}</TableCell>
                      <TableCell className="font-medium text-gray-700 py-4">{quote.createdBy}</TableCell>
                      <TableCell className="font-bold text-lg text-green-700 py-4">
                        {formatCurrency(quote.revenue)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-base text-indigo-600">{quote.marginPercent}%</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusColor(quote.status)} font-semibold px-3 py-1 border`}>
                          {quote.status}
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

export default VersionManagement;
