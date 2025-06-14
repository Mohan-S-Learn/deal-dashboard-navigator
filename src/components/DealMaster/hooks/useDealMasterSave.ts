
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QuoteData, SelectedCategories, VolumeDiscountRange } from '../types';

export const useDealMasterSave = () => {
  const { toast } = useToast();

  const saveData = async (
    dealId: string,
    quoteName: string,
    quoteData: QuoteData,
    selectedResourceTypes: number[],
    geographyTableData: any[], // Changed to accept table data directly
    categoryTableData: any[], // Changed to accept table data directly
    volumeDiscounts: VolumeDiscountRange[]
  ) => {
    try {
      console.log('=== SAVE OPERATION START ===');
      console.log('Deal ID:', dealId);
      console.log('Quote Name:', quoteName);
      console.log('Quote data to save:', quoteData);
      console.log('Geography table data:', geographyTableData);
      console.log('Category table data:', categoryTableData);
      
      // Enhanced date formatting with better validation
      const formatDate = (date: Date | null) => {
        console.log('Formatting date:', date, 'Type:', typeof date);
        
        if (!date) {
          console.log('Date is null or undefined');
          return null;
        }
        
        // Handle string dates that might come from inputs
        if (typeof date === 'string') {
          console.log('Date is string, converting to Date object');
          const parsedDate = new Date(date);
          if (isNaN(parsedDate.getTime())) {
            console.log('String date is invalid:', date);
            return null;
          }
          date = parsedDate;
        }
        
        // Handle Date objects that have custom structure (from date pickers)
        if (date && typeof date === 'object' && '_type' in date && date._type === 'Date') {
          console.log('Date has custom structure, extracting value');
          const dateValue = (date as any).value;
          if (dateValue && dateValue.iso) {
            date = new Date(dateValue.iso);
          } else if (dateValue && typeof dateValue === 'number') {
            date = new Date(dateValue);
          } else {
            console.log('Cannot parse custom date structure:', date);
            return null;
          }
        }
        
        // Check if it's a valid Date object
        if (!(date instanceof Date)) {
          console.log('Date is not a Date object:', date, 'Type:', typeof date);
          return null;
        }
        
        if (isNaN(date.getTime())) {
          console.log('Date object is invalid:', date);
          return null;
        }
        
        // Format to YYYY-MM-DD for database
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        
        console.log('Successfully formatted date:', date, '->', formatted);
        return formatted;
      };

      const formattedQuoteData = {
        knowledge_transition_start_date: formatDate(quoteData.knowledge_transition_start_date),
        knowledge_transition_end_date: formatDate(quoteData.knowledge_transition_end_date),
        steady_state_start_date: formatDate(quoteData.steady_state_start_date),
        steady_state_end_date: formatDate(quoteData.steady_state_end_date),
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

      // Update quote data
      console.log('Updating quote data...');
      const { error: quoteError } = await supabase
        .from('Quotes')
        .update(formattedQuoteData)
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (quoteError) {
        console.error('Quote update error:', quoteError);
        throw quoteError;
      }
      console.log('Quote data updated successfully');

      // Save resource types
      console.log('Saving resource types:', selectedResourceTypes);
      await supabase.from('QuoteResourceType').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedResourceTypes.length > 0) {
        const resourceTypeInserts = selectedResourceTypes.map(rtId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          resource_type_id: rtId
        }));
        console.log('Inserting resource types:', resourceTypeInserts);
        const { error: rtError } = await supabase.from('QuoteResourceType').insert(resourceTypeInserts);
        if (rtError) {
          console.error('Resource type insert error:', rtError);
          throw rtError;
        }
        console.log('Resource types saved successfully');
      }

      // Load all geographies to match against table data
      console.log('Loading all geographies for matching...');
      const { data: allGeographies, error: geoLoadError } = await supabase
        .from('Geography')
        .select('*');
      
      if (geoLoadError) {
        console.error('Error loading geographies:', geoLoadError);
        throw geoLoadError;
      }

      // Process geography table data to get geography IDs
      console.log('Processing geography table data:', geographyTableData);
      const geographyIds: number[] = [];
      
      geographyTableData.forEach((row, index) => {
        console.log(`Processing geography row ${index}:`, row);
        
        if (row.region && row.country && row.city) {
          // Try exact match first
          let geography = allGeographies?.find(g => 
            g.region?.trim().toLowerCase() === row.region.trim().toLowerCase() && 
            g.country?.trim().toLowerCase() === row.country.trim().toLowerCase() && 
            g.city?.trim().toLowerCase() === row.city.trim().toLowerCase()
          );

          // If no exact match, try without region
          if (!geography) {
            geography = allGeographies?.find(g => 
              g.country?.trim().toLowerCase() === row.country.trim().toLowerCase() && 
              g.city?.trim().toLowerCase() === row.city.trim().toLowerCase()
            );
          }

          if (geography) {
            console.log(`Found geography match for row ${index}:`, geography);
            geographyIds.push(geography.id);
          } else {
            console.warn(`No geography found for row ${index}:`, row);
          }
        } else {
          console.warn(`Incomplete geography data in row ${index}:`, row);
        }
      });

      // Save geographies
      console.log('Saving geographies with IDs:', geographyIds);
      await supabase.from('QuoteGeography').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (geographyIds.length > 0) {
        const geographyInserts = geographyIds.map(gId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          geography_id: gId
        }));
        console.log('Inserting geographies:', geographyInserts);
        const { error: geoError } = await supabase.from('QuoteGeography').insert(geographyInserts);
        if (geoError) {
          console.error('Geography insert error:', geoError);
          throw geoError;
        }
        console.log('Geographies saved successfully');
      } else {
        console.log('No valid geographies to save');
      }

      // Process all service category rows - save each one individually
      console.log('Processing service category table data:', categoryTableData);
      await supabase.from('QuoteServiceCategory').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      
      const validCategoryInserts: any[] = [];
      categoryTableData.forEach((row, index) => {
        console.log(`Processing category row ${index}:`, row);
        
        if (row.level1) {
          const categoryInsert = {
            Deal_Id: dealId,
            Quote_Name: quoteName,
            category_level_1_id: row.level1,
            category_level_2_id: row.level2 || null,
            category_level_3_id: row.level3 || null,
          };
          validCategoryInserts.push(categoryInsert);
          console.log(`Added category insert for row ${index}:`, categoryInsert);
        } else {
          console.warn(`No level1 category in row ${index}:`, row);
        }
      });

      if (validCategoryInserts.length > 0) {
        console.log('Inserting service categories:', validCategoryInserts);
        const { error: catError } = await supabase.from('QuoteServiceCategory').insert(validCategoryInserts);
        if (catError) {
          console.error('Category insert error:', catError);
          throw catError;
        }
        console.log('Service categories saved successfully');
      } else {
        console.log('No valid categories to save');
      }

      // Save volume discounts
      console.log('Saving volume discounts:', volumeDiscounts);
      await supabase.from('VolumeDiscount').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (volumeDiscounts.length > 0) {
        const volumeInserts = volumeDiscounts.map(vd => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          range_start: vd.range_start,
          range_end: vd.range_end,
          discount_percent: vd.discount_percent
        }));
        console.log('Inserting volume discounts:', volumeInserts);
        const { error: volError } = await supabase.from('VolumeDiscount').insert(volumeInserts);
        if (volError) {
          console.error('Volume discount insert error:', volError);
          throw volError;
        }
        console.log('Volume discounts saved successfully');
      }

      console.log('=== SAVE OPERATION COMPLETED SUCCESSFULLY ===');
      toast({
        title: "Success",
        description: "Deal master data saved successfully",
      });

    } catch (error) {
      console.error('=== SAVE OPERATION FAILED ===');
      console.error('Error details:', error);
      toast({
        title: "Error",
        description: "Failed to save deal master data",
        variant: "destructive"
      });
    }
  };

  return { saveData };
};
