import { baseApi } from './baseApi';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tags: string[];
  score: number;
  lifetimeValue: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCustomerInput {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  address?: Customer['address'];
  tags?: string[];
}

interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  score?: number;
}

interface CustomerFilter {
  search?: string;
  tags?: string[];
  minScore?: number;
  maxScore?: number;
  company?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'score' | 'lifetimeValue';
  sortOrder?: 'ASC' | 'DESC';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<PaginatedResponse<Customer>, CustomerFilter>({
      query: (filter) => ({
        url: '/customers',
        params: filter,
      }),
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerInput>({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; data: UpdateCustomerInput }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, 'Customer'],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
    getCustomerStats: builder.query<{
      total: number;
      newThisMonth: number;
      averageScore: number;
      totalLifetimeValue: number;
    }, void>({
      query: () => '/customers/stats',
      providesTags: ['Customer'],
    }),
    updateCustomerScore: builder.mutation<Customer, { id: string; score: number }>({
      query: ({ id, score }) => ({
        url: `/customers/${id}/score`,
        method: 'PATCH',
        body: { score },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, 'Customer'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerStatsQuery,
  useUpdateCustomerScoreMutation,
} = customerApi;