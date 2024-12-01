export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validatePhoneNumber = (phoneNumber) => {
  // Basic phone number validation - can be adjusted based on requirements
  const re = /^\+?[\d\s-]{10,}$/
  return re.test(phoneNumber)
}

export const validateBookingDates = (checkIn, checkOut) => {
  const errors = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!checkIn) {
    errors.push('Check-in date is required')
  } else if (checkIn < today) {
    errors.push('Check-in date cannot be in the past')
  }

  if (!checkOut) {
    errors.push('Check-out date is required')
  } else if (checkOut <= checkIn) {
    errors.push('Check-out date must be after check-in date')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateCampsiteForm = (data) => {
  const errors = {}

  if (!data.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required'
  }

  if (!data.location?.trim()) {
    errors.location = 'Location is required'
  }

  if (!data.price_per_night || data.price_per_night <= 0) {
    errors.price_per_night = 'Valid price per night is required'
  }

  if (!data.total_spots || data.total_spots <= 0) {
    errors.total_spots = 'Valid number of total spots is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateReview = (data) => {
  const errors = {}

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating between 1 and 5 is required'
  }

  if (!data.comment?.trim()) {
    errors.comment = 'Comment is required'
  } else if (data.comment.length < 10) {
    errors.comment = 'Comment must be at least 10 characters long'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
