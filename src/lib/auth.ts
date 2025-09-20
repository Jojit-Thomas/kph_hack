import axios from "@/config/axios";

export const checkAuth = async (): Promise<boolean> => {
  try {
    axios.interceptors.request.use((config) => {
      // For server-side requests, include cookies
      if (typeof window === "undefined") {
        try {
          const { cookies } = require("next/headers");
          const cookieHeader = cookies().toString();
          if (cookieHeader) {
            config.headers.Cookie = cookieHeader;
          }
        } catch (error) {
          // Handle cases where cookies() might not be available
          console.warn("Could not access cookies on server:", error);
        }
      }
      return config;
    });

    const response = await axios.get(`/auth/test`);

    return response.status === 200;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};
