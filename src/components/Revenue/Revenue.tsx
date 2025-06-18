
import React, { useState } from 'react';
import { RevenueProps } from './types';
import { useRevenueData } from './hooks/useRevenueData';
import { useRevenueOperations } from './hooks/useRevenueOperations';
import { RevenueHeader } from './components/RevenueHeader';
import { RevenueContent } from './components/RevenueContent';
import { RevenueLoadingState } from './components/RevenueLoadingState';
import { AddRevenueDialog } from './components/AddRevenueDialog';

const Revenue: React.FC<RevenueProps> = ({ dealId, quoteName, onBack }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    revenueData,
    setRevenueData,
    costCategories,
    serviceCategories,
    geographies,
    selectedGeographies,
    loading
  } = useRevenueData(dealId, quoteName);

  const {
    handleAddRevenue,
    handleUpdateRevenue,
    handleDeleteRevenue
  } = useRevenueOperations(setRevenueData);

  const onAddRevenue = async (revenue: Omit<import('./types').QuoteRevenue, 'id'>) => {
    const success = await handleAddRevenue(revenue);
    if (success) {
      setShowAddDialog(false);
    }
  };

  if (loading) {
    return <RevenueLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <RevenueHeader
          dealId={dealId}
          quoteName={quoteName}
          onBack={onBack}
          onAddRevenue={() => setShowAddDialog(true)}
        />

        <RevenueContent
          revenueData={revenueData}
          costCategories={costCategories}
          serviceCategories={serviceCategories}
          geographies={geographies}
          selectedGeographies={selectedGeographies}
          onUpdate={handleUpdateRevenue}
          onDelete={handleDeleteRevenue}
        />

        <AddRevenueDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={onAddRevenue}
          dealId={dealId}
          quoteName={quoteName}
          costCategories={costCategories}
          serviceCategories={serviceCategories}
          geographies={geographies}
          selectedGeographies={selectedGeographies}
        />
      </div>
    </div>
  );
};

export default Revenue;
