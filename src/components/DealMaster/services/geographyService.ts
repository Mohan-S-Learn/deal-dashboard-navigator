
import { supabase } from '@/integrations/supabase/client';

export const saveGeographyData = async (
  dealId: string,
  quoteName: string,
  geographyTableData: any[]
) => {
  console.log('=== GEOGRAPHY SERVICE - PROCESSING DATA ===');
  console.log('Deal ID:', dealId);
  console.log('Quote Name:', quoteName);
  console.log('Geography data received:', geographyTableData);
  console.log('Geography data type:', typeof geographyTableData);
  console.log('Is array:', Array.isArray(geographyTableData));
  console.log('Array length:', geographyTableData?.length);
  
  // Delete existing geography records
  console.log('Deleting existing geography records...');
  const { error: deleteError } = await supabase
    .from('QuoteGeography')
    .delete()
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);
  
  if (deleteError) {
    console.error('Error deleting existing geography records:', deleteError);
    throw deleteError;
  }
  
  console.log('Successfully deleted existing geography records');

  // Process geography data - expect array of geography IDs
  if (Array.isArray(geographyTableData) && geographyTableData.length > 0) {
    console.log('Processing geography data array...');
    
    // Filter out null/invalid geography IDs and convert to numbers
    const validGeographyIds = geographyTableData
      .filter(id => {
        const isValid = id !== null && id !== undefined && !isNaN(Number(id)) && Number(id) > 0;
        console.log(`Geography ID ${id} (type: ${typeof id}) is valid: ${isValid}`);
        return isValid;
      })
      .map(id => {
        const numId = Number(id);
        console.log(`Converting ${id} to number: ${numId}`);
        return numId;
      });

    console.log('Valid geography IDs for saving:', validGeographyIds);

    if (validGeographyIds.length > 0) {
      const geographyInserts = validGeographyIds.map((geoId, index) => {
        const insert = {
          Deal_Id: dealId,
          Quote_Name: quoteName,
          geography_id: geoId
        };
        console.log(`Creating insert record ${index + 1}:`, insert);
        return insert;
      });

      console.log('Final insert array:', geographyInserts);
      
      const { data, error: insertError } = await supabase
        .from('QuoteGeography')
        .insert(geographyInserts)
        .select();
      
      if (insertError) {
        console.error('Geography insert error:', insertError);
        throw insertError;
      }
      
      console.log('Geography records saved successfully:', data);
    } else {
      console.log('No valid geography IDs to save after filtering');
    }
  } else {
    console.log('No geography data or invalid format to process');
    console.log('Expected: array of geography IDs, received:', geographyTableData);
  }

  console.log('=== GEOGRAPHY SERVICE - COMPLETED ===');
};
