import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Speed,
  Person,
  Business,
  Phone,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetDashboardDataQuery } from '../store/api/analyticsApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: change > 0 ? 'success.main' : 'error.main',
              mt: 1,
            }}
          >
            {change > 0 ? '+' : ''}{change}% from last month
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useGetDashboardDataQuery();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !data) {
    return <Typography>Error loading dashboard data</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3 }}>
        <KPICard
          title="Total Revenue"
          value={`$${data.kpis.revenue.toLocaleString()}`}
          change={data.kpis.revenueChange}
          icon={<AttachMoney sx={{ color: 'primary.main' }} />}
          color="primary"
        />
        <KPICard
          title="Total Customers"
          value={data.kpis.customers.toLocaleString()}
          change={data.kpis.customersChange}
          icon={<People sx={{ color: 'success.main' }} />}
          color="success"
        />
        <KPICard
          title="Active Deals"
          value={data.kpis.activeDeals.toLocaleString()}
          change={data.kpis.dealsChange}
          icon={<TrendingUp sx={{ color: 'warning.main' }} />}
          color="warning"
        />
        <KPICard
          title="Conversion Rate"
          value={`${data.kpis.conversionRate}%`}
          change={data.kpis.conversionChange}
          icon={<Speed sx={{ color: 'info.main' }} />}
          color="info"
        />
      </Box>

      {/* Charts and Activities */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 600px', minWidth: 0 }}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Deal Pipeline
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data.pipelineChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.pipelineChart.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>

      {/* Recent Activities */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Activities
          </Typography>
          <List>
            {data.recentActivities.map((activity) => (
              <ListItem key={activity.id}>
                <ListItemAvatar>
                  <Avatar>
                    {activity.type === 'customer_created' && <Person />}
                    {activity.type === 'deal_updated' && <Business />}
                    {activity.type === 'customer_updated' && <Phone />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.description}
                  secondary={new Date(activity.createdAt).toLocaleString()}
                />
                <Chip
                  label={activity.type.replace('_', ' ').toUpperCase()}
                  size="small"
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;