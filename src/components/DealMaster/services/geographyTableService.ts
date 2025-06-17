
import { supabase } from '@/integrations/supabase/client';
import { GeographyRowData } from '../hooks/types/geographyTableTypes';

export const loadExistingGeographyData = async (dealId: string, quoteName: string): Promise<GeographyRowData[]> => {
  console.log('Geography Service - Loading existing data for:', { dealId, quoteName });
  
  const { data: existingGeographies, error } = await supabase
    .from('QuoteGeography')
    .select(`
      geography_id,
      Geography (
        id,
        region,
        country,
        city
      )
    `)
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);

  if (error) {
    console.error('Geography Service - Error loading existing data:', error);
    throw error;
  }

  if (existingGeographies && existingGeographies.length > 0) {
    console.log('Geography Service - Found existing data:', existingGeographies);
    
    const loadedRows = existingGeographies.map((item, index) => {
      const geo = item.Geography as any;
      const row = {
        id: (index + 1).toString(),
        geographyId: item.geography_id,
        region: geo?.region || '',
        country: geo?.country || '',
        city: geo?.city || ''
      };
      console.log('Geography Service - Creating loaded row:', row);
      return row;
    });
    
    console.log('Geography Service - Returning loaded rows:', loadedRows);
    return loadedRows;
  }

  console.log('Geography Service - No existing data found');
  return [];
};
