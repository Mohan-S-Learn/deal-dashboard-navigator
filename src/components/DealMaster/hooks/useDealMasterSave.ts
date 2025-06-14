
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
      // Update quote data
      const { error: quoteError } = await supabase
        .from('Quotes')
        .update({
          knowledge_transition_start_date: quoteData.knowledge_transition_start_date?.toISOString().split('T')[0],
          knowledge_transition_end_date: quoteData.knowledge_transition_end_date?.toISOString().split('T')[0],
          steady_state_start_date: quoteData.steady_state_start_date?.toISOString().split('T')[0],
          steady_state_end_date: quoteData.steady_state_end_date?.toISOString().split('T')[0],
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
        })
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (quoteError) throw quoteError;

      // Save resource types
      await supabase.from('QuoteResourceType').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedResourceTypes.length > 0) {
        const resourceTypeInserts = selectedResourceTypes.map(rtId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          resource_type_id: rtId
        }));
        await supabase.from('QuoteResourceType').insert(resourceTypeInserts);
      }

      // Save geographies
      await supabase.from('QuoteGeography').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedGeographies.length > 0) {
        const geographyInserts = selectedGeographies.map(gId => ({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          geography_id: gId
        }));
        await supabase.from('QuoteGeography').insert(geographyInserts);
      }

      // Save service categories
      await supabase.from('QuoteServiceCategory').delete().eq('Deal_Id', dealId).eq('Quote_Name', quoteName);
      if (selectedCategories.level1 || selectedCategories.level2 || selectedCategories.level3) {
        await supabase.from('QuoteServiceCategory').insert({
          Deal_Id: dealId,
          Quote_Name: quoteName,
          category_level_1_id: selectedCategories.level1,
          category_level_2_id: selectedCategories.level2,
          category_level_3_id: selectedCategories.level3,
        });
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
        await supabase.from('VolumeDiscount').insert(volumeInserts);
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
