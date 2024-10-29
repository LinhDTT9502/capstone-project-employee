export const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
};

export const isValidPhoneNumber = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

export const isValidBirthdate = (birthDate) => {
  return new Date(birthDate) <= new Date();
};

export const isValidGender = (gender) => {
  return ["male", "female", "other"].includes(gender.toLowerCase());
};

export const validateNewUserData = (newUserData) => {
  const errors = {};
  if (!newUserData.username) errors.username = "Missing fields";
  if (!newUserData.password) errors.password = "Missing fields";
  if (!newUserData.fullName) errors.fullName = "Missing fields";
  if (!newUserData.email || !isValidEmail(newUserData.email))
    errors.email = "Invalid email";
  if (!newUserData.phone || !isValidPhoneNumber(newUserData.phone))
    errors.phone = "Invalid phone";
  if (!newUserData.birthDate || !isValidBirthdate(newUserData.birthDate))
    errors.birthDate = "Invalid birthdate";
  if (!newUserData.gender || !isValidGender(newUserData.gender))
    errors.gender = "Invalid gender";

  return errors;
};
