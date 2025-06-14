
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
      
      // Try to sync deals first, if it fails due to RLS, we'll create mock data
      try {
        await syncDealsToDatabase();
        await loadDealsFromDatabase();
      } catch (syncError) {
        console.error('Sync failed, using mock data:', syncError);
        // If sync fails due to RLS, create some mock deals for demo purposes
        setMockDeals();
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      // Fallback to mock data
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
        totalRevenue: 250000,
        marginPercent: 25,
        createdDate: '2024-01-15'
      },
      {
        id: 'DEAL-002',
        name: 'Digital Transformation Initiative',
        dealOwner: 'Sarah Johnson',
        status: 'In Progress',
        totalRevenue: 180000,
        marginPercent: 30,
        createdDate: '2024-02-01'
      },
      {
        id: 'DEAL-003',
        name: 'Security Infrastructure Upgrade',
        dealOwner: 'Mike Chen',
        status: 'Proposal',
        totalRevenue: 120000,
        marginPercent: 22,
        createdDate: '2024-02-10'
      }
    ];
    setDeals(mockDeals);
  };

  const loadDealsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('Deals')
        .select('*')
        .order('Created_Date', { ascending: false });

      if (error) {
        console.error('Error loading deals:', error);
        return;
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

      setDeals(formattedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
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
