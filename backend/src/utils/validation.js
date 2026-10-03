const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  if (typeof name !== "string") return false;

  const length = name.trim().length;

  return length >= 20 && length <= 60;
};

const validateAddress = (address) => {
  if (typeof address !== "string") return false;

  return address.trim().length <= 400;
};

const validatePassword = (password) => {
  if (typeof password !== "string") return false;

  if (password.length < 8 || password.length > 16) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(password)) {
    return false;
  }

  return true;
};

module.exports = {
  validateEmail,
  validateName,
  validateAddress,
  validatePassword,
};