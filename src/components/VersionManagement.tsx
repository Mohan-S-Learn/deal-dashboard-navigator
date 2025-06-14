
import React, { useState, useEffect } from 'react';
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
import { Plus, Copy, FileSearch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CreateNewQuoteDialog from './CreateNewQuoteDialog';
import CopyExistingQuoteDialog from './CopyExistingQuoteDialog';
import CopyFromDealDialog from './CopyFromDealDialog';

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const VersionManagement: React.FC<VersionManagementProps> = ({ dealId, onBack }) => {
  const [quoteVersions, setQuoteVersions] = useState<QuoteVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [createNewDialogOpen, setCreateNewDialogOpen] = useState(false);
  const [copyExistingDialogOpen, setCopyExistingDialogOpen] = useState(false);
  const [copyFromDealDialogOpen, setCopyFromDealDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load quotes from database when component mounts
  useEffect(() => {
    loadQuotes();
  }, [dealId]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Quotes')
        .select('*')
        .eq('Deal_Id', dealId);

      if (error) {
        console.error('Error loading quotes:', error);
        toast({
          title: "Error",
          description: "Failed to load quotes from database",
          variant: "destructive"
        });
        return;
      }

      const formattedQuotes = data.map(quote => ({
        id: quote.Quote_Name, // Using Quote_Name as ID for now
        quoteName: quote.Quote_Name,
        createdDate: quote.Created_Date || new Date().toISOString().split('T')[0],
        createdBy: quote.Created_By || 'Unknown',
        revenue: quote.Revenue || 0,
        marginPercent: quote['Margin %'] || 0,
        status: (quote.Status || 'Draft') as 'Draft' | 'Active' | 'Archived'
      }));

      setQuoteVersions(formattedQuotes);
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveQuoteToDatabase = async (quote: Omit<QuoteVersion, 'id'>) => {
    try {
      const { error } = await supabase
        .from('Quotes')
        .insert({
          Deal_Id: dealId,
          Quote_Name: quote.quoteName,
          Created_Date: quote.createdDate,
          Created_By: quote.createdBy,
          Revenue: quote.revenue,
          'Margin %': quote.marginPercent,
          Status: quote.status
        });

      if (error) {
        console.error('Error saving quote:', error);
        toast({
          title: "Error",
          description: "Failed to save quote to database",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Error",
        description: "Failed to save quote",
        variant: "destructive"
      });
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Draft': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleCreateNewQuote = async (quoteName: string) => {
    const newQuote = {
      quoteName,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      revenue: 0,
      marginPercent: 0,
      status: 'Draft' as const
    };

    const saved = await saveQuoteToDatabase(newQuote);
    if (saved) {
      await loadQuotes(); // Reload from database
      setCreateNewDialogOpen(false);
      
      toast({
        title: "Quote Scenario Created",
        description: `"${quoteName}" has been created and saved successfully.`
      });
    }
  };

  const handleCopyExistingQuote = async (selectedQuoteId: string, newQuoteName: string) => {
    const originalQuote = quoteVersions.find(q => q.id === selectedQuoteId);
    if (!originalQuote) return;

    const newQuote = {
      quoteName: newQuoteName,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      revenue: originalQuote.revenue,
      marginPercent: originalQuote.marginPercent,
      status: 'Draft' as const
    };

    const saved = await saveQuoteToDatabase(newQuote);
    if (saved) {
      await loadQuotes(); // Reload from database
      setCopyExistingDialogOpen(false);
      
      toast({
        title: "Quote Scenario Copied",
        description: `"${newQuoteName}" has been created from "${originalQuote.quoteName}" and saved.`
      });
    }
  };

  const handleCopyFromDeal = async (dealId: string, quoteId: string, newQuoteName: string) => {
    // Load the source quote from database
    try {
      const { data, error } = await supabase
        .from('Quotes')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to find the source quote",
          variant: "destructive"
        });
        return;
      }

      const newQuote = {
        quoteName: newQuoteName,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Current User',
        revenue: data.Revenue || 0,
        marginPercent: data['Margin %'] || 0,
        status: 'Draft' as const
      };

      const saved = await saveQuoteToDatabase(newQuote);
      if (saved) {
        await loadQuotes(); // Reload from database
        setCopyFromDealDialogOpen(false);
        
        toast({
          title: "Quote Scenario Copied",
          description: `"${newQuoteName}" has been copied from another deal and saved.`
        });
      }
    } catch (error) {
      console.error('Error copying quote from deal:', error);
      toast({
        title: "Error",
        description: "Failed to copy quote from deal",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

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
        {/* Action Buttons */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Create New Quote Scenario</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setCreateNewDialogOpen(true)}
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <div className="text-center">
                  <div className="font-medium text-sm">Create New</div>
                  <div className="text-xs opacity-90">Start from scratch</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setCopyExistingDialogOpen(true)}
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
                onClick={() => setCopyFromDealDialogOpen(true)}
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
              {quoteVersions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-lg">No quote scenarios found for this deal.</p>
                  <p className="text-gray-400 mt-2">Create your first quote scenario using the buttons above.</p>
                </div>
              ) : (
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
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <CreateNewQuoteDialog
        open={createNewDialogOpen}
        onOpenChange={setCreateNewDialogOpen}
        onCreateQuote={handleCreateNewQuote}
      />

      <CopyExistingQuoteDialog
        open={copyExistingDialogOpen}
        onOpenChange={setCopyExistingDialogOpen}
        onCopyQuote={handleCopyExistingQuote}
        quoteVersions={quoteVersions}
      />

      <CopyFromDealDialog
        open={copyFromDealDialogOpen}
        onOpenChange={setCopyFromDealDialogOpen}
        onCopyFromDeal={handleCopyFromDeal}
      />
    </div>
  );
};

export default VersionManagement;
