
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
    loading,
    loadMasterData,
    loadQuoteData
  } = useDealMasterData(dealId, quoteName);

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
  } = useDealMasterState(dealId, quoteName);

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
    loadMasterData();
    loadQuoteData();
  }, [dealId, quoteName]);

  const handleSaveData = () => {
    console.log('=== SAVE DATA DEBUG ===');
    console.log('Raw geography table data:', geographyTableData);
    console.log('Raw category table data:', categoryTableData);

    // Pass the table data directly to the save function
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

  if (loading) {
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
