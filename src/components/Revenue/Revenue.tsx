
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { RevenueProps, QuoteRevenue, ResourceSkill, CostCategory, BenchmarkRate } from './types';
import { ServiceCategory } from '../DealMaster/types';
import { RevenueTable } from './components/RevenueTable';
import { AddRevenueDialog } from './components/AddRevenueDialog';

const Revenue: React.FC<RevenueProps> = ({ dealId, quoteName, onBack }) => {
  const [revenueData, setRevenueData] = useState<QuoteRevenue[]>([]);
  const [resourceSkills, setResourceSkills] = useState<ResourceSkill[]>([]);
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [benchmarkRates, setBenchmarkRates] = useState<BenchmarkRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [dealId, quoteName]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data since tables don't exist yet
      const mockResourceSkills: ResourceSkill[] = [
        { id: 1, name: 'Programmer' },
        { id: 2, name: 'Tester' },
        { id: 3, name: 'Business Analyst' },
        { id: 4, name: 'Project Manager' },
        { id: 5, name: 'DevOps Engineer' },
        { id: 6, name: 'UI/UX Designer' },
        { id: 7, name: 'Data Analyst' },
        { id: 8, name: 'Solution Architect' }
      ];

      const mockCostCategories: CostCategory[] = [
        { id: 1, name: 'Development' },
        { id: 2, name: 'Testing' },
        { id: 3, name: 'Analysis' },
        { id: 4, name: 'Management' },
        { id: 5, name: 'Infrastructure' }
      ];

      const mockServiceCategories: ServiceCategory[] = [
        { id: 1, name: 'Technology Services', level: 1, parent_id: null },
        { id: 2, name: 'Application Development', level: 2, parent_id: 1 },
        { id: 3, name: 'Web Development', level: 3, parent_id: 2 },
        { id: 4, name: 'Mobile Development', level: 3, parent_id: 2 },
        { id: 5, name: 'Business Services', level: 1, parent_id: null },
        { id: 6, name: 'Consulting', level: 2, parent_id: 5 },
        { id: 7, name: 'Strategy Consulting', level: 3, parent_id: 6 }
      ];

      const mockBenchmarkRates: BenchmarkRate[] = [
        {
          id: 1,
          service_category_level_1_id: 1,
          service_category_level_2_id: 2,
          service_category_level_3_id: 3,
          resource_skill_id: 1,
          experience_years: 3,
          geography_id: 1,
          benchmark_rate_usd_per_hour: 45.00,
          cb_cost_usd_per_hour: 30.00,
          margin_percent: 25.00
        }
      ];

      const mockRevenueData: QuoteRevenue[] = [
        {
          id: 1,
          Deal_Id: dealId,
          Quote_Name: quoteName,
          service_category_level_1_id: 1,
          service_category_level_2_id: 2,
          service_category_level_3_id: 3,
          resource_skill_id: 1,
          experience_years: 3,
          cost_category_id: 1,
          geography_id: 1,
          benchmark_rate_usd_per_hour: 45.00,
          cb_cost_usd_per_hour: 30.00,
          margin_percent: 25.00,
          is_benchmark_rate_overridden: false,
          is_cb_cost_overridden: false
        }
      ];

      setResourceSkills(mockResourceSkills);
      setCostCategories(mockCostCategories);
      setServiceCategories(mockServiceCategories);
      setBenchmarkRates(mockBenchmarkRates);
      setRevenueData(mockRevenueData);

    } catch (error) {
      console.error('Error loading revenue data:', error);
      toast({
        title: "Error",
        description: "Failed to load revenue data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevenue = async (revenue: Omit<QuoteRevenue, 'id'>) => {
    try {
      // Mock add - in real implementation this would use Supabase
      const newRevenue: QuoteRevenue = {
        ...revenue,
        id: Date.now() // Mock ID
      };

      setRevenueData(prev => [...prev, newRevenue]);
      setShowAddDialog(false);
      
      toast({
        title: "Success",
        description: "Revenue entry added successfully"
      });
    } catch (error) {
      console.error('Error adding revenue:', error);
      toast({
        title: "Error",
        description: "Failed to add revenue entry",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRevenue = async (id: number, updates: Partial<QuoteRevenue>) => {
    try {
      // Mock update - in real implementation this would use Supabase
      setRevenueData(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      
      toast({
        title: "Success",
        description: "Revenue entry updated successfully"
      });
    } catch (error) {
      console.error('Error updating revenue:', error);
      toast({
        title: "Error",
        description: "Failed to update revenue entry",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRevenue = async (id: number) => {
    try {
      // Mock delete - in real implementation this would use Supabase
      setRevenueData(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Revenue entry deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting revenue:', error);
      toast({
        title: "Error",
        description: "Failed to delete revenue entry",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading revenue data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deal Master
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Revenue Calculation</h1>
              <p className="text-gray-600">Deal: {dealId} | Quote: {quoteName}</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Revenue Entry
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue, Cost & Margin Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueTable
              data={revenueData}
              resourceSkills={resourceSkills}
              costCategories={costCategories}
              serviceCategories={serviceCategories}
              benchmarkRates={benchmarkRates}
              onUpdate={handleUpdateRevenue}
              onDelete={handleDeleteRevenue}
            />
          </CardContent>
        </Card>

        <AddRevenueDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddRevenue}
          dealId={dealId}
          quoteName={quoteName}
          resourceSkills={resourceSkills}
          costCategories={costCategories}
          serviceCategories={serviceCategories}
          benchmarkRates={benchmarkRates}
        />
      </div>
    </div>
  );
};

export default Revenue;
