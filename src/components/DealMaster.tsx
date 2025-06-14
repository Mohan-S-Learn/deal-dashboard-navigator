import React, { useEffect } from 'react';
import { useDealMasterData } from './DealMaster/hooks/useDealMasterData';
import { useDealMasterSave } from './DealMaster/hooks/useDealMasterSave';
import { calculateDuration } from './DealMaster/utils/dateUtils';
import { DealMasterHeader } from './DealMaster/components/DealMasterHeader';
import { TimelineSection } from './DealMaster/components/TimelineSection';
import { MarketResourcesSection } from './DealMaster/components/MarketResourcesSection';
import { DealDiscountSection } from './DealMaster/components/DealDiscountSection';
import { VolumeDiscountsTableSection } from './DealMaster/components/VolumeDiscountsTableSection';
import { CostComponentsSection } from './DealMaster/components/CostComponentsSection';
import { GeographyTableSection } from './DealMaster/components/GeographyTableSection';
import { ServiceCategoriesTableSection } from './DealMaster/components/ServiceCategoriesTableSection';
import { DealMasterProps, QuoteData, VolumeDiscountRange, SelectedCategories } from './DealMaster/types';

const DealMaster: React.FC<DealMasterProps> = ({ dealId, quoteName, onBack }) => {
  const {
    quoteData,
    setQuoteData,
    markets,
    resourceTypes,
    geographies,
    serviceCategories,
    selectedResourceTypes,
    setSelectedResourceTypes,
    selectedGeographies,
    setSelectedGeographies,
    selectedCategories,
    setSelectedCategories,
    volumeDiscounts,
    setVolumeDiscounts,
    loading,
    loadMasterData,
    loadQuoteData
  } = useDealMasterData(dealId, quoteName);

  // Add state for table data that will be managed by child components
  const [geographyTableData, setGeographyTableData] = React.useState<any[]>([]);
  const [categoryTableData, setCategoryTableData] = React.useState<any[]>([]);

  const { saveData } = useDealMasterSave();

  useEffect(() => {
    loadMasterData();
    loadQuoteData();
  }, [dealId, quoteName]);

  useEffect(() => {
    const duration = calculateDuration(
      quoteData.knowledge_transition_start_date,
      quoteData.steady_state_end_date
    );
    setQuoteData(prev => ({ ...prev, overall_duration_months: duration }));
  }, [quoteData.knowledge_transition_start_date, quoteData.steady_state_end_date]);

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

  const handleSaveData = () => {
    console.log('Saving data:', {
      quoteData,
      geographyTableData,
      categoryTableData,
      volumeDiscounts
    });

    // Convert geography table data to selected geography IDs
    const geographyIds = geographyTableData
      .filter(row => row.region && row.country && row.city)
      .map(row => {
        const geography = geographies.find(g => 
          g.region === row.region && 
          g.country === row.country && 
          g.city === row.city
        );
        return geography?.id;
      })
      .filter(id => id !== undefined);

    // Convert category table data to selected categories
    const categoryData = categoryTableData.length > 0 && categoryTableData[0].level1 ? {
      level1: categoryTableData[0].level1,
      level2: categoryTableData[0].level2,
      level3: categoryTableData[0].level3,
    } : selectedCategories;

    saveData(
      dealId,
      quoteName,
      quoteData,
      selectedResourceTypes,
      geographyIds,
      categoryData,
      volumeDiscounts
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal master data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DealMasterHeader
        dealId={dealId}
        quoteName={quoteName}
        onBack={onBack}
        onSave={handleSaveData}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        <TimelineSection
          quoteData={quoteData}
          onDateChange={handleDateChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MarketResourcesSection
            quoteData={quoteData}
            markets={markets}
            resourceTypes={resourceTypes}
            selectedResourceTypes={selectedResourceTypes}
            onMarketChange={handleMarketChange}
            onResourceTypeChange={handleResourceTypeChange}
          />

          <DealDiscountSection
            quoteData={quoteData}
            onNumberChange={handleNumberChange}
          />
        </div>

        <VolumeDiscountsTableSection
          volumeDiscounts={volumeDiscounts}
          onAddVolumeDiscount={addVolumeDiscount}
          onRemoveVolumeDiscount={removeVolumeDiscount}
          onUpdateVolumeDiscount={updateVolumeDiscount}
        />

        <CostComponentsSection
          quoteData={quoteData}
          onNumberChange={handleNumberChange}
        />

        <GeographyTableSection
          geographies={geographies}
          selectedGeographies={selectedGeographies}
          onGeographyChange={handleGeographyChange}
          onDataChange={setGeographyTableData}
        />

        <ServiceCategoriesTableSection
          serviceCategories={serviceCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          onDataChange={setCategoryTableData}
        />
      </main>
    </div>
  );
};

export default DealMaster;
