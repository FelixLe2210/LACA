// src/utils/validation.js

// Hàm kiểm tra định dạng email đơn giản
export const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};