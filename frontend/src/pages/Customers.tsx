import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Chip,
  IconButton,
  Avatar,
  Typography,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from '@mui/material';

import {
  Search,
  Edit,
  Delete,
  Add,
  Visibility,
  TrendingUp,
  People,
  Star,
  AttachMoney,
} from '@mui/icons-material';
import { useGetCustomersQuery, useGetCustomerStatsQuery, useDeleteCustomerMutation } from '../store/api/customerApi';
import CustomerForm from '../components/customers/CustomerForm';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  const { data: customersData, isLoading } = useGetCustomersQuery({
    page: page + 1,
    limit: rowsPerPage,
    search: search || undefined,
  });

  const { data: stats } = useGetCustomerStatsQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteCustomer = async () => {
    if (deleteCustomerId) {
      await deleteCustomer(deleteCustomerId);
      setDeleteCustomerId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Customer
        </Button>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 3, mb: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.total}</Typography>
                    <Typography color="text.secondary">Total Customers</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.newThisMonth}</Typography>
                    <Typography color="text.secondary">New This Month</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.averageScore.toFixed(1)}</Typography>
                    <Typography color="text.secondary">Average Score</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 2, color: 'info.main' }} />
                  <Box>
                    <Typography variant="h4">${stats.totalLifetimeValue.toLocaleString()}</Typography>
                    <Typography color="text.secondary">Total LTV</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Search */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="center">Score</TableCell>
              <TableCell align="right">Lifetime Value</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customersData?.data.map((customer) => (
              <TableRow
                key={customer.id}
                hover
                sx={{ cursor: 'pointer' }}
              >
                <TableCell onClick={() => navigate(`/customers/${customer.id}`)}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>
                      {customer.firstName[0]}{customer.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{customer.company || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {customer.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={customer.score}
                    color={getScoreColor(customer.score)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  ${customer.lifetimeValue.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customers/${customer.id}`);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCustomerId(customer.id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={customersData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Create Customer Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <CustomerForm onSuccess={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCustomerId} onClose={() => setDeleteCustomerId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this customer?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCustomerId(null)}>Cancel</Button>
          <Button onClick={handleDeleteCustomer} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;