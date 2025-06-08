
/**
 * Chapter Service
 * Handles chapter and video content operations for courses
 */
import { apiClient } from '../apiClient';

// Interface cho Chapter - matches exact backend structure

export interface Chapter {
  chapterid: string;
  chaptername: string;
  displayorder: number;
  productid: string; 
  createdat?: string;
  updatedat?: string;
  isdeleted?: boolean;
}


// Interface cho Video

// Interface cho tạo/cập nhật Chapter
export interface ChapterInput {
  productid:string
  chaptername: string;
  displayorder: number;
}

export const chapterService = {
  /**
   * Lấy danh sách các chương cho một khóa học
   * @param productid ID của khóa học
   */
  async getChaptersByCourseId(productid: string): Promise<Chapter[]> {
    try {
      const response = await apiClient.get<Chapter[]>(`/chapters`, {
        params: {
          productid
        }
      });
      console.log('Chapters API response:', response);
      // Ensure we always return an array
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  },

  /**
   * Lấy thông tin chi tiết của một chương
   * @param chapterId ID của chương
   */
async getChapterById(chapterId: string): Promise<Chapter> {
    const response = await apiClient.get<Chapter>(`/chapters/${chapterId}`);
    return response
  },
  /**
   * Tạo chương mới cho khóa học
   * @param courseId ID của khóa học
   * @param chapterData Dữ liệu chương mới
   */
  async createChapter(chapterData: ChapterInput): Promise<Chapter> {    
    return await apiClient.post<Chapter>(`/chapters`, {
      data: chapterData
    });
  },

  /**
   * Cập nhật thông tin chương
   * @param chapterId ID của chương
   * @param chapterData Dữ liệu cập nhật
   */
  async updateChapter(chapterId: string, chapterData: Partial<ChapterInput>): Promise<Chapter> {
    // Convert frontend input to backend format
 
    return await apiClient.patch<Chapter>(`/chapters/${chapterId}`, {
      data: chapterData
    });
  },

  /**
   * Xóa một chương
   * @param chapterId ID của chương cần xóa
   */
  async deleteChapter(chapterId: string): Promise<Chapter> {
    return await apiClient.delete<Chapter>(`/chapters/${chapterId}`);
  },

 
};
