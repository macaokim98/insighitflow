import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import type { RootState } from '../store';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'admin@insightflow.com',
      password: 'admin123',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('🔐 Login attempt:', data);
      const result = await login(data).unwrap();
      console.log('✅ Login success:', result);
      dispatch(setCredentials(result));
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ minWidth: 400, p: 2 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                InsightFlow CRM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(error as any)?.data?.message || 'Login failed. Please try again.'}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Demo Credentials:
              </Typography>
              <Typography variant="body2">
                Email: admin@insightflow.com<br />
                Password: admin123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;