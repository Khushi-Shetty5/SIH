// utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[0-9]{10,15}$/;
  return re.test(phone);
};

export const validateDate = (date) => {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(date)) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const required = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};