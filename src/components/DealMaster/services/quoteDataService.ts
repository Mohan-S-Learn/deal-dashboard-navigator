
import { supabase } from '@/integrations/supabase/client';
import { QuoteData } from '../types';
import { formatDateForDatabase } from '../utils/dateFormatter';

export const saveQuoteData = async (
  dealId: string,
  quoteName: string,
  quoteData: QuoteData
) => {
  console.log('Updating quote data...');
  
  const formattedQuoteData = {
    knowledge_transition_start_date: formatDateForDatabase(quoteData.knowledge_transition_start_date),
    knowledge_transition_end_date: formatDateForDatabase(quoteData.knowledge_transition_end_date),
    steady_state_start_date: formatDateForDatabase(quoteData.steady_state_start_date),
    steady_state_end_date: formatDateForDatabase(quoteData.steady_state_end_date),
    overall_duration_months: quoteData.overall_duration_months,
    market_id: quoteData.market_id,
    deal_discount_amount: quoteData.deal_discount_amount,
    deal_discount_percent: quoteData.deal_discount_percent,
    travel_percent: quoteData.travel_percent,
    training_percent: quoteData.training_percent,
    other_costs_percent: quoteData.other_costs_percent,
    infrastructure_percent: quoteData.infrastructure_percent,
    compliance_percent: quoteData.compliance_percent,
    licenses_percent: quoteData.licenses_percent,
  };

  console.log('Formatted quote data for database:', formattedQuoteData);

  const { error } = await supabase
    .from('Quotes')
    .update(formattedQuoteData)
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);

  if (error) {
    console.error('Quote update error:', error);
    throw error;
  }
  
  console.log('Quote data updated successfully');
};
