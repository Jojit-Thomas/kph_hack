import axiosBase from "axios";

const axios = axiosBase.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default axios;