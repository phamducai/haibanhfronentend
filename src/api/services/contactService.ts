/**
 * Contact Service
 * Handles contact form submissions and communication operations
 */
import { apiClient } from "../apiClient";
import { CONTACT_ENDPOINTS } from "../endpoints";
import type { ContactRequest, ContactResponse } from "../types";

export const contactService = {
  /**
   * Send contact message
   * @param contactData Contact form data
   */
  async sendMessage(contactData: ContactRequest): Promise<ContactResponse> {
    console.log(CONTACT_ENDPOINTS.SEND_MESSAGE);
    try {
      return await apiClient.post<ContactResponse>(
        CONTACT_ENDPOINTS.SEND_MESSAGE,
        {
          data: contactData,
        }
      );
    } catch (error) {
      console.error("Error sending contact message:", error);
      throw error;
    }
  },

  /**
   * Validate contact form data before sending
   * @param contactData Contact form data to validate
   */
  validateContactData(contactData: ContactRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate name
    if (!contactData.name || contactData.name.trim().length < 2) {
      errors.push("Họ và tên phải có ít nhất 2 ký tự");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactData.email || !emailRegex.test(contactData.email)) {
      errors.push("Email không hợp lệ");
    }

    //validate phone
    const cleaned = (contactData.phone || "").replace(/\D/g, ""); // chỉ còn chữ số
    if (cleaned.length !== 10) {
      errors.push("Số điện thoại phải đúng 10 chữ số");
    }

    // Validate message
    if (!contactData.message || contactData.message.trim().length < 10) {
      errors.push("Tin nhắn phải có ít nhất 10 ký tự");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
