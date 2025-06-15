
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { ResourceEffortsProps, QuoteResourceEffort, EffortInputMode } from './types';
import { ResourceSkill, CostCategory } from '../Revenue/types';
import { ServiceCategory } from '../DealMaster/types';
import { ResourceEffortsTable } from './components/ResourceEffortsTable';
import { AddResourceEffortDialog } from './components/AddResourceEffortDialog';
import { EffortInputModeSelector } from './components/EffortInputModeSelector';

const ResourceEfforts: React.FC<ResourceEffortsProps> = ({ dealId, quoteName, onBack }) => {
  const [effortData, setEffortData] = useState<QuoteResourceEffort[]>([]);
  const [resourceSkills, setResourceSkills] = useState<ResourceSkill[]>([]);
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

      const mockEffortData: QuoteResourceEffort[] = [
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
          effort_year: 2024,
          effort_month: 1,
          hours_allocated: 160
        }
      ];

      setResourceSkills(mockResourceSkills);
      setCostCategories(mockCostCategories);
      setServiceCategories(mockServiceCategories);
      setEffortData(mockEffortData);

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
      // Mock add - in real implementation this would use Supabase
      const newEffort: QuoteResourceEffort = {
        ...effort,
        id: Date.now() // Mock ID
      };

      setEffortData(prev => [...prev, newEffort]);
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
      // Mock update - in real implementation this would use Supabase
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
      // Mock delete - in real implementation this would use Supabase
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
              resourceSkills={resourceSkills}
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
          resourceSkills={resourceSkills}
          costCategories={costCategories}
          serviceCategories={serviceCategories}
          inputMode={inputMode}
        />
      </div>
    </div>
  );
};

export default ResourceEfforts;
