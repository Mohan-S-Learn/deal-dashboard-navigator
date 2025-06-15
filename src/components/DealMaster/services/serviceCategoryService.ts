
import { supabase } from '@/integrations/supabase/client';

export const saveServiceCategoryData = async (
  dealId: string,
  quoteName: string,
  categoryTableData: any[]
) => {
  console.log('=== PROCESSING SERVICE CATEGORY DATA ===');
  console.log('Category data type:', typeof categoryTableData);
  console.log('Category data content:', categoryTableData);
  
  // Delete existing category records
  await supabase
    .from('QuoteServiceCategory')
    .delete()
    .eq('Deal_Id', dealId)
    .eq('Quote_Name', quoteName);
  
  console.log('Deleted existing category records');

  // Process category data as array of category row objects
  if (Array.isArray(categoryTableData) && categoryTableData.length > 0) {
    const validCategoryRows = categoryTableData.filter(row => {
      const hasValidLevel1 = row && 
        row.level1 !== null && 
        row.level1 !== undefined && 
        !isNaN(Number(row.level1)) &&
        Number(row.level1) > 0;
      console.log('Category row validation:', row, 'hasValidLevel1:', hasValidLevel1);
      return hasValidLevel1;
    });

    console.log('Valid category rows for saving:', validCategoryRows);

    if (validCategoryRows.length > 0) {
      const categoryInserts = validCategoryRows.map((row, index) => {
        const insert = {
          Deal_Id: dealId,
          Quote_Name: quoteName,
          category_level_1_id: Number(row.level1),
          category_level_2_id: row.level2 && !isNaN(Number(row.level2)) && Number(row.level2) > 0 ? Number(row.level2) : null,
          category_level_3_id: row.level3 && !isNaN(Number(row.level3)) && Number(row.level3) > 0 ? Number(row.level3) : null,
        };
        console.log(`Category insert for row ${index}:`, insert);
        return insert;
      });

      console.log('Inserting category records:', categoryInserts);
      
      const { error } = await supabase
        .from('QuoteServiceCategory')
        .insert(categoryInserts);
      
      if (error) {
        console.error('Category insert error:', error);
        throw error;
      }
      
      console.log('Service category records saved successfully');
    } else {
      console.log('No valid category rows to save');
    }
  } else {
    console.log('No category data or invalid format to process');
  }
};
