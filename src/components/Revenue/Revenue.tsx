
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { RevenueProps, QuoteRevenue, ResourceSkill, CostCategory } from './types';
import { ServiceCategory, Geography } from '../DealMaster/types';
import { RevenueTable } from './components/RevenueTable';
import { AddRevenueDialog } from './components/AddRevenueDialog';

const Revenue: React.FC<RevenueProps> = ({ dealId, quoteName, onBack }) => {
  const [revenueData, setRevenueData] = useState<QuoteRevenue[]>([]);
  const [resourceSkills, setResourceSkills] = useState<ResourceSkill[]>([]);
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [dealId, quoteName]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load master data
      const [
        resourceSkillsResult,
        costCategoriesResult,
        serviceCategoriesResult,
        geographiesResult,
        selectedGeographiesResult,
        revenueResult
      ] = await Promise.all([
        supabase.from('ResourceSkill').select('*').order('name'),
        supabase.from('CostCategory').select('*').order('name'),
        supabase.from('ServiceCategory').select('*').order('level, name'),
        supabase.from('Geography').select('*').order('country, city'),
        supabase.from('QuoteGeography').select('geography_id').eq('Deal_Id', dealId).eq('Quote_Name', quoteName),
        supabase.from('QuoteRevenue').select('*').eq('Deal_Id', dealId).eq('Quote_Name', quoteName)
      ]);

      setResourceSkills(resourceSkillsResult.data || []);
      setCostCategories(costCategoriesResult.data || []);
      setServiceCategories(serviceCategoriesResult.data || []);
      setGeographies(geographiesResult.data || []);
      setSelectedGeographies(selectedGeographiesResult.data?.map(g => g.geography_id) || []);
      setRevenueData(revenueResult.data || []);

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
        description: "Revenue item added successfully"
      });
    } catch (error) {
      console.error('Error adding revenue:', error);
      toast({
        title: "Error",
        description: "Failed to add revenue item",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRevenue = async (id: number, updates: Partial<QuoteRevenue>) => {
    try {
      const { data, error } = await supabase
        .from('QuoteRevenue')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRevenueData(prev => prev.map(item => item.id === id ? data : item));
      
      toast({
        title: "Success",
        description: "Revenue item updated successfully"
      });
    } catch (error) {
      console.error('Error updating revenue:', error);
      toast({
        title: "Error",
        description: "Failed to update revenue item",
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
        description: "Revenue item deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting revenue:', error);
      toast({
        title: "Error",
        description: "Failed to delete revenue item",
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
              Add Revenue Item
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
              geographies={geographies}
              selectedGeographies={selectedGeographies}
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
          geographies={geographies}
          selectedGeographies={selectedGeographies}
        />
      </div>
    </div>
  );
};

export default Revenue;
