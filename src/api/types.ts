
/**
 * Type definitions for API data based on Haibanh API
 */

//products

export interface ProductCourse {
  productid: string;
  productname: string;
  iscourse?: boolean;
  description?: string;
  regularprice: string;
  saleprice?: string;
  imageurl?: string;
  downloadurl?: string;
  isactive?: boolean;
  isdeleted?: boolean;
}
// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullname?: string;
  phone:string
}

export interface GoogleAuthRequest {
  email: string;
  googleId?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// User related types
export interface User {
  id: string;
  fullname?: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}

export interface UserProfile {
  id: string;
  fullname?: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}


export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
export interface ChapterName {
  chaptername: string;
}
export interface Lesson {
 lessonid: string;
 chapterid: string;
 lessonname: string;
 videourl: string;
 duration: string;
 displayorder: number;
 description: string;
 createdat: string;  // ISO 8601 format (e.g., "2025-05-14T16:03:49.541Z")
 updatedat: string;  // ISO 8601 format (e.g., "2025-05-14T16:03:49.541Z")
 isdeleted: boolean;
 productid: string;
 chapters: ChapterName;
}
export interface VideoInput {
  lessonname: string;
  description?: string;
  chapterid: string;
  displayorder: number;
}
