
import { supabase } from '@/integrations/supabase/client';
import { mockDeals } from '../data/mockData';

export const syncDealsToDatabase = async (): Promise<boolean> => {
  try {
    console.log('Starting sync deals to database...');
    
    // Check if deals already exist
    const { data: existingDeals, error: checkError } = await supabase
      .from('Deals')
      .select('Deal_Id');

    if (checkError) {
      console.error('Error checking existing deals:', checkError);
      return false;
    }

    const existingDealIds = existingDeals?.map(deal => deal.Deal_Id) || [];
    console.log('Existing deal IDs:', existingDealIds);

    // Filter out deals that already exist
    const dealsToInsert = mockDeals.filter(deal => !existingDealIds.includes(deal.id));

    if (dealsToInsert.length === 0) {
      console.log('All deals already exist in database');
      return true;
    }

    console.log('Deals to insert:', dealsToInsert.length);

    // Insert new deals
    const dealsData = dealsToInsert.map(deal => ({
      Deal_Id: deal.id,
      Deal_Name: deal.name,
      Deal_Owner: deal.dealOwner,
      Status: deal.status,
      Total_Revenue: deal.totalRevenue,
      'Margin%': deal.marginPercent,
      Created_Date: deal.createdDate
    }));

    console.log('Inserting deals data:', dealsData);

    const { error: insertError } = await supabase
      .from('Deals')
      .insert(dealsData);

    if (insertError) {
      console.error('Error inserting deals:', insertError);
      return false;
    }

    console.log(`Successfully synced ${dealsToInsert.length} deals to database`);
    return true;
  } catch (error) {
    console.error('Error syncing deals:', error);
    return false;
  }
};
