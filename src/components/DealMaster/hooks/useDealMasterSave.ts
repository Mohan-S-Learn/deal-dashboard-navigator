
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
    selectedGeographies: number[],
    selectedCategories: SelectedCategories,
    volumeDiscounts: VolumeDiscountRange[]
  ) => {
    try {
      console.log('=== SAVE OPERATION START ===');
      console.log('Deal ID:', dealId);
      console.log('Quote Name:', quoteName);
      console.log('Quote data to save:', quoteData);
      
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

      // Save geographies with enhanced logging
      console.log('Saving geographies:', selectedGeographies);
      await supabase.from('QuoteGeography').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedGeographies.length > 0) {
        const geographyInserts = selectedGeographies.map(gId => ({
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
        console.log('No geographies to save');
      }

      // Save service categories with enhanced logging
      console.log('Saving service categories:', selectedCategories);
      await supabase.from('QuoteServiceCategory').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedCategories.level1 || selectedCategories.level2 || selectedCategories.level3) {
        const categoryInsert = {
          Deal_Id: dealId,
          Quote_Name: quoteName,
          category_level_1_id: selectedCategories.level1,
          category_level_2_id: selectedCategories.level2,
          category_level_3_id: selectedCategories.level3,
        };
        console.log('Inserting service category:', categoryInsert);
        const { error: catError } = await supabase.from('QuoteServiceCategory').insert(categoryInsert);
        if (catError) {
          console.error('Category insert error:', catError);
          throw catError;
        }
        console.log('Service categories saved successfully');
      } else {
        console.log('No categories to save');
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
