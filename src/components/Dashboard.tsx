
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { syncDealsToDatabase } from '../services/dataSync';
import DashboardHeader from './DashboardHeader';
import StatisticsCards from './StatisticsCards';
import DealsGrid from './DealsGrid';

interface Deal {
  id: string;
  name: string;
  dealOwner: string;
  status: string;
  totalRevenue: number;
  marginPercent: number;
  createdDate: string;
}

interface DashboardProps {
  onDealClick: (dealId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onDealClick }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting dashboard data initialization...');
      
      // Step 1: Try to load existing deals from database
      console.log('Step 1: Loading deals from database...');
      const databaseDeals = await loadDealsFromDatabase();
      console.log('Database deals loaded:', databaseDeals.length);
      
      if (databaseDeals.length > 0) {
        console.log('Found deals in database, using them');
        setDeals(databaseDeals);
      } else {
        // Step 2: No deals in database, try to sync mock data
        console.log('Step 2: No deals found, syncing mock data...');
        const syncSuccess = await syncDealsToDatabase();
        console.log('Sync result:', syncSuccess);
        
        if (syncSuccess) {
          // Step 3: Load from database after successful sync
          console.log('Step 3: Sync successful, loading from database again...');
          const newDeals = await loadDealsFromDatabase();
          console.log('Deals after sync:', newDeals.length);
          setDeals(newDeals);
        } else {
          // Step 4: Fallback to mock data if sync failed
          console.log('Step 4: Sync failed, using mock data fallback');
          setMockDeals();
        }
      }
    } catch (error) {
      console.error('Error in initializeData:', error);
      setError(`Failed to load deals: ${error}`);
      // Final fallback to mock data
      setMockDeals();
    } finally {
      setLoading(false);
    }
  };

  const loadDealsFromDatabase = async (): Promise<Deal[]> => {
    try {
      console.log('Querying Deals table...');
      const { data, error } = await supabase
        .from('Deals')
        .select('*')
        .order('Created_Date', { ascending: false });

      if (error) {
        console.error('Supabase error loading deals:', error);
        throw error;
      }

      console.log('Raw deals data from Supabase:', data);

      if (!data || data.length === 0) {
        console.log('No deals found in database');
        return [];
      }

      const formattedDeals = data.map(deal => ({
        id: deal.Deal_Id,
        name: deal.Deal_Name,
        dealOwner: deal.Deal_Owner,
        status: deal.Status,
        totalRevenue: deal.Total_Revenue,
        marginPercent: deal['Margin%'],
        createdDate: deal.Created_Date
      }));

      console.log('Formatted deals for UI:', formattedDeals);
      return formattedDeals;
    } catch (error) {
      console.error('Error in loadDealsFromDatabase:', error);
      throw error;
    }
  };

  const setMockDeals = () => {
    console.log('Setting fallback mock deals...');
    const mockDeals: Deal[] = [
      {
        id: 'DEAL-001',
        name: 'Enterprise Cloud Migration',
        dealOwner: 'John Smith',
        status: 'Active',
        totalRevenue: 450000,
        marginPercent: 35.5,
        createdDate: '2024-01-15'
      },
      {
        id: 'DEAL-002',
        name: 'Digital Transformation Suite',
        dealOwner: 'Sarah Johnson',
        status: 'Active',
        totalRevenue: 780000,
        marginPercent: 42.8,
        createdDate: '2024-02-08'
      },
      {
        id: 'DEAL-003',
        name: 'Security Infrastructure Upgrade',
        dealOwner: 'Mike Davis',
        status: 'Pending',
        totalRevenue: 320000,
        marginPercent: 28.3,
        createdDate: '2024-01-22'
      },
      {
        id: 'DEAL-004',
        name: 'Data Analytics Platform',
        dealOwner: 'Lisa Chen',
        status: 'Active',
        totalRevenue: 950000,
        marginPercent: 38.7,
        createdDate: '2024-03-01'
      },
      {
        id: 'DEAL-005',
        name: 'Mobile App Development',
        dealOwner: 'Tom Wilson',
        status: 'Closed',
        totalRevenue: 180000,
        marginPercent: 45.2,
        createdDate: '2024-02-14'
      },
      {
        id: 'DEAL-006',
        name: 'AI Implementation Services',
        dealOwner: 'Emma Rodriguez',
        status: 'Active',
        totalRevenue: 1200000,
        marginPercent: 52.1,
        createdDate: '2024-03-10'
      }
    ];
    console.log('Mock deals set:', mockDeals.length);
    setDeals(mockDeals);
  };

  const handleScenarioBuilderClick = () => {
    console.log('Scenario Builder clicked');
    console.log('Available deals:', deals.length);
    if (deals.length > 0) {
      console.log('Navigating to scenario builder with deal:', deals[0].id);
      onDealClick(deals[0].id);
    } else {
      console.error('No deals available for scenario builder');
    }
  };

  const totalRevenue = deals.reduce((sum, deal) => sum + deal.totalRevenue, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <DashboardHeader 
        deals={deals}
        totalRevenue={totalRevenue}
        onScenarioBuilderClick={handleScenarioBuilderClick}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <StatisticsCards deals={deals} />
        <DealsGrid deals={deals} onDealClick={onDealClick} />
        
        {/* Debug info - remove in production */}
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
          <p>Debug Info:</p>
          <p>Deals loaded: {deals.length}</p>
          <p>Total Revenue: ${totalRevenue.toLocaleString()}</p>
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
