// Validation rules
export const ValidationRules = {
  required: (value) => ({
    isValid: value !== undefined && value !== null && value !== '',
    message: 'This field is required',
  }),
  email: (value) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address',
  }),
  minLength: (min) => (value) => ({
    isValid: value && value.length >= min,
    message: `Must be at least ${min} characters`,
  }),
  maxLength: (max) => (value) => ({
    isValid: value && value.length <= max,
    message: `Must be no more than ${max} characters`,
  }),
  password: (value) => ({
    isValid: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
    message: 'Password must be at least 8 characters with letters and numbers',
  }),
  phone: (value) => ({
    isValid: /^\+?[\d\s-]{10,}$/.test(value),
    message: 'Please enter a valid phone number',
  }),
  date: (value) => ({
    isValid: !isNaN(Date.parse(value)),
    message: 'Please enter a valid date',
  }),
  future: (value) => ({
    isValid: new Date(value) > new Date(),
    message: 'Date must be in the future',
  }),
  number: (value) => ({
    isValid: !isNaN(value) && value !== '',
    message: 'Please enter a valid number',
  }),
  positive: (value) => ({
    isValid: Number(value) > 0,
    message: 'Number must be positive',
  }),
};

// Validation helper function
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const validation = rule(value);
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true, message: '' };
};

// Form validation hook
export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach((field) => {
      const value = values[field];
      const fieldRules = validationRules[field];
      const validation = validateField(value, fieldRules);

      if (!validation.isValid) {
        formIsValid = false;
        newErrors[field] = validation.message;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validationRules]);

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    validateForm,
    setValues,
  };
};
