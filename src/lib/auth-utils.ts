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
