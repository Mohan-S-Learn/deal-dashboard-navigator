
import { supabase } from '@/integrations/supabase/client';

export const saveGeographyData = async (
  dealId: string,
  quoteName: string,
  geographyTableData: any[]
) => {
  console.log('=== PROCESSING GEOGRAPHY DATA ===');
  console.log('Geography data type:', typeof geographyTableData);
  console.log('Geography data content:', geographyTableData);
  
  // Delete existing geography records
  await supabase
    .from('QuoteGeography')
    .delete()
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);
  
  console.log('Deleted existing geography records');

  // Process geography data as array of geography IDs
  if (Array.isArray(geographyTableData) && geographyTableData.length > 0) {
    // Filter out null/invalid geography IDs
    const validGeographyIds = geographyTableData.filter(id => 
      id !== null && id !== undefined && !isNaN(Number(id)) && Number(id) > 0
    ).map(id => Number(id));

    console.log('Valid geography IDs for saving:', validGeographyIds);

    if (validGeographyIds.length > 0) {
      const geographyInserts = validGeographyIds.map(geoId => ({
        Deal_Id: dealId,
        Quote_Name: quoteName,
        geography_id: geoId
      }));

      console.log('Inserting geography records:', geographyInserts);
      
      const { error } = await supabase
        .from('QuoteGeography')
        .insert(geographyInserts);
      
      if (error) {
        console.error('Geography insert error:', error);
        throw error;
      }
      
      console.log('Geography records saved successfully');
    } else {
      console.log('No valid geography IDs to save');
    }
  } else {
    console.log('No geography data or invalid format to process');
  }
};
