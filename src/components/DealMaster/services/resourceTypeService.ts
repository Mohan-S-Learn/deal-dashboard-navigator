
import { supabase } from '@/integrations/supabase/client';

export const saveResourceTypes = async (
  dealId: string,
  quoteName: string,
  selectedResourceTypes: number[]
) => {
  console.log('Saving resource types:', selectedResourceTypes);
  
  // Delete existing records
  await supabase
    .from('QuoteResourceType')
    .delete()
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);
  
  // Insert new records if any selected
  if (selectedResourceTypes.length > 0) {
    const resourceTypeInserts = selectedResourceTypes.map(rtId => ({
      Deal_Id: dealId,
      Quote_Name: quoteName,
      resource_type_id: rtId
    }));
    
    console.log('Inserting resource types:', resourceTypeInserts);
    
    const { error } = await supabase
      .from('QuoteResourceType')
      .insert(resourceTypeInserts);
    
    if (error) {
      console.error('Resource type insert error:', error);
      throw error;
    }
  }
  
  console.log('Resource types saved successfully');
};
