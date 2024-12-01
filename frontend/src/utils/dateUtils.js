import dayjs from 'dayjs'

export const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('MMM DD, YYYY')
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return dayjs(date).format('MMM DD, YYYY h:mm A')
}

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  return dayjs(checkOut).diff(dayjs(checkIn), 'day')
}

export const calculateTotalPrice = (pricePerNight, checkIn, checkOut) => {
  const nights = calculateNights(checkIn, checkOut)
  return nights * pricePerNight
}

export const isDateInPast = (date) => {
  if (!date) return false
  return dayjs(date).isBefore(dayjs(), 'day')
}

export const getDateRangeText = (startDate, endDate) => {
  if (!startDate || !endDate) return ''
  return `${formatDate(startDate)} - ${formatDate(endDate)} (${calculateNights(startDate, endDate)} night${calculateNights(startDate, endDate) !== 1 ? 's' : ''})`
}
