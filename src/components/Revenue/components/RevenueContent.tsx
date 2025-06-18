
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueTable } from './RevenueTable';
import { QuoteRevenue, CostCategory } from '../types';
import { ServiceCategory, Geography } from '../../DealMaster/types';

interface RevenueContentProps {
  revenueData: QuoteRevenue[];
  costCategories: CostCategory[];
  serviceCategories: ServiceCategory[];
  geographies: Geography[];
  selectedGeographies: number[];
  onUpdate: (id: number, updates: Partial<QuoteRevenue>) => void;
  onDelete: (id: number) => void;
}

export const RevenueContent: React.FC<RevenueContentProps> = ({
  revenueData,
  costCategories,
  serviceCategories,
  geographies,
  selectedGeographies,
  onUpdate,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue, Cost & Margin Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <RevenueTable
          data={revenueData}
          costCategories={costCategories}
          serviceCategories={serviceCategories}
          geographies={geographies}
          selectedGeographies={selectedGeographies}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};
