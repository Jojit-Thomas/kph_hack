// import axios from "@/config/axios";

// export const checkAuth = async (): Promise<boolean> => {
//   try {
//     axios.interceptors.request.use((config) => {
//       // For server-side requests, include cookies
//       if (typeof window === "undefined") {
//         try {
//           const { cookies } = require("next/headers");
//           const cookieHeader = cookies().toString();
//           if (cookieHeader) {
//             config.headers.Cookie = cookieHeader;
//           }
//         } catch (error) {
//           // Handle cases where cookies() might not be available
//           console.warn("Could not access cookies on server:", error);
//         }
//       }
//       return config;
//     });

//     const response = await axios.get(`/auth/test`);

//     return response.status === 200;
//   } catch (error) {
//     console.error("Auth check failed:", error);
//     return false;
//   }
// };

import axios from "@/config/axios";

export interface AuthUser {
  userId: string;
  [key: string]: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
}

// export async function getServerAuth(): Promise<{ isAuthenticated: boolean; user: AuthUser | null }> {
//   try {
//     const isAuthenticated = await checkAuth();
//     return { isAuthenticated, user: isAuthenticated ? { userId: "authenticated" } : null };
//   } catch (error) {
//     console.error("Server auth check failed:", error);
//     return { isAuthenticated: false, user: null };
//   }
// }

export async function getClientAuth(): Promise<{ isAuthenticated: boolean; user: AuthUser | null }> {
  try {
    const response = await axios.get("/auth/test");

    if (response.status === 200) {
      const data = response.data;
      return {
        isAuthenticated: true,
        user: data.decoded || { userId: "authenticated" },
      };
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error("Client auth check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}
