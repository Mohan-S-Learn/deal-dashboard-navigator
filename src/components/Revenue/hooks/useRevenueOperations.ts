
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuoteRevenue } from '../types';

export const useRevenueOperations = (
  setRevenueData: React.Dispatch<React.SetStateAction<QuoteRevenue[]>>
) => {
  const { toast } = useToast();

  const handleAddRevenue = async (revenue: Omit<QuoteRevenue, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('QuoteRevenue')
        .insert([revenue])
        .select()
        .single();

      if (error) throw error;

      setRevenueData(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Revenue entry added successfully"
      });

      return true;
    } catch (error) {
      console.error('Error adding revenue:', error);
      toast({
        title: "Error",
        description: "Failed to add revenue entry",
        variant: "destructive"
      });
      return false;
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

  return {
    handleAddRevenue,
    handleUpdateRevenue,
    handleDeleteRevenue
  };
};
