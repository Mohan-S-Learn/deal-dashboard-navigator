
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

      // Load ResourceSkills
      const { data: resourceSkillsData, error: resourceSkillsError } = await supabase
        .from('ResourceSkill')
        .select('*')
        .order('name');

      if (resourceSkillsError) throw resourceSkillsError;

      // Load CostCategories
      const { data: costCategoriesData, error: costCategoriesError } = await supabase
        .from('CostCategory')
        .select('*')
        .order('name');

      if (costCategoriesError) throw costCategoriesError;

      // Load ServiceCategories
      const { data: serviceCategoriesData, error: serviceCategoriesError } = await supabase
        .from('ServiceCategory')
        .select('*')
        .order('level', { ascending: true });

      if (serviceCategoriesError) throw serviceCategoriesError;

      // Load BenchmarkRates
      const { data: benchmarkRatesData, error: benchmarkRatesError } = await supabase
        .from('BenchmarkRate')
        .select('*');

      if (benchmarkRatesError) throw benchmarkRatesError;

      // Load Revenue data for this quote
      const { data: revenueDataResult, error: revenueError } = await supabase
        .from('QuoteRevenue')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (revenueError) throw revenueError;

      setResourceSkills(resourceSkillsData || []);
      setCostCategories(costCategoriesData || []);
      setServiceCategories(serviceCategoriesData || []);
      setBenchmarkRates(benchmarkRatesData || []);
      setRevenueData(revenueDataResult || []);

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
      const { data, error } = await supabase
        .from('QuoteRevenue')
        .insert([revenue])
        .select()
        .single();

      if (error) throw error;

      setRevenueData(prev => [...prev, data]);
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
      const { error } = await supabase
        .from('QuoteRevenue')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

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
      const { error } = await supabase
        .from('QuoteRevenue')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
        />
      </div>
    </div>
  );
};

export default Revenue;
