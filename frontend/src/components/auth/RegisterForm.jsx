import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { ValidationRules, useFormValidation } from '../../utils/validation';

const RegisterForm = ({ onSubmit }) => {
  const validationRules = {
    email: [ValidationRules.required, ValidationRules.email],
    password: [ValidationRules.required, ValidationRules.password],
    firstName: [ValidationRules.required, ValidationRules.minLength(2)],
    lastName: [ValidationRules.required, ValidationRules.minLength(2)],
    phone: [ValidationRules.required, ValidationRules.phone],
  };

  const initialState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  };

  const {
    values,
    errors,
    isValid,
    handleChange,
    validateForm,
  } = useFormValidation(initialState, validationRules);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="First Name"
        name="firstName"
        value={values.firstName}
        onChange={(e) => handleChange('firstName', e.target.value)}
        error={!!errors.firstName}
        helperText={errors.firstName}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
        value={values.lastName}
        onChange={(e) => handleChange('lastName', e.target.value)}
        error={!!errors.lastName}
        helperText={errors.lastName}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="phone"
        label="Phone Number"
        name="phone"
        value={values.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!isValid}
      >
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
