
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { QuoteResourceEffort, EffortInputMode } from '../types';
import { CostCategory } from '../../Revenue/types';
import { ServiceCategory } from '../../DealMaster/types';

interface ResourceEffortsTableProps {
  data: QuoteResourceEffort[];
  costCategories: CostCategory[];
  serviceCategories: ServiceCategory[];
  inputMode: EffortInputMode;
  onUpdate: (id: number, updates: Partial<QuoteResourceEffort>) => void;
  onDelete: (id: number) => void;
}

export const ResourceEffortsTable: React.FC<ResourceEffortsTableProps> = ({
  data,
  costCategories,
  serviceCategories,
  inputMode,
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

  const handleFieldUpdate = (id: number, field: keyof QuoteResourceEffort, value: any) => {
    onUpdate(id, { [field]: value });
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  // Group data by year for summary
  const yearSummary = data.reduce((acc, item) => {
    const key = `${item.service_category_level_1_id}-${item.service_category_level_2_id}-${item.service_category_level_3_id}-${item.service_category_level_4_id}-${item.experience_years}-${item.cost_category_id}-${item.effort_year}`;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        total_hours: 0
      };
    }
    acc[key].total_hours += item.hours_allocated;
    return acc;
  }, {} as Record<string, any>);

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
            <TableHead>Year</TableHead>
            {inputMode === 'month' && <TableHead>Month</TableHead>}
            <TableHead>Hours Allocated</TableHead>
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
              <TableCell>{item.effort_year}</TableCell>
              {inputMode === 'month' && <TableCell>{getMonthName(item.effort_month)}</TableCell>}
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={item.hours_allocated}
                  onChange={(e) => handleFieldUpdate(item.id!, 'hours_allocated', parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={inputMode === 'month' ? 10 : 9} className="text-center text-gray-500">
                No resource efforts found. Click "Add Resource Effort" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {inputMode === 'year' && Object.keys(yearSummary).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Year Summary</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Category L1</TableHead>
                <TableHead>Service Category L2</TableHead>
                <TableHead>Service Category L3</TableHead>
                <TableHead>Resource Skill (L4)</TableHead>
                <TableHead>Experience (Years)</TableHead>
                <TableHead>Cost Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(yearSummary).map((summary: any, index) => (
                <TableRow key={index}>
                  <TableCell>{getServiceCategoryName(summary.service_category_level_1_id)}</TableCell>
                  <TableCell>{getServiceCategoryName(summary.service_category_level_2_id)}</TableCell>
                  <TableCell>{getServiceCategoryName(summary.service_category_level_3_id)}</TableCell>
                  <TableCell>{getResourceSkillName(summary.service_category_level_4_id)}</TableCell>
                  <TableCell>{summary.experience_years}</TableCell>
                  <TableCell>{getCostCategoryName(summary.cost_category_id)}</TableCell>
                  <TableCell>{summary.effort_year}</TableCell>
                  <TableCell className="font-semibold">{summary.total_hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
