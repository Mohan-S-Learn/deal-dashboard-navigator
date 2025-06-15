
import { QuoteData, VolumeDiscountRange, SelectedCategories } from '../types';

export const useDealMasterHandlers = (
  setQuoteData: React.Dispatch<React.SetStateAction<QuoteData>>,
  setSelectedResourceTypes: React.Dispatch<React.SetStateAction<number[]>>,
  setSelectedGeographies: React.Dispatch<React.SetStateAction<number[]>>,
  setSelectedCategories: React.Dispatch<React.SetStateAction<SelectedCategories>>,
  setVolumeDiscounts: React.Dispatch<React.SetStateAction<VolumeDiscountRange[]>>,
  volumeDiscounts: VolumeDiscountRange[]
) => {
  const handleDateChange = (field: keyof QuoteData, date: Date | undefined) => {
    console.log('Date change:', field, date);
    setQuoteData(prev => ({ ...prev, [field]: date || null }));
  };

  const handleNumberChange = (field: keyof QuoteData, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setQuoteData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleMarketChange = (marketId: number) => {
    setQuoteData(prev => ({ ...prev, market_id: marketId }));
  };

  const handleResourceTypeChange = (resourceTypeId: number, checked: boolean) => {
    setSelectedResourceTypes(prev => 
      checked 
        ? [...prev, resourceTypeId]
        : prev.filter(id => id !== resourceTypeId)
    );
  };

  const handleGeographyChange = (geographyId: number, checked: boolean) => {
    setSelectedGeographies(prev => 
      checked 
        ? [...prev, geographyId]
        : prev.filter(id => id !== geographyId)
    );
  };

  const handleCategoryChange = (level: keyof SelectedCategories, value: number | null) => {
    setSelectedCategories(prev => {
      const newCategories = { ...prev, [level]: value };
      
      // Reset child categories when parent changes
      if (level === 'level1') {
        newCategories.level2 = null;
        newCategories.level3 = null;
      } else if (level === 'level2') {
        newCategories.level3 = null;
      }
      
      return newCategories;
    });
  };

  const addVolumeDiscount = () => {
    const lastRange = volumeDiscounts[volumeDiscounts.length - 1];
    const newStart = lastRange ? (lastRange.range_end || 0) + 1 : 0;
    
    setVolumeDiscounts(prev => [...prev, {
      range_start: newStart,
      range_end: null,
      discount_percent: 0
    }]);
  };

  const removeVolumeDiscount = (index: number) => {
    setVolumeDiscounts(prev => prev.filter((_, i) => i !== index));
  };

  const updateVolumeDiscount = (index: number, field: keyof VolumeDiscountRange, value: number) => {
    setVolumeDiscounts(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return {
    handleDateChange,
    handleNumberChange,
    handleMarketChange,
    handleResourceTypeChange,
    handleGeographyChange,
    handleCategoryChange,
    addVolumeDiscount,
    removeVolumeDiscount,
    updateVolumeDiscount,
  };
};
