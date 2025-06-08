/**
 * Lesson Service
 * Handles lesson-related operations for course consumption
 */
import { apiClient } from '../apiClient';
import { Lesson, VideoInput } from '../types';

// Interface for lesson progress
export interface LessonProgress {
  courseId: string;
  lessonId: string;
  completed: boolean;
  progress: number;
  lastAccessed: string;
}

// Interface for tracking overall course progress
export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  progress: number;
  lastAccessed: string;
}

// Interface cho tạo/cập nhật Video


export const lessonService = {
 
  async getVideosByChapterId(chapterId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<any>(`/chapters/${chapterId}/videos`);
      console.log('Videos by chapter API response:', response);
      const data = response?.data || response;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching videos by chapter:', error);
      return [];
    }
  },

  /**
   * Lấy tất cả video của một khóa học (nhóm theo chương)
   * @param courseId ID của khóa học
   */
  async getAllVideosByCourseId(courseId?: string,chapterId?: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<any>(`/lessons`, {
        params: {
          productid: courseId,
          chapterid: chapterId
        }
      });
      console.log('All videos API response:', response);
      // Ensure we always return an array
      return Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching all videos:', error);
      return [];
    }
  },

  /**
   * Lấy thông tin chi tiết của một video
   * @param videoId ID của video
   */
  async getVideoById(videoId: string): Promise<Lesson> {
    return await apiClient.get<any>(`/lessons/${videoId}`);
  },


  /**
   * Tạo video mới cho một chương
   * @param chapterId ID của chương
   * @param formData FormData chứa file video và dữ liệu video
   */
  async createVideo(formData: FormData): Promise<Lesson> {
    // Gửi request với FormData trực tiếp
    const response = await apiClient.post<any>(`/lessons`, {
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response;
  },

  /**
   * Cập nhật thông tin video
   * @param videoId ID của video
   * @param videoData Dữ liệu cập nhật
   */
  async updateVideo(videoId: string, videoData: Partial<VideoInput>): Promise<Lesson> {
    console.log("videoData",videoData)
    const response = await apiClient.patch<any>(`/lessons/${videoId}`, {
      data: videoData
    });
    return response
  },

  /**
   * Xóa một video
   * @param videoId ID của video cần xóa
   */
  async deleteVideo(videoId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<any>(`/lessons/${videoId}`);
    return response
  },

  async getLessonProgress(courseId: string, lessonId: string): Promise<LessonProgress | null> {
    // For now, we'll use localStorage
    try {
      const savedCompletedLessons = localStorage.getItem(`completedLessons_${courseId}`);
      if (savedCompletedLessons) {
        const completedLessons = JSON.parse(savedCompletedLessons);
        const isCompleted = completedLessons.includes(lessonId);
        
        return {
          courseId,
          lessonId,
          completed: isCompleted,
          progress: isCompleted ? 100 : 0,
          lastAccessed: new Date().toISOString()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  },

  /**
   * Save progress for a specific lesson
   * @param courseId Course ID
   * @param lessonId Lesson ID
   * @param completed Whether the lesson is completed
   */
  async saveLessonProgress(courseId: string, lessonId: string, completed: boolean): Promise<void> {
    try {
      // Get existing completed lessons
      const savedCompletedLessons = localStorage.getItem(`completedLessons_${courseId}`);
      let completedLessons: string[] = [];
      
      if (savedCompletedLessons) {
        completedLessons = JSON.parse(savedCompletedLessons);
      }
      
      // Add lesson to completed lessons if not already there
      if (completed && !completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem(`completedLessons_${courseId}`, JSON.stringify(completedLessons));
      }
      
      // Update purchased items with last accessed date
      const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
      const updatedItems = purchasedItems.map((item: any) => {
        if (item.id === courseId) {
          return { ...item, lastAccessed: new Date().toISOString() };
        }
        return item;
      });
      
      localStorage.setItem('purchasedItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving lesson progress:', error);
    }
  },

  /**
   * Get overall progress for a course
   * @param courseId Course ID
   * @param totalLessons Total number of lessons in the course
   */
  async getCourseProgress(courseId: string, totalLessons: number): Promise<CourseProgress | null> {
    try {
      const savedCompletedLessons = localStorage.getItem(`completedLessons_${courseId}`);
      if (savedCompletedLessons) {
        const completedLessons = JSON.parse(savedCompletedLessons);
        const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
        
        return {
          courseId,
          completedLessons,
          progress,
          lastAccessed: new Date().toISOString()
        };
      }
      return {
        courseId,
        completedLessons: [],
        progress: 0,
        lastAccessed: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting course progress:', error);
      return null;
    }
  },

  /**
   * Update overall course progress
   * @param courseId Course ID
   * @param progress Updated progress information
   */
  async updateCourseProgress(courseId: string, progress: number, completedLessons: string[]): Promise<void> {
    try {
      // Update purchased items with new progress
      const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
      const existingItemIndex = purchasedItems.findIndex((item: any) => item.id === courseId);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...purchasedItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          progress,
          lastAccessed: new Date().toISOString()
        };
        localStorage.setItem('purchasedItems', JSON.stringify(updatedItems));
      }
      
      // Save completed lessons
      localStorage.setItem(`completedLessons_${courseId}`, JSON.stringify(completedLessons));
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  }
};
