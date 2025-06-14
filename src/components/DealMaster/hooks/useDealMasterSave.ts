
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
      console.log('Saving quote data:', quoteData);
      
      // Format dates properly - ensure they're valid dates before converting
      const formatDate = (date: Date | null) => {
        if (!date) {
          console.log('Date is null or undefined');
          return null;
        }
        
        // Check if it's a valid Date object
        if (!(date instanceof Date)) {
          console.log('Date is not a Date object:', date);
          return null;
        }
        
        if (isNaN(date.getTime())) {
          console.log('Date is invalid:', date);
          return null;
        }
        
        const formatted = date.toISOString().split('T')[0];
        console.log('Formatted date:', date, '->', formatted);
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

      console.log('Formatted quote data for saving:', formattedQuoteData);

      // Update quote data
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
      await supabase.from('QuoteResourceType').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedResourceTypes.length > 0) {
        const resourceTypeInserts = selectedResourceTypes.map(rtId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          resource_type_id: rtId
        }));
        console.log('Saving resource types:', resourceTypeInserts);
        const { error: rtError } = await supabase.from('QuoteResourceType').insert(resourceTypeInserts);
        if (rtError) {
          console.error('Resource type insert error:', rtError);
          throw rtError;
        }
      }

      // Save geographies
      await supabase.from('QuoteGeography').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedGeographies.length > 0) {
        const geographyInserts = selectedGeographies.map(gId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          geography_id: gId
        }));
        console.log('Saving geographies:', geographyInserts);
        const { error: geoError } = await supabase.from('QuoteGeography').insert(geographyInserts);
        if (geoError) {
          console.error('Geography insert error:', geoError);
          throw geoError;
        }
      }

      // Save service categories
      await supabase.from('QuoteServiceCategory').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedCategories.level1 || selectedCategories.level2 || selectedCategories.level3) {
        const categoryInsert = {
          Deal_Id: dealId,
          Quote_Name: quoteName,
          category_level_1_id: selectedCategories.level1,
          category_level_2_id: selectedCategories.level2,
          category_level_3_id: selectedCategories.level3,
        };
        console.log('Saving service categories:', categoryInsert);
        const { error: catError } = await supabase.from('QuoteServiceCategory').insert(categoryInsert);
        if (catError) {
          console.error('Category insert error:', catError);
          throw catError;
        }
      }

      // Save volume discounts
      await supabase.from('VolumeDiscount').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (volumeDiscounts.length > 0) {
        const volumeInserts = volumeDiscounts.map(vd => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          range_start: vd.range_start,
          range_end: vd.range_end,
          discount_percent: vd.discount_percent
        }));
        console.log('Saving volume discounts:', volumeInserts);
        const { error: volError } = await supabase.from('VolumeDiscount').insert(volumeInserts);
        if (volError) {
          console.error('Volume discount insert error:', volError);
          throw volError;
        }
      }

      toast({
        title: "Success",
        description: "Deal master data saved successfully",
      });

    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save deal master data",
        variant: "destructive"
      });
    }
  };

  return { saveData };
};
