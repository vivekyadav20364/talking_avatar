import axios from "axios";

const API = axios.create({
  baseURL: "https://api-interview.ezsync.in",
});
 
// Attach token to headers
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("interview-user"));
  const token=user?.token;
  if (user) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;