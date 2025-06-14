
export interface Deal {
  id: string;
  name: string;
  client: string;
  value: number;
  status: string;
  quoteCount: number;
}

export interface Quote {
  id: string;
  name: string;
  revenue: number;
  margin: number;
}

// Expanded mock data for deals from "My Deals" page
export const mockDeals: Deal[] = [
  { 
    id: 'DEAL001', 
    name: 'ABC Corp Infrastructure Upgrade', 
    client: 'ABC Corporation',
    value: 450000,
    status: 'Active',
    quoteCount: 3 
  },
  { 
    id: 'DEAL002', 
    name: 'XYZ Ltd Cloud Migration', 
    client: 'XYZ Limited',
    value: 280000,
    status: 'Proposal',
    quoteCount: 2 
  },
  { 
    id: 'DEAL003', 
    name: 'TechStart Security Implementation', 
    client: 'TechStart Inc',
    value: 650000,
    status: 'Active',
    quoteCount: 4 
  },
  { 
    id: 'DEAL004', 
    name: 'Global Corp Digital Transformation', 
    client: 'Global Corp',
    value: 1200000,
    status: 'Negotiation',
    quoteCount: 5 
  },
  { 
    id: 'DEAL005', 
    name: 'StartupX Platform Development', 
    client: 'StartupX',
    value: 85000,
    status: 'Proposal',
    quoteCount: 2 
  },
  { 
    id: 'DEAL006', 
    name: 'Enterprise Solutions Modernization', 
    client: 'Enterprise Solutions Ltd',
    value: 750000,
    status: 'Active',
    quoteCount: 3 
  }
];

// Expanded mock quotes for selected deal
export const mockQuotesForDeal: Record<string, Quote[]> = {
  'DEAL001': [
    { id: 'Q001', name: 'Basic Infrastructure Package', revenue: 150000, margin: 18 },
    { id: 'Q002', name: 'Enhanced Infrastructure with Support', revenue: 200000, margin: 22 },
    { id: 'Q003', name: 'Premium Infrastructure Solution', revenue: 300000, margin: 25 }
  ],
  'DEAL002': [
    { id: 'Q004', name: 'Phase 1 - Assessment & Planning', revenue: 120000, margin: 20 },
    { id: 'Q005', name: 'Complete Migration Package', revenue: 250000, margin: 24 }
  ],
  'DEAL003': [
    { id: 'Q006', name: 'Security Essentials', revenue: 180000, margin: 19 },
    { id: 'Q007', name: 'Advanced Security Suite', revenue: 340000, margin: 23 },
    { id: 'Q008', name: 'Enterprise Security Platform', revenue: 520000, margin: 27 },
    { id: 'Q009', name: 'Complete Security Solution', revenue: 650000, margin: 29 }
  ],
  'DEAL004': [
    { id: 'Q010', name: 'Foundation Package', revenue: 400000, margin: 20 },
    { id: 'Q011', name: 'Standard Transformation', revenue: 700000, margin: 24 },
    { id: 'Q012', name: 'Advanced Digital Suite', revenue: 950000, margin: 26 },
    { id: 'Q013', name: 'Premium Transformation', revenue: 1200000, margin: 28 },
    { id: 'Q014', name: 'Enterprise Plus Package', revenue: 1450000, margin: 30 }
  ],
  'DEAL005': [
    { id: 'Q015', name: 'MVP Development', revenue: 60000, margin: 15 },
    { id: 'Q016', name: 'Full Platform Development', revenue: 85000, margin: 18 }
  ],
  'DEAL006': [
    { id: 'Q017', name: 'Modernization Phase 1', revenue: 250000, margin: 21 },
    { id: 'Q018', name: 'Complete Modernization', revenue: 500000, margin: 25 },
    { id: 'Q019', name: 'Premium Modernization Suite', revenue: 750000, margin: 28 }
  ]
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Proposal': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Negotiation': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
