import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Chip,
  Autocomplete,
  Stack,
} from '@mui/material';
import { useCreateCustomerMutation } from '../../store/api/customerApi';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  company: yup.string().optional(),
  phone: yup.string().optional(),
  tags: yup.array().of(yup.string()).default([]),
});

interface CustomerFormData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  tags?: string[];
}

interface CustomerFormProps {
  onSuccess?: () => void;
}

const commonTags = ['VIP', 'Potential', 'Active', 'New', 'Enterprise', 'SMB'];

const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess }) => {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      company: undefined,
      phone: undefined,
      tags: [],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const customerData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || undefined,
        phone: data.phone || undefined,
        tags: data.tags?.filter(Boolean) || undefined,
      };
      await createCustomer(customerData).unwrap();
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Box>
        
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Company"
                fullWidth
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                fullWidth
              />
            )}
          />
        </Box>
        
        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={commonTags}
              freeSolo
              value={value || []}
              onChange={(_, newValue) => onChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags..."
                />
              )}
            />
          )}
        />
      </Stack>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={() => reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Customer'}
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerForm;