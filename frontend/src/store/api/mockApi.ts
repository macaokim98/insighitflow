// Mock API for demo purposes when backend is not available

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiResponse = async (url: string, method: string = 'GET', body?: any) => {
  await mockDelay();
  
  // Mock login
  if (url.includes('/auth/login') && method === 'POST') {
    console.log('🎭 Mock login called with:', body);
    // Check credentials (accept any for demo)
    if (body && body.email && body.password) {
      return {
        ok: true,
        json: async () => ({
          user: {
            id: '1',
            email: body.email,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
          },
          accessToken: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 86400
        })
      };
    } else {
      return {
        ok: false,
        status: 401,
        json: async () => ({
          message: 'Invalid credentials'
        })
      };
    }
  }
  
  // Mock profile
  if (url.includes('/auth/profile') && method === 'GET') {
    return {
      ok: true,
      json: async () => ({
        id: '1',
        email: 'admin@insightflow.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      })
    };
  }
  
  // Mock customer stats
  if (url.includes('/customers/stats')) {
    return {
      ok: true,
      json: async () => ({
        total: 42,
        newThisMonth: 8,
        averageScore: 78.5,
        totalLifetimeValue: 1250000
      })
    };
  }
  
  // Mock customers list
  if (url.includes('/customers') && method === 'GET') {
    return {
      ok: true,
      json: async () => ({
        data: [
          {
            id: '1',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            company: 'Tech Corp',
            phone: '+1234567890',
            tags: ['VIP', 'Enterprise'],
            score: 85,
            lifetimeValue: 125000,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            company: 'Design Studio',
            phone: '+1234567891',
            tags: ['Active', 'SMB'],
            score: 72,
            lifetimeValue: 45000,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z'
          }
        ],
        total: 42,
        page: 1,
        limit: 10,
        totalPages: 5
      })
    };
  }
  
  // Mock dashboard data
  if (url.includes('/analytics/dashboard')) {
    return {
      ok: true,
      json: async () => ({
        kpis: {
          revenue: 1250000,
          revenueChange: 12.5,
          customers: 42,
          customersChange: 8.2,
          activeDeals: 15,
          dealsChange: -2.1,
          conversionRate: 24.5,
          conversionChange: 3.2
        },
        revenueChart: [
          { month: 'Jan', revenue: 65000 },
          { month: 'Feb', revenue: 72000 },
          { month: 'Mar', revenue: 68000 },
          { month: 'Apr', revenue: 89000 },
          { month: 'May', revenue: 95000 },
          { month: 'Jun', revenue: 125000 }
        ],
        pipelineChart: [
          { name: 'Lead', value: 25 },
          { name: 'Qualified', value: 40 },
          { name: 'Proposal', value: 20 },
          { name: 'Negotiation', value: 10 },
          { name: 'Closed Won', value: 5 }
        ],
        recentActivities: [
          {
            id: '1',
            type: 'customer_created',
            description: 'New customer John Doe was added',
            createdAt: '2024-01-25T14:30:00Z'
          },
          {
            id: '2',
            type: 'deal_updated',
            description: 'Deal with Tech Corp moved to negotiation',
            createdAt: '2024-01-25T13:15:00Z'
          }
        ]
      })
    };
  }
  
  // Default mock response
  return {
    ok: false,
    status: 404,
    json: async () => ({ message: 'Mock API: Endpoint not found' })
  };
};