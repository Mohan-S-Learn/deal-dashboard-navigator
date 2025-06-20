
import { supabase } from '@/integrations/supabase/client';
import { mockDeals } from '../data/mockData';

export const syncDealsToDatabase = async (): Promise<boolean> => {
  try {
    console.log('=== STARTING DEALS SYNC ===');
    console.log('Mock deals to potentially sync:', mockDeals.length);
    
    // Step 1: Check if deals already exist
    console.log('Step 1: Checking existing deals in database...');
    const { data: existingDeals, error: checkError } = await supabase
      .from('Deals')
      .select('Deal_Id');

    if (checkError) {
      console.error('Error checking existing deals:', checkError);
      return false;
    }

    const existingDealIds = existingDeals?.map(deal => deal.Deal_Id) || [];
    console.log('Existing deal IDs in database:', existingDealIds);

    // Step 2: Filter out deals that already exist
    const dealsToInsert = mockDeals.filter(deal => {
      const exists = existingDealIds.includes(deal.id);
      console.log(`Deal ${deal.id}: ${exists ? 'EXISTS' : 'NEW'}`);
      return !exists;
    });

    if (dealsToInsert.length === 0) {
      console.log('All deals already exist in database, no sync needed');
      return true;
    }

    console.log(`Step 2: ${dealsToInsert.length} deals need to be inserted`);

    // Step 3: Prepare data for insertion
    const dealsData = dealsToInsert.map(deal => {
      const dealData = {
        Deal_Id: deal.id,
        Deal_Name: deal.name,
        Deal_Owner: deal.dealOwner,
        Status: deal.status,
        Total_Revenue: deal.totalRevenue,
        'Margin%': deal.marginPercent,
        Created_Date: deal.createdDate
      };
      console.log('Prepared deal data:', dealData);
      return dealData;
    });

    // Step 4: Insert new deals
    console.log('Step 3: Inserting deals into database...');
    const { data: insertedData, error: insertError } = await supabase
      .from('Deals')
      .insert(dealsData)
      .select();

    if (insertError) {
      console.error('Error inserting deals:', insertError);
      console.error('Insert error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      return false;
    }

    console.log(`Successfully synced ${dealsToInsert.length} deals to database`);
    console.log('Inserted deals:', insertedData);
    console.log('=== DEALS SYNC COMPLETED ===');
    return true;
  } catch (error) {
    console.error('Unexpected error in syncDealsToDatabase:', error);
    return false;
  }
};

// Test function to verify database connectivity
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing database connection...');
    const { data, error } = await supabase
      .from('Deals')
      .select('count', { count: 'exact' });
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('Database connection successful. Deal count:', data);
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
};
