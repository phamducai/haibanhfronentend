/**
 * Authentication Service
 * Handles user authentication operations like login, register, etc.
 */
import { apiClient } from "../apiClient";
import { AUTH_ENDPOINTS } from "../endpoints";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  GoogleAuthRequest,
} from "../types";

export const authService = {
  /**
   * Log in a user
   * @param credentials User login credentials
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
      data: credentials,
    });
  },

  /**
   * Register a new user
   * @param userData User registration data
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log(AUTH_ENDPOINTS.REGISTER, userData);
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
      data: userData,
    });
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },

  /**
   * Authenticate with Google
   * @param googleData Google authentication data
   */
  async googleAuth(googleData: GoogleAuthRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.GOOGLE_AUTH, {
      data: googleData,
    });
  },

  /**
   * Get current authenticated user information
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(AUTH_ENDPOINTS.CURRENT_USER);
  },

  /**
   * Refresh the authentication token
   * This will typically use the refresh token stored in cookies
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    return apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
  },


  async checkEmail(email: string): Promise<boolean> {
    return apiClient.post<boolean>(`/users/byemail`, {
      data: { email }
    });
  },

  async checkPhone(phone: string): Promise<boolean> {
    return apiClient.post<boolean>(`/users/byphone`, {
      data: { phone }
    });
  },

  async getCountUsers(): Promise<number> {
    return apiClient.get<number>(`/users/count`);
  }
};
