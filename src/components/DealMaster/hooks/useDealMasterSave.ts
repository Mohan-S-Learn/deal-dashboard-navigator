
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
    geographyTableData: any[],
    categoryTableData: any[],
    volumeDiscounts: VolumeDiscountRange[]
  ) => {
    try {
      console.log('=== SAVE OPERATION START ===');
      console.log('Deal ID:', dealId);
      console.log('Quote Name:', quoteName);
      console.log('Quote data to save:', quoteData);
      console.log('Geography table data received:', geographyTableData);
      console.log('Category table data received:', categoryTableData);
      
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

      // Process Geography Table Data
      console.log('=== PROCESSING GEOGRAPHY DATA ===');
      console.log('Raw geography table data:', JSON.stringify(geographyTableData, null, 2));
      
      // Delete existing geography records
      await supabase.from('QuoteGeography').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      console.log('Deleted existing geography records');

      // Filter out empty geography rows and get their IDs
      const validGeographyRows = geographyTableData.filter(row => {
        const hasData = row && row.region && row.country && row.city;
        console.log('Geography row validation:', row, 'hasData:', hasData);
        return hasData;
      });

      console.log('Valid geography rows:', validGeographyRows);

      if (validGeographyRows.length > 0) {
        // Load all geographies to find matching IDs
        const { data: allGeographies, error: geoLoadError } = await supabase
          .from('Geography')
          .select('*');
        
        if (geoLoadError) {
          console.error('Error loading geographies:', geoLoadError);
          throw geoLoadError;
        }

        console.log('Loaded geographies from database:', allGeographies);

        const geographyInserts: any[] = [];

        validGeographyRows.forEach((row, index) => {
          console.log(`Processing geography row ${index}:`, row);
          
          // Find matching geography by region, country, and city
          const geography = allGeographies?.find(g => 
            g.region?.trim().toLowerCase() === row.region.trim().toLowerCase() && 
            g.country?.trim().toLowerCase() === row.country.trim().toLowerCase() && 
            g.city?.trim().toLowerCase() === row.city.trim().toLowerCase()
          );

          if (geography) {
            console.log(`Found geography match for row ${index}:`, geography);
            geographyInserts.push({
              Deal_Id: dealId,
              Quote_Name: quoteName,
              geography_id: geography.id
            });
          } else {
            console.warn(`No geography found for row ${index}:`, row);
            console.log('Available geographies:', allGeographies?.map(g => ({ id: g.id, region: g.region, country: g.country, city: g.city })));
          }
        });

        if (geographyInserts.length > 0) {
          console.log('Inserting geography records:', geographyInserts);
          const { error: geoError } = await supabase.from('QuoteGeography').insert(geographyInserts);
          if (geoError) {
            console.error('Geography insert error:', geoError);
            throw geoError;
          }
          console.log('Geography records saved successfully');
        } else {
          console.log('No valid geography matches found to save');
        }
      } else {
        console.log('No valid geography rows to process');
      }

      // Process Service Category Table Data
      console.log('=== PROCESSING SERVICE CATEGORY DATA ===');
      console.log('Raw category table data:', JSON.stringify(categoryTableData, null, 2));
      
      // Delete existing category records
      await supabase.from('QuoteServiceCategory').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      console.log('Deleted existing category records');

      // Filter out incomplete category rows
      const validCategoryRows = categoryTableData.filter(row => {
        const hasLevel1 = row && row.level1 && row.level1 !== null && row.level1 !== '';
        console.log('Category row validation:', row, 'hasLevel1:', hasLevel1);
        return hasLevel1;
      });

      console.log('Valid category rows:', validCategoryRows);

      if (validCategoryRows.length > 0) {
        const categoryInserts = validCategoryRows.map((row, index) => {
          const insert = {
            Deal_Id: dealId,
            Quote_Name: quoteName,
            category_level_1_id: parseInt(row.level1.toString()),
            category_level_2_id: row.level2 && row.level2 !== null && row.level2 !== '' ? parseInt(row.level2.toString()) : null,
            category_level_3_id: row.level3 && row.level3 !== null && row.level3 !== '' ? parseInt(row.level3.toString()) : null,
          };
          console.log(`Category insert for row ${index}:`, insert);
          return insert;
        });

        console.log('Inserting category records:', categoryInserts);
        const { error: catError } = await supabase.from('QuoteServiceCategory').insert(categoryInserts);
        if (catError) {
          console.error('Category insert error:', catError);
          throw catError;
        }
        console.log('Service category records saved successfully');
      } else {
        console.log('No valid category rows to process');
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
