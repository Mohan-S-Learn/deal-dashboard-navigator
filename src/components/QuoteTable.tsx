
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface QuoteVersion {
  id: string;
  quoteId: string | null;
  quoteName: string;
  createdDate: string;
  createdBy: string;
  revenue: number;
  marginPercent: number;
  status: 'Draft' | 'Active' | 'Archived';
}

interface QuoteTableProps {
  quoteVersions: QuoteVersion[];
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
    case 'Draft': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Archived': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const QuoteTable: React.FC<QuoteTableProps> = ({ quoteVersions }) => {
  if (quoteVersions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-lg">No quote scenarios found for this deal.</p>
        <p className="text-gray-400 mt-2">Create your first quote scenario using the buttons above.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/50 hover:bg-gray-50/70">
          <TableHead className="font-bold text-gray-700 py-4">Quote ID</TableHead>
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
              <div className="font-mono text-sm text-gray-600 font-semibold">
                {quote.quoteId || 'N/A'}
              </div>
            </TableCell>
            <TableCell className="py-4">
              <div className="font-semibold text-gray-900 text-base">{quote.quoteName}</div>
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
  );
};

export default QuoteTable;
