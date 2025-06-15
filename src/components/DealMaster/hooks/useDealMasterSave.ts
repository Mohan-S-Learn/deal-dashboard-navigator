
import { useToast } from '@/hooks/use-toast';
import { QuoteData, VolumeDiscountRange } from '../types';
import { saveQuoteData } from '../services/quoteDataService';
import { saveResourceTypes } from '../services/resourceTypeService';
import { saveGeographyData } from '../services/geographyService';
import { saveServiceCategoryData } from '../services/serviceCategoryService';
import { saveVolumeDiscounts } from '../services/volumeDiscountService';

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
      console.log('Geography table data received:', geographyTableData);
      console.log('Category table data received:', categoryTableData);

      // Save all data in sequence
      await saveQuoteData(dealId, quoteName, quoteData);
      await saveResourceTypes(dealId, quoteName, selectedResourceTypes);
      await saveGeographyData(dealId, quoteName, geographyTableData);
      await saveServiceCategoryData(dealId, quoteName, categoryTableData);
      await saveVolumeDiscounts(dealId, quoteName, volumeDiscounts);

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
