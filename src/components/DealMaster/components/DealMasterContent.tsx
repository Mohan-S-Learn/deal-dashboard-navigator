
import React from 'react';
import { TimelineSection } from './TimelineSection';
import { MarketResourcesSection } from './MarketResourcesSection';
import { DealDiscountSection } from './DealDiscountSection';
import { VolumeDiscountsTableSection } from './VolumeDiscountsTableSection';
import { CostComponentsSection } from './CostComponentsSection';
import { GeographyTableSection } from './GeographyTableSection';
import { ServiceCategoriesTableSection } from './ServiceCategoriesTableSection';
import {
  QuoteData,
  VolumeDiscountRange,
  SelectedCategories,
  Market,
  ResourceType,
  Geography,
  ServiceCategory
} from '../types';

interface DealMasterContentProps {
  quoteData: QuoteData;
  markets: Market[];
  resourceTypes: ResourceType[];
  geographies: Geography[];
  serviceCategories: ServiceCategory[];
  selectedResourceTypes: number[];
  selectedGeographies: number[];
  selectedCategories: SelectedCategories;
  volumeDiscounts: VolumeDiscountRange[];
  onDateChange: (field: keyof QuoteData, date: Date | undefined) => void;
  onNumberChange: (field: keyof QuoteData, value: string) => void;
  onMarketChange: (marketId: number) => void;
  onResourceTypeChange: (resourceTypeId: number, checked: boolean) => void;
  onGeographyChange: (geographyId: number, checked: boolean) => void;
  onCategoryChange: (level: keyof SelectedCategories, value: number | null) => void;
  onAddVolumeDiscount: () => void;
  onRemoveVolumeDiscount: (index: number) => void;
  onUpdateVolumeDiscount: (index: number, field: keyof VolumeDiscountRange, value: number) => void;
  onGeographyDataChange: (data: any[]) => void;
  onCategoryDataChange: (data: any[]) => void;
}

export const DealMasterContent: React.FC<DealMasterContentProps> = ({
  quoteData,
  markets,
  resourceTypes,
  geographies,
  serviceCategories,
  selectedResourceTypes,
  selectedGeographies,
  selectedCategories,
  volumeDiscounts,
  onDateChange,
  onNumberChange,
  onMarketChange,
  onResourceTypeChange,
  onGeographyChange,
  onCategoryChange,
  onAddVolumeDiscount,
  onRemoveVolumeDiscount,
  onUpdateVolumeDiscount,
  onGeographyDataChange,
  onCategoryDataChange,
}) => {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
      <TimelineSection
        quoteData={quoteData}
        onDateChange={onDateChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MarketResourcesSection
          quoteData={quoteData}
          markets={markets}
          resourceTypes={resourceTypes}
          selectedResourceTypes={selectedResourceTypes}
          onMarketChange={onMarketChange}
          onResourceTypeChange={onResourceTypeChange}
        />

        <DealDiscountSection
          quoteData={quoteData}
          onNumberChange={onNumberChange}
        />
      </div>

      <VolumeDiscountsTableSection
        volumeDiscounts={volumeDiscounts}
        onAddVolumeDiscount={onAddVolumeDiscount}
        onRemoveVolumeDiscount={onRemoveVolumeDiscount}
        onUpdateVolumeDiscount={onUpdateVolumeDiscount}
      />

      <CostComponentsSection
        quoteData={quoteData}
        onNumberChange={onNumberChange}
      />

      <GeographyTableSection
        geographies={geographies}
        selectedGeographies={selectedGeographies}
        onGeographyChange={onGeographyChange}
        onDataChange={onGeographyDataChange}
      />

      <ServiceCategoriesTableSection
        serviceCategories={serviceCategories}
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
        onDataChange={onCategoryDataChange}
      />
    </main>
  );
};
