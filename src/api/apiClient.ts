/**
 * API Client đơn giản sử dụng Axios
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from './endpoints';

interface RequestOptions extends AxiosRequestConfig {
  data?: any;
}

/**
 * Base client cho các API requests
 */
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Gửi cookies với mỗi request
    });

    // Interceptor đơn giản để thêm token vào header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers['Authorization'] = token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Xử lý lỗi cơ bản
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Xử lý lỗi 401 (Unauthorized)
        if (error.response?.status === 401) {
          // Có thể chuyển hướng về trang đăng nhập nếu cần
          console.error('Lỗi xác thực: Phiên đăng nhập hết hạn');
          localStorage.removeItem('accessToken');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, options);
      return response.data;
    } catch (error) {
      console.error(`Lỗi GET request đến ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        endpoint, 
        options.data, 
        { ...options, data: undefined }
      );
      return response.data;
    } catch (error) {
      console.error(`Lỗi POST request đến ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * patch request
   */
  async patch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    console.log(endpoint,options)
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.patch(
        endpoint, 
        options.data, 
        { ...options, data: undefined }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      console.error(`Lỗi patch request đến ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    console.log ("endpoint",endpoint)
    console.log("option",options)
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(
        endpoint, 
        options
      );
      return response.data;
    } catch (error) {
      console.error(`Lỗi DELETE request đến ${endpoint}:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

export { ApiClient };
