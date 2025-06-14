import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CreateNewQuoteDialog from './CreateNewQuoteDialog';
import CopyExistingQuoteDialog from './CopyExistingQuoteDialog';
import CopyFromDealDialog from './CopyFromDealDialog';
import QuoteActions from './QuoteActions';
import QuoteTable from './QuoteTable';
import { generateUniqueQuoteId } from '../utils/quoteUtils';

interface VersionManagementProps {
  dealId: string;
  onBack: () => void;
  onQuoteClick?: (dealId: string, quoteName: string) => void;
}

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

const VersionManagement: React.FC<VersionManagementProps> = ({ dealId, onBack, onQuoteClick }) => {
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
      console.log('Loading quotes for dealId:', dealId);
      
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

      console.log('Raw quotes data:', data);

      // Process quotes and generate Quote_IDs for those that don't have them
      const processedQuotes = [];
      const quotesToUpdate = [];

      for (let index = 0; index < data.length; index++) {
        const quote = data[index];
        let quoteId = quote.Quote_ID;

        // If Quote_ID is null or empty, generate a new one
        if (!quoteId) {
          quoteId = await generateUniqueQuoteId(dealId);
          quotesToUpdate.push({
            Deal_Id: quote.Deal_Id,
            Quote_Name: quote.Quote_Name,
            newQuoteId: quoteId
          });
        }

        processedQuotes.push({
          id: `${quote.Deal_Id}-${quote.Quote_Name}-${index}`,
          quoteId: quoteId,
          quoteName: quote.Quote_Name,
          createdDate: quote.Created_Date || new Date().toISOString().split('T')[0],
          createdBy: quote.Created_By || 'Unknown',
          revenue: quote.Revenue || 0,
          marginPercent: quote['Margin %'] || 0,
          status: (quote.Status || 'Draft') as 'Draft' | 'Active' | 'Archived'
        });
      }

      // Update quotes in database that didn't have Quote_IDs
      if (quotesToUpdate.length > 0) {
        console.log('Updating quotes with new Quote_IDs:', quotesToUpdate);
        
        for (const quoteUpdate of quotesToUpdate) {
          const { error: updateError } = await supabase
            .from('Quotes')
            .update({ Quote_ID: quoteUpdate.newQuoteId })
            .eq('Deal_Id', quoteUpdate.Deal_Id)
            .eq('Quote_Name', quoteUpdate.Quote_Name);

          if (updateError) {
            console.error('Error updating quote with new Quote_ID:', updateError);
          } else {
            console.log(`Updated quote "${quoteUpdate.Quote_Name}" with new Quote_ID: ${quoteUpdate.newQuoteId}`);
          }
        }
      }

      console.log('Processed quotes:', processedQuotes);
      setQuoteVersions(processedQuotes);
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
      console.log('Saving quote to database:', quote);
      
      // Generate a unique Quote_ID using the database query
      const uniqueQuoteId = quote.quoteId || await generateUniqueQuoteId(dealId);
      
      // Generate a unique quote name if it already exists
      const existingQuotes = await supabase
        .from('Quotes')
        .select('Quote_Name')
        .eq('Deal_Id', dealId);
      
      let uniqueQuoteName = quote.quoteName;
      let counter = 1;
      
      if (existingQuotes.data) {
        const existingNames = existingQuotes.data.map(q => q.Quote_Name);
        while (existingNames.includes(uniqueQuoteName)) {
          uniqueQuoteName = `${quote.quoteName} (${counter})`;
          counter++;
        }
      }

      const { error } = await supabase
        .from('Quotes')
        .insert({
          Deal_Id: dealId,
          Quote_ID: uniqueQuoteId,
          Quote_Name: uniqueQuoteName,
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
          description: `Failed to save quote: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('Quote saved successfully with ID:', uniqueQuoteId, 'and name:', uniqueQuoteName);
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

  const handleCreateNewQuote = async (quoteName: string) => {
    const newQuoteId = await generateUniqueQuoteId(dealId);
    
    const newQuote = {
      quoteId: newQuoteId,
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
        description: `"${quoteName}" has been created with ID: ${newQuoteId}.`
      });
    }
  };

  const handleCopyExistingQuote = async (selectedQuoteId: string, newQuoteName: string) => {
    console.log('Copying quote with ID:', selectedQuoteId);
    const originalQuote = quoteVersions.find(q => q.id === selectedQuoteId);
    if (!originalQuote) {
      console.error('Original quote not found:', selectedQuoteId);
      toast({
        title: "Error",
        description: "Original quote not found",
        variant: "destructive"
      });
      return;
    }

    // Generate a NEW unique Quote_ID for the copied quote using database query
    const newQuoteId = await generateUniqueQuoteId(dealId);

    const newQuote = {
      quoteId: newQuoteId, // Use the NEW Quote_ID, not the original one
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
        description: `"${newQuoteName}" has been created with ID: ${newQuoteId}.`
      });
    }
  };

  const handleCopyFromDeal = async (dealId: string, quoteId: string, newQuoteName: string) => {
    // Load the source quote from database
    try {
      console.log('Copying from deal:', dealId, 'quote:', quoteId);
      
      const { data, error } = await supabase
        .from('Quotes')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteId)
        .single();

      if (error) {
        console.error('Error finding source quote:', error);
        toast({
          title: "Error",
          description: "Failed to find the source quote",
          variant: "destructive"
        });
        return;
      }

      const newQuoteId = await generateUniqueQuoteId(dealId);

      const newQuote = {
        quoteId: newQuoteId,
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
          description: `"${newQuoteName}" has been copied with ID: ${newQuoteId}.`
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
        <QuoteActions
          onCreateNew={() => setCreateNewDialogOpen(true)}
          onCopyExisting={() => setCopyExistingDialogOpen(true)}
          onCopyFromDeal={() => setCopyFromDealDialogOpen(true)}
        />

        {/* Quote Versions Table */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Quote Scenarios</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Manage and compare different pricing scenarios for this deal. Click on Quote ID to configure details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <QuoteTable 
                quoteVersions={quoteVersions} 
                onQuoteClick={onQuoteClick}
                dealId={dealId}
              />
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
