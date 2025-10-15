// validators.js
import ApiError from "./ApiError.js";

 function validateFullName(fullName) {
  if (!fullName) throw new ApiError(400, "Fullname is required");
  if (fullName.length < 2) throw new ApiError(400, "Fullname must be at least 2 characters long");
  if (fullName.length > 50) throw new ApiError(400, "Fullname must not exceed 50 characters");
  if (!/^[a-zA-Z ]+$/.test(fullName)) throw new ApiError(400, "Fullname can only contain letters and spaces");
}


 function validateUsername(username) {
  if (!username) throw new ApiError(400, "Username is required");
  if (username.length < 3) throw new ApiError(400, "Username must be at least 3 characters long");
  if (username.length > 20) throw new ApiError(400, "Username must not exceed 20 characters");
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    throw new ApiError(400, "Username can only contain letters, numbers, and underscores");
}


 function validatePassword(password) {
  if (!password) throw new ApiError(400, "Password is required");
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters long");
  if (!/[A-Z]/.test(password)) throw new ApiError(400, "Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) throw new ApiError(400, "Password must contain at least one lowercase letter");
  if (!/\d/.test(password)) throw new ApiError(400, "Password must contain at least one number");
  if (!/[!@#$%^&*]/.test(password))
    throw new ApiError(400, "Password must contain at least one special character (!@#$%^&*)");
}


 function validateEmail(email) {
  if (!email) throw new ApiError(400, "Email is required");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) throw new ApiError(400, "Enter a valid email address");
}


export default function validateUserInput({ fullName, username, password, email }) {
  validateFullName(fullName);
  validateUsername(username);
  validatePassword(password);
  validateEmail(email);
}
