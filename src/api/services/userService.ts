/**
 * User Service
 * Handles user profile operations
 */
import { apiClient } from '../apiClient';
import { USER_ENDPOINTS } from '../endpoints';
import type { UserProfile } from '../types';

export const userService = {
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(USER_ENDPOINTS.PROFILE);
  },

  /**
   * Update the current user's profile
   * @param profileData Updated profile data
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(USER_ENDPOINTS.UPDATE_PROFILE, {
      data: profileData
    });
  },

  /**
   * Change the user's password
   * @param currentPassword Current password
   * @param newPassword New password
   * @param newPasswordConfirmation New password confirmation
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ): Promise<{ message: string }> {
    return apiClient.post(USER_ENDPOINTS.CHANGE_PASSWORD, {
      data: {
        currentPassword,
        newPassword,
        newPasswordConfirmation
      }
    });
  }
};
