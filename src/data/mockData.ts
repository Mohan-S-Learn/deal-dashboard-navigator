
export interface Deal {
  id: string;
  name: string;
  totalRevenue: number;
  marginPercent: number;
  dealOwner: string;
  createdDate: string;
  status: 'Active' | 'Pending' | 'Closed';
}

export const mockDeals: Deal[] = [
  {
    id: 'DEAL-001',
    name: 'Enterprise Cloud Migration',
    totalRevenue: 450000,
    marginPercent: 35.5,
    dealOwner: 'John Smith',
    createdDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 'DEAL-002',
    name: 'Digital Transformation Suite',
    totalRevenue: 780000,
    marginPercent: 42.8,
    dealOwner: 'Sarah Johnson',
    createdDate: '2024-02-08',
    status: 'Active'
  },
  {
    id: 'DEAL-003',
    name: 'Security Infrastructure Upgrade',
    totalRevenue: 320000,
    marginPercent: 28.3,
    dealOwner: 'Mike Davis',
    createdDate: '2024-01-22',
    status: 'Pending'
  },
  {
    id: 'DEAL-004',
    name: 'Data Analytics Platform',
    totalRevenue: 950000,
    marginPercent: 38.7,
    dealOwner: 'Lisa Chen',
    createdDate: '2024-03-01',
    status: 'Active'
  },
  {
    id: 'DEAL-005',
    name: 'Mobile App Development',
    totalRevenue: 180000,
    marginPercent: 45.2,
    dealOwner: 'Tom Wilson',
    createdDate: '2024-02-14',
    status: 'Closed'
  },
  {
    id: 'DEAL-006',
    name: 'AI Implementation Services',
    totalRevenue: 1200000,
    marginPercent: 52.1,
    dealOwner: 'Emma Rodriguez',
    createdDate: '2024-03-10',
    status: 'Active'
  }
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
