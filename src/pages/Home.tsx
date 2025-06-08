
import React, { useState, Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import { courseService } from '../api/services/courseService';
import { Skeleton } from '../components/ui/skeleton';
import { ProductCourse } from '../api/types';
import { CourseCardProps } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  
  // Kiểm tra xem người dùng đã đăng nhập chưa và chọn API phù hợp
  const {
    data: coursesData,
    isLoading,
    isError: error
  } = useQuery<ProductCourse[]>({
    queryKey: ['products', searchQuery, isAuthenticated],
    queryFn: async () => {
      // Nếu đã đăng nhập, sử dụng API getUserbyProduct
      if (isAuthenticated) {
        const response = await courseService.getUserbyProduct();
        return response || [];
      } else {
        // Nếu chưa đăng nhập, sử dụng API getCoursesAsProducts
        return courseService.getCoursesAsProducts(searchQuery || undefined);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: true,
  });
  
  // Chuyển đổi ProductCourse[] thành CourseCardProps[] để sử dụng với ProductGrid
  const transformedCourses: CourseCardProps[] = coursesData?.map(course => {
    return {
      id: course.productid,
      title: course.productname,
      description: course.description || 'Mô tả đang được cập nhật',
      image: course.imageurl || 'https://placehold.co/600x400?text=N8N',
      price: course.saleprice,
      regularPrice: course.regularprice,
      type: course.iscourse ? 'Khóa học' : 'Template'
    };
  }) || [];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <Suspense fallback={
        <div className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Khóa học và Template nổi bật</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Khám phá các khóa học và template n8n giúp bạn tự động hóa quy trình làm việc và tăng năng suất
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-[28px] w-3/4" />
                <Skeleton className="h-[20px] w-full" />
              </div>
            ))}
          </div>
        </div>
      }>
        {isLoading ? (
          <div className="py-16 container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3">Khóa học và Template nổi bật</h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Khám phá các khóa học và template n8n giúp bạn tự động hóa quy trình làm việc và tăng năng suất
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <Skeleton className="h-[28px] w-3/4" />
                  <Skeleton className="h-[20px] w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="py-16 container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-center mb-3">Khóa học và Template nổi bật</h2>
            <p className="text-red-500 mt-4">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        ) : (
          <ProductGrid 
            products={transformedCourses}
            title="Khóa học và Template nổi bật"
            subtitle="Khám phá các khóa học và template n8n giúp bạn tự động hóa quy trình làm việc và tăng năng suất"
          />
        )}
      </Suspense>
      
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Tại sao chọn Haismartlife?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3">Chuyên môn</h3>
                <p className="text-gray-600">
                  Kinh nghiệm thực tế và chuyên môn sâu về automation và AI, đặc biệt với nền tảng n8n.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3">Dễ áp dụng</h3>
                <p className="text-gray-600">
                  Các bài học và template được thiết kế để dễ dàng áp dụng vào thực tế, giúp bạn tự động hóa ngay lập tức.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3">Hỗ trợ liên tục</h3>
                <p className="text-gray-600">
                  Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn trong quá trình học tập và ứng dụng các giải pháp tự động hóa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Câu hỏi thường gặp</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">n8n là gì?</h3>
                <p className="text-gray-600">
                  n8n là một công cụ tự động hóa quy trình làm việc mã nguồn mở, giúp kết nối các ứng dụng và dịch vụ khác nhau mà không cần viết mã.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Tôi cần biết lập trình để sử dụng n8n không?</h3>
                <p className="text-gray-600">
                  Không, n8n được thiết kế với giao diện trực quan, kéo thả, giúp người dùng không có kiến thức lập trình vẫn có thể tạo các quy trình tự động hóa phức tạp.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Làm thế nào để bắt đầu với n8n?</h3>
                <p className="text-gray-600">
                  Bạn có thể bắt đầu bằng cách đăng ký khóa học cơ bản của chúng tôi hoặc mua một template để hiểu cách n8n hoạt động và cách tạo workflow đầu tiên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
