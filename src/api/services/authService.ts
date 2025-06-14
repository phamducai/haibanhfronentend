/**
 * Authentication Service
 * Handles user authentication operations like login, register, etc.
 */
import { apiClient } from "../apiClient";
import { AUTH_ENDPOINTS, BASE_URL_LOCAL } from "../endpoints";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  GoogleAuthRequest,
} from "../types";
import axios from "axios";

export const authService = {
  /**
   * Log in a user
   * @param data User login credentials
   */
  async login(data: LoginRequest): Promise<any> {
    return axios.post<AuthResponse>(
      `${BASE_URL_LOCAL}${AUTH_ENDPOINTS.LOGIN}`,
      data
    );
  },

  /**
   * Register a new user
   * @param data User registration data
   */
  async register(data: RegisterRequest): Promise<any> {
    console.log(AUTH_ENDPOINTS.REGISTER, data);
    return axios.post<AuthResponse>(
      `${BASE_URL_LOCAL}${AUTH_ENDPOINTS.REGISTER}`,
      data
    );
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
    console.log("Google Auth Data:", googleData);
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
};
