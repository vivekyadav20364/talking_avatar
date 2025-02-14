import axios from "axios";
import { baseUrl } from "./baseUri";

const API = axios.create({
  baseURL: baseUrl
});
 
// Attach token to headers
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("interview-user"));
  const token=user?.token;
  if (user) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;