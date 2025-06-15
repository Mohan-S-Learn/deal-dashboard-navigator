
import { supabase } from '@/integrations/supabase/client';
import { VolumeDiscountRange } from '../types';

export const saveVolumeDiscounts = async (
  dealId: string,
  quoteName: string,
  volumeDiscounts: VolumeDiscountRange[]
) => {
  console.log('Saving volume discounts:', volumeDiscounts);
  
  // Delete existing records
  await supabase
    .from('VolumeDiscount')
    .delete()
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);
  
  // Insert new records if any exist
  if (volumeDiscounts.length > 0) {
    const volumeInserts = volumeDiscounts.map(vd => ({
      Deal_Id: dealId,
      Quote_Name: quoteName,
      range_start: vd.range_start,
      range_end: vd.range_end,
      discount_percent: vd.discount_percent
    }));
    
    console.log('Inserting volume discounts:', volumeInserts);
    
    const { error } = await supabase
      .from('VolumeDiscount')
      .insert(volumeInserts);
    
    if (error) {
      console.error('Volume discount insert error:', error);
      throw error;
    }
  }
  
  console.log('Volume discounts saved successfully');
};
