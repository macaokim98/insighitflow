import { baseApi } from './baseApi';

interface DashboardData {
  kpis: {
    revenue: number;
    revenueChange: number;
    customers: number;
    customersChange: number;
    activeDeals: number;
    dealsChange: number;
    conversionRate: number;
    conversionChange: number;
  };
  revenueChart: Array<{ month: string; revenue: number }>;
  pipelineChart: Array<{ name: string; value: number }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => '/analytics/dashboard',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
} = analyticsApi;