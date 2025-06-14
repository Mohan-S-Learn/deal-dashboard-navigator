
import { supabase } from '@/integrations/supabase/client';

// Helper function to generate unique Quote ID with simple format
export const generateUniqueQuoteId = async (dealId: string) => {
  try {
    // Query the database to get all existing Quote_IDs for this deal
    const { data: existingQuotes, error } = await supabase
      .from('Quotes')
      .select('Quote_ID')
      .eq('Deal_Id', dealId)
      .not('Quote_ID', 'is', null);

    if (error) {
      console.error('Error fetching existing Quote_IDs:', error);
      // Fallback to basic numbering if database query fails
      return `${dealId}-QT-001`;
    }

    console.log('Existing Quote_IDs for deal', dealId, ':', existingQuotes);

    // Extract the numeric parts and find the highest number
    const existingIds = existingQuotes
      .map(q => q.Quote_ID)
      .filter(id => id && id.startsWith(`${dealId}-QT-`));

    const numbers = existingIds
      .map(id => {
        const match = id.match(/QT-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => !isNaN(num));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;
    
    const newQuoteId = `${dealId}-QT-${nextNumber.toString().padStart(3, '0')}`;
    console.log('Generated new Quote_ID:', newQuoteId);
    
    return newQuoteId;
  } catch (error) {
    console.error('Error in generateUniqueQuoteId:', error);
    // Fallback to basic numbering
    return `${dealId}-QT-001`;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
