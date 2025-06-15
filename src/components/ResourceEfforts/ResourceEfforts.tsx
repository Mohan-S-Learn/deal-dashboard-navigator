
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ResourceEffortsProps, QuoteResourceEffort, EffortInputMode } from './types';
import { CostCategory } from '../Revenue/types';
import { ServiceCategory } from '../DealMaster/types';
import { ResourceEffortsTable } from './components/ResourceEffortsTable';
import { AddResourceEffortDialog } from './components/AddResourceEffortDialog';
import { EffortInputModeSelector } from './components/EffortInputModeSelector';

const ResourceEfforts: React.FC<ResourceEffortsProps> = ({ dealId, quoteName, onBack }) => {
  const [effortData, setEffortData] = useState<QuoteResourceEffort[]>([]);
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [inputMode, setInputMode] = useState<EffortInputMode>('year');

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [dealId, quoteName]);

  const loadData = async () => {
    try {
      setLoading(true);

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

      // Load Resource Effort data for this quote
      const { data: effortDataResult, error: effortError } = await supabase
        .from('QuoteResourceEffort')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .order('effort_year', { ascending: true })
        .order('effort_month', { ascending: true });

      if (effortError) throw effortError;

      setCostCategories(costCategoriesData || []);
      setServiceCategories(serviceCategoriesData || []);
      setEffortData(effortDataResult || []);

    } catch (error) {
      console.error('Error loading resource efforts data:', error);
      toast({
        title: "Error",
        description: "Failed to load resource efforts data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEffort = async (effort: Omit<QuoteResourceEffort, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('QuoteResourceEffort')
        .insert([effort])
        .select()
        .single();

      if (error) throw error;

      setEffortData(prev => [...prev, data]);
      setShowAddDialog(false);
      
      toast({
        title: "Success",
        description: "Resource effort added successfully"
      });
    } catch (error) {
      console.error('Error adding resource effort:', error);
      toast({
        title: "Error",
        description: "Failed to add resource effort",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEffort = async (id: number, updates: Partial<QuoteResourceEffort>) => {
    try {
      const { error } = await supabase
        .from('QuoteResourceEffort')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setEffortData(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      
      toast({
        title: "Success",
        description: "Resource effort updated successfully"
      });
    } catch (error) {
      console.error('Error updating resource effort:', error);
      toast({
        title: "Error",
        description: "Failed to update resource effort",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEffort = async (id: number) => {
    try {
      const { error } = await supabase
        .from('QuoteResourceEffort')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEffortData(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Resource effort deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting resource effort:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource effort",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading resource efforts data...</div>;
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
              <h1 className="text-3xl font-bold">Resource Efforts</h1>
              <p className="text-gray-600">Deal: {dealId} | Quote: {quoteName}</p>
            </div>
            <div className="flex space-x-2">
              <EffortInputModeSelector mode={inputMode} onModeChange={setInputMode} />
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource Effort
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation & Efforts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceEffortsTable
              data={effortData}
              costCategories={costCategories}
              serviceCategories={serviceCategories}
              inputMode={inputMode}
              onUpdate={handleUpdateEffort}
              onDelete={handleDeleteEffort}
            />
          </CardContent>
        </Card>

        <AddResourceEffortDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddEffort}
          dealId={dealId}
          quoteName={quoteName}
          costCategories={costCategories}
          serviceCategories={serviceCategories}
          inputMode={inputMode}
        />
      </div>
    </div>
  );
};

export default ResourceEfforts;
