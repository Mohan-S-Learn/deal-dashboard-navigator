
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

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // First try to load existing deals from database
      const databaseDeals = await loadDealsFromDatabase();
      
      // If no deals exist in database, try to sync mock deals
      if (databaseDeals.length === 0) {
        console.log('No existing deals found, syncing mock data...');
        const syncSuccess = await syncDealsToDatabase();
        
        if (syncSuccess) {
          // If sync succeeded, load from database again
          await loadDealsFromDatabase();
        } else {
          // If sync failed, use mock data directly
          console.log('Sync failed, using mock data as fallback');
          setMockDeals();
        }
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      // If everything fails, use mock data as fallback
      setMockDeals();
    } finally {
      setLoading(false);
    }
  };

  const setMockDeals = () => {
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
    console.log('Setting mock deals:', mockDeals);
    setDeals(mockDeals);
  };

  const loadDealsFromDatabase = async (): Promise<Deal[]> => {
    try {
      console.log('Loading deals from database...');
      const { data, error } = await supabase
        .from('Deals')
        .select('*')
        .order('Created_Date', { ascending: false });

      if (error) {
        console.error('Error loading deals:', error);
        return [];
      }

      console.log('Raw deals data from database:', data);

      const formattedDeals = data.map(deal => ({
        id: deal.Deal_Id,
        name: deal.Deal_Name,
        dealOwner: deal.Deal_Owner,
        status: deal.Status,
        totalRevenue: deal.Total_Revenue,
        marginPercent: deal['Margin%'],
        createdDate: deal.Created_Date
      }));

      console.log('Formatted deals:', formattedDeals);
      setDeals(formattedDeals);
      return formattedDeals;
    } catch (error) {
      console.error('Error loading deals from database:', error);
      return [];
    }
  };

  const handleScenarioBuilderClick = () => {
    console.log('Scenario Builder clicked, deals available:', deals.length);
    if (deals.length > 0) {
      console.log('Navigating to scenario builder with deal:', deals[0].id);
      onDealClick(deals[0].id); // This should navigate to version management
    }
  };

  const totalRevenue = deals.reduce((sum, deal) => sum + deal.totalRevenue, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
      </main>
    </div>
  );
};

export default Dashboard;
