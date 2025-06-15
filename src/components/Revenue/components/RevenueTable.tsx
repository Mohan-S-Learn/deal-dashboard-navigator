
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { QuoteRevenue, CostCategory } from '../types';
import { ServiceCategory, Geography } from '../../DealMaster/types';

interface RevenueTableProps {
  data: QuoteRevenue[];
  costCategories: CostCategory[];
  serviceCategories: ServiceCategory[];
  geographies: Geography[];
  selectedGeographies: number[];
  onUpdate: (id: number, updates: Partial<QuoteRevenue>) => void;
  onDelete: (id: number) => void;
}

export const RevenueTable: React.FC<RevenueTableProps> = ({
  data,
  costCategories,
  serviceCategories,
  geographies,
  selectedGeographies,
  onUpdate,
  onDelete
}) => {
  const getServiceCategoryName = (id?: number) => {
    return serviceCategories.find(sc => sc.id === id)?.name || 'N/A';
  };

  const getResourceSkillName = (id: number) => {
    // Level 4 service categories are the resource skills
    return serviceCategories.find(sc => sc.id === id && sc.level === 4)?.name || 'N/A';
  };

  const getCostCategoryName = (id?: number) => {
    return costCategories.find(cc => cc.id === id)?.name || 'N/A';
  };

  const getGeographyName = (id?: number) => {
    const geo = geographies.find(g => g.id === id);
    return geo ? `${geo.city}, ${geo.country}` : 'N/A';
  };

  const handleFieldUpdate = (id: number, field: keyof QuoteRevenue, value: any) => {
    onUpdate(id, { [field]: value });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Category L1</TableHead>
            <TableHead>Service Category L2</TableHead>
            <TableHead>Service Category L3</TableHead>
            <TableHead>Resource Skill (L4)</TableHead>
            <TableHead>Experience (Years)</TableHead>
            <TableHead>Cost Category</TableHead>
            <TableHead>Geography</TableHead>
            <TableHead>Benchmark Rate ($/hr)</TableHead>
            <TableHead>C&B Cost ($/hr)</TableHead>
            <TableHead>Margin %</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{getServiceCategoryName(item.service_category_level_1_id)}</TableCell>
              <TableCell>{getServiceCategoryName(item.service_category_level_2_id)}</TableCell>
              <TableCell>{getServiceCategoryName(item.service_category_level_3_id)}</TableCell>
              <TableCell>{getResourceSkillName(item.service_category_level_4_id)}</TableCell>
              <TableCell>{item.experience_years}</TableCell>
              <TableCell>{getCostCategoryName(item.cost_category_id)}</TableCell>
              <TableCell>{getGeographyName(item.geography_id)}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={item.benchmark_rate_usd_per_hour || ''}
                  onChange={(e) => handleFieldUpdate(item.id!, 'benchmark_rate_usd_per_hour', parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={item.cb_cost_usd_per_hour || ''}
                  onChange={(e) => handleFieldUpdate(item.id!, 'cb_cost_usd_per_hour', parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={item.margin_percent || ''}
                  onChange={(e) => handleFieldUpdate(item.id!, 'margin_percent', parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-gray-500">
                No revenue items found. Click "Add Revenue Item" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
