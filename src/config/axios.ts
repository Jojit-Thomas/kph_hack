import axiosBase from "axios";

const axios = axiosBase.create({
  // Default to Next.js API routes if env not provided
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
});

export default axios;