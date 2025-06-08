
/**
 * Course Service
 * Handles products/courses-related operations
 */
import { apiClient } from '../apiClient';
import { COURSE_ENDPOINTS } from '../endpoints';
import { ProductCourse } from '../types';

export const courseService = {
  /**
   * Get all products that are courses
   * @param search Optional search query
   */
  async getCoursesAsProducts(search?: string, isCourse?: boolean,): Promise<ProductCourse[]> {
    try {
      const response = await apiClient.get<ProductCourse[]>(COURSE_ENDPOINTS.ALL(), {
        params: {
          ...(search ? { search } : {}),
          ...(isCourse !== undefined ? { iscourse: isCourse } : {})
        }
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },
  
  /**
   * Get a product/course by ID
   * @param productId Product/Course ID
   */
  async getCourseById(productId: string): Promise<ProductCourse> {
    return apiClient.get<ProductCourse>(COURSE_ENDPOINTS.DETAILS(productId));
  },
  
  /**
   * Create a new product/course with image upload
   * @param courseData Course data and image file
   */
  async createCourse(courseData: FormData): Promise<ProductCourse> {
    return apiClient.post<ProductCourse>(COURSE_ENDPOINTS.CREATE(), {
      data: courseData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Update an existing product/course
   * @param productId Product/Course ID
   * @param courseData Updated course data
   */
  async updateCourse(productId: string, courseData: Partial<ProductCourse>): Promise<ProductCourse> {
    return apiClient.patch<ProductCourse>(COURSE_ENDPOINTS.UPDATE(productId), {
      data: courseData
    });
  },
  
  /**
   * Upload image to an existing product/course
   * @param productId Product/Course ID
   * @param imageFile Image file to upload (FormData containing file)
   */
  async uploadCourseImage(productId: string, imageFile: FormData): Promise<{ imageUrl: string }> {
    return apiClient.post<{ imageUrl: string }>(COURSE_ENDPOINTS.UPLOAD_IMAGE(productId), {
      data: imageFile,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * Delete a product/course
   * @param productId Product/Course ID
   */
  async deleteCourse(productId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(COURSE_ENDPOINTS.DELETE(productId));
  },

  /**
   * Get details for a specific course
   * @param courseId Course ID
   */
  async getCourseDetails(courseId: string): Promise<ProductCourse> {
    return apiClient.get<ProductCourse>(COURSE_ENDPOINTS.DETAILS(courseId));
  },

  /**
   * Enroll the current user in a course
   * @param courseId Course ID
   */
  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    return apiClient.post(COURSE_ENDPOINTS.ENROLL(courseId));
  },
  
  async getCountCoursesAsProducts(isCourse?: boolean): Promise<number> {
    try {
      const response = await apiClient.get<number>(COURSE_ENDPOINTS.COUNT(), {
        params: {
          ...(isCourse !== undefined ? { iscourse: isCourse } : {})
        }
      });
      console.log('Count API response:', response);
      return typeof response === 'number' ? response : 0;
    } catch (error) {
      console.error('Error fetching course count:', error);
      return 0;
    }
  },

  async getUserbyProduct(): Promise<ProductCourse[]>{
    try {
      // apiClient.get trả về AxiosResponse có thuộc tính data chứa mảng ProductCourse
      const response = await apiClient.get<ProductCourse[]>(COURSE_ENDPOINTS.PRODUCT_USER());
      return response
    } catch (error) {
      console.error('Error getting user by product:', error);
      return [];
    }
  }
};
