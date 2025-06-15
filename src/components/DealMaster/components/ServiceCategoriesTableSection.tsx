
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ServiceCategory } from '../types';
import { useServiceCategoriesTableData } from '../hooks/useServiceCategoriesTableData';
import { ServiceCategoriesDuplicateAlert } from './ServiceCategoriesDuplicateAlert';
import { ServiceCategoriesTableActions } from './ServiceCategoriesTableActions';
import { ServiceCategoryRow } from './ServiceCategoryRow';

interface ServiceCategoriesTableSectionProps {
  serviceCategories: ServiceCategory[];
  selectedCategories: any;
  onCategoryChange: (level: any, value: number | null) => void;
  onDataChange: (data: any[]) => void;
}

export const ServiceCategoriesTableSection: React.FC<ServiceCategoriesTableSectionProps> = ({
  serviceCategories,
  onDataChange
}) => {
  const {
    categoryRows,
    updateCategoryRow,
    addRows,
    removeRow,
    copyFirstRowToAll,
    getDuplicates,
    isDuplicate
  } = useServiceCategoriesTableData(onDataChange);

  const duplicates = getDuplicates();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Service Categories</CardTitle>
          <ServiceCategoriesTableActions
            onCopyFirstRowToAll={copyFirstRowToAll}
            onAddRows={addRows}
          />
        </div>
        <ServiceCategoriesDuplicateAlert duplicates={duplicates} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Level 1</TableHead>
              <TableHead>Service Level 2</TableHead>
              <TableHead>Service Level 3</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryRows.map((row) => (
              <ServiceCategoryRow
                key={row.id}
                row={row}
                serviceCategories={serviceCategories}
                isDuplicate={isDuplicate(row)}
                canRemove={categoryRows.length > 1}
                onUpdate={updateCategoryRow}
                onRemove={removeRow}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
