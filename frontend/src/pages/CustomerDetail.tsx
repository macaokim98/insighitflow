import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';

import {
  ArrowBack,
  Edit,
  Email,
  Phone,
  Business,
  LocationOn,
  TrendingUp,
} from '@mui/icons-material';
import { useGetCustomerQuery } from '../store/api/customerApi';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, error } = useGetCustomerQuery(id!);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !customer) {
    return <Typography>Customer not found</Typography>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/customers')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Customer Details
        </Typography>
        <Button variant="contained" startIcon={<Edit />}>
          Edit Customer
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Customer Info */}
        <Box sx={{ flex: "2 1 600px" }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  fontSize: '2rem',
                }}
              >
                {customer.firstName[0]}{customer.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {customer.firstName} {customer.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {customer.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {customer.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Contact Information */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 300px" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{customer.email}</Typography>
                  </Box>
                </Box>
              </Box>
              {customer.phone && (
                <Box sx={{ flex: "1 1 300px" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">{customer.phone}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {customer.company && (
                <Box sx={{ flex: "1 1 300px" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Business sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Company
                      </Typography>
                      <Typography variant="body1">{customer.company}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {customer.address && (
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOn sx={{ mr: 2, color: 'text.secondary', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {customer.address.street}<br />
                        {customer.address.city}, {customer.address.state} {customer.address.zipCode}<br />
                        {customer.address.country}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Metrics */}
        <Box sx={{ flex: "2 1 600px" }}>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ width: "100%" }}>
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4">
                      <Chip
                        label={customer.score}
                        color={getScoreColor(customer.score)}
                        size="medium"
                      />
                    </Typography>
                    <Typography color="text.secondary">Customer Score</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      ${customer.lifetimeValue.toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary">Lifetime Value</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Customer Since
                    </Typography>
                    <Typography variant="body1">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Deals and Interactions would go here */}
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              No recent activity found. Deals and interactions will be displayed here.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerDetail;