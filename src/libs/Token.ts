export const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const TOKEN_KEY = "movieBookingToken";

export const handleToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return "Bearer " + token;
};