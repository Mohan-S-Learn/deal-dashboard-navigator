import React, { useEffect } from 'react';
import { useDealMasterData } from './DealMaster/hooks/useDealMasterData';
import { useDealMasterSave } from './DealMaster/hooks/useDealMasterSave';
import { useDealMasterState } from './DealMaster/hooks/useDealMasterState';
import { useDealMasterHandlers } from './DealMaster/hooks/useDealMasterHandlers';
import { DealMasterHeader } from './DealMaster/components/DealMasterHeader';
import { DealMasterContent } from './DealMaster/components/DealMasterContent';
import { DealMasterLoadingState } from './DealMaster/components/DealMasterLoadingState';
import { DealMasterProps } from './DealMaster/types';

const DealMaster: React.FC<DealMasterProps> = ({ dealId, quoteName, onBack }) => {
  const {
    markets,
    resourceTypes,
    geographies,
    serviceCategories,
    quoteData: loadedQuoteData,
    selectedResourceTypes: loadedResourceTypes,
    selectedGeographies: loadedGeographies,
    selectedCategories: loadedCategories,
    volumeDiscounts: loadedVolumeDiscounts,
    loading,
    masterDataLoaded,
    loadMasterData,
    loadQuoteData
  } = useDealMasterData(dealId, quoteName);

  console.log('DealMaster - Loaded data:', {
    loadedQuoteData,
    loadedResourceTypes,
    loadedGeographies,
    loadedCategories,
    loadedVolumeDiscounts,
    masterDataLoaded,
    loading
  });

  const {
    quoteData,
    setQuoteData,
    selectedResourceTypes,
    setSelectedResourceTypes,
    selectedGeographies,
    setSelectedGeographies,
    selectedCategories,
    setSelectedCategories,
    volumeDiscounts,
    setVolumeDiscounts,
    geographyTableData,
    setGeographyTableData,
    categoryTableData,
    setCategoryTableData,
  } = useDealMasterState(
    dealId, 
    quoteName,
    loadedQuoteData,
    loadedResourceTypes,
    loadedGeographies,
    loadedCategories,
    loadedVolumeDiscounts
  );

  console.log('DealMaster - Current state data:', {
    quoteData,
    selectedResourceTypes,
    selectedGeographies,
    selectedCategories,
    volumeDiscounts
  });

  const {
    handleDateChange,
    handleNumberChange,
    handleMarketChange,
    handleResourceTypeChange,
    handleGeographyChange,
    handleCategoryChange,
    addVolumeDiscount,
    removeVolumeDiscount,
    updateVolumeDiscount,
  } = useDealMasterHandlers(
    setQuoteData,
    setSelectedResourceTypes,
    setSelectedGeographies,
    setSelectedCategories,
    setVolumeDiscounts,
    volumeDiscounts
  );

  const { saveData } = useDealMasterSave();

  useEffect(() => {
    console.log('DealMaster - Loading data for:', { dealId, quoteName });
    loadMasterData();
  }, [dealId, quoteName]);

  useEffect(() => {
    if (masterDataLoaded) {
      loadQuoteData();
    }
  }, [masterDataLoaded, dealId, quoteName]);

  const handleSaveData = () => {
    console.log('=== DEAL MASTER - SAVE DATA DEBUG ===');
    console.log('Deal ID:', dealId);
    console.log('Quote Name:', quoteName);
    console.log('Raw geography table data:', geographyTableData);
    console.log('Raw geography table data type:', typeof geographyTableData);
    console.log('Raw geography table data is array:', Array.isArray(geographyTableData));
    console.log('Raw geography table data length:', geographyTableData?.length);
    console.log('Raw geography table data content:', JSON.stringify(geographyTableData, null, 2));
    console.log('Raw category table data:', categoryTableData);
    console.log('Quote data:', quoteData);
    console.log('Selected resource types:', selectedResourceTypes);
    console.log('Volume discounts:', volumeDiscounts);

    saveData(
      dealId,
      quoteName,
      quoteData,
      selectedResourceTypes,
      geographyTableData,
      categoryTableData,
      volumeDiscounts
    );
  };

  // Show loading until both master data and quote data are loaded
  if (loading || !masterDataLoaded) {
    return <DealMasterLoadingState />;
  }

  // Ensure all required data arrays are properly initialized before rendering
  if (!Array.isArray(markets) || !Array.isArray(resourceTypes) || !Array.isArray(geographies) || !Array.isArray(serviceCategories)) {
    console.error('DealMaster - Data arrays not properly initialized:', { markets, resourceTypes, geographies, serviceCategories });
    return <DealMasterLoadingState />;
  }

  return (
    <div className="min-h-screen">
      <DealMasterHeader
        dealId={dealId}
        quoteName={quoteName}
        onBack={onBack}
        onSave={handleSaveData}
      />

      <DealMasterContent
        quoteData={quoteData}
        markets={markets}
        resourceTypes={resourceTypes}
        geographies={geographies}
        serviceCategories={serviceCategories}
        selectedResourceTypes={selectedResourceTypes}
        selectedGeographies={selectedGeographies}
        selectedCategories={selectedCategories}
        volumeDiscounts={volumeDiscounts}
        onDateChange={handleDateChange}
        onNumberChange={handleNumberChange}
        onMarketChange={handleMarketChange}
        onResourceTypeChange={handleResourceTypeChange}
        onGeographyChange={handleGeographyChange}
        onCategoryChange={handleCategoryChange}
        onAddVolumeDiscount={addVolumeDiscount}
        onRemoveVolumeDiscount={removeVolumeDiscount}
        onUpdateVolumeDiscount={updateVolumeDiscount}
        onGeographyDataChange={setGeographyTableData}
        onCategoryDataChange={setCategoryTableData}
      />
    </div>
  );
};

export default DealMaster;
