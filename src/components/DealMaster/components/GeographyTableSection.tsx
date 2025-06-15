
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Geography } from '../types';
import { useGeographyTableData } from '../hooks/useGeographyTableData';
import { GeographyDuplicateAlert } from './GeographyDuplicateAlert';
import { GeographyTableActions } from './GeographyTableActions';
import { GeographyRow } from './GeographyRow';

interface GeographyTableSectionProps {
  geographies: Geography[];
  selectedGeographies: number[];
  onGeographyChange: (geographyId: number, checked: boolean) => void;
  onDataChange: (data: number[]) => void;
}

export const GeographyTableSection: React.FC<GeographyTableSectionProps> = ({
  geographies,
  onDataChange
}) => {
  console.log('GeographyTableSection - Props received:', { geographies: geographies.length, onDataChange: typeof onDataChange });
  
  const {
    selectedRows,
    updateRow,
    addRows,
    removeRow,
    copyFirstRowToAll,
    getDuplicates,
    isDuplicate
  } = useGeographyTableData(geographies, onDataChange);

  console.log('GeographyTableSection - Current selectedRows:', selectedRows);

  const duplicates = getDuplicates();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Geography & Service Locations</CardTitle>
          <GeographyTableActions
            onCopyFirstRowToAll={copyFirstRowToAll}
            onAddRows={addRows}
          />
        </div>
        <GeographyDuplicateAlert duplicates={duplicates} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedRows.map((row) => (
              <GeographyRow
                key={row.id}
                row={row}
                geographies={geographies}
                isDuplicate={isDuplicate(row)}
                canRemove={selectedRows.length > 1}
                onUpdate={updateRow}
                onRemove={removeRow}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
