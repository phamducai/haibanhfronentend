/**
 * API endpoints configuration based on Haibanh API Postman collection
 */

// Base URL for all API requests - adjust based on your environment
export const API_BASE_URL = "/api/v1";
export const PRODUCTS_BASE_URL = `products`;
export const BASE_URL_LOCAL = "http://localhost:3000/api/v1";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  GOOGLE_AUTH: "/auth/google",
  CURRENT_USER: "/auth/me",
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
};

// Course endpoints
export const COURSE_ENDPOINTS = {
  BASE: PRODUCTS_BASE_URL,
  ALL: () => `${PRODUCTS_BASE_URL}`,
  DETAILS: (id: string) => `${PRODUCTS_BASE_URL}/${id}`,
  CREATE: () => PRODUCTS_BASE_URL,
  UPDATE: (id: string) => `${PRODUCTS_BASE_URL}/${id}`,
  DELETE: (id: string) => `${PRODUCTS_BASE_URL}/${id}`,
  UPLOAD_IMAGE: (id: string) => `${PRODUCTS_BASE_URL}/${id}/upload`,
  ENROLL: (id: string) => `${API_BASE_URL}/enrollments/${id}`,
  // Chapters related endpoints
  CHAPTERS: (courseId: string) =>
    `${API_BASE_URL}/courses/${courseId}/chapters`,
  CHAPTER_DETAILS: (courseId: string, chapterId: string) =>
    `${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}`,
  COUNT: () => `${PRODUCTS_BASE_URL}/stats/count`,
  PRODUCT_USER: () => `${PRODUCTS_BASE_URL}/userid/home`,
};
