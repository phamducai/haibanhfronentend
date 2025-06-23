import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductGrid from '../components/ProductGrid';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CourseCardProps } from '../components/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { courseService, ProductCourse } from '@/api';
import { useAuth } from '@/context/AuthContext';

const CoursesList = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  // Sử dụng TanStack Query để lấy dữ liệu khóa học/template
  const {
    data: coursesData,
      isLoading,
      isError
  } = useQuery<ProductCourse[]>({
    queryKey: ['products', isAuthenticated],
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
  
  const filters = [
    { id: 'all', name: 'Tất cả' },
    { id: 'course', name: 'Khóa học' },
    { id: 'template', name: 'Template' }
  ];
  
  // Chuyển đổi ProductCourse[] thành CourseCardProps[]
  const transformedCourses: CourseCardProps[] = coursesData?.map(course => ({
    id: course.productid,
    title: course.productname,
    description: course.description || 'Mô tả đang được cập nhật',
    image: course.imageurl || 'https://placehold.co/600x400?text=N8N',
    price: course.saleprice,
    regularPrice: course.regularprice,
    type: course.iscourse ? 'Khóa học' : 'Template',
    buttonType: 3,
    downloadurl:course?.downloadurl
  })) || [];
  
  // Lọc dữ liệu theo filter và search
  const filteredCourses = transformedCourses.filter(course => {
    // Category filter
    let matchesCategory = true;
    if (activeFilter === 'course') {
      matchesCategory = course.type === 'Khóa học';
    } else if (activeFilter === 'template') {
      matchesCategory = course.type === 'Template';
    }

    // Search filter - tìm kiếm trong tên và mô tả
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = 
        course.title.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query));
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Khóa học & Template</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các khóa học và template n8n để tự động hóa quy trình làm việc 
            và tăng hiệu suất với AI và automation
          </p>
          
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm khóa học và template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // Search sẽ được thực hiện ngay lập tức thông qua filteredCourses
                  }
                }}
                className="pl-4 pr-10 py-3"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  // Focus vào input để người dùng có thể tiếp tục tìm kiếm
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  input?.focus();
                }}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Quick clear search button */}
            {searchQuery.trim() && (
              <div className="mt-2 text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Xóa tìm kiếm
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {filters.map((filter) => {
            // Đếm số lượng cho mỗi filter
            const count = filter.id === 'all' 
              ? transformedCourses.length
              : filter.id === 'course'
                ? transformedCourses.filter(c => c.type === 'Khóa học').length
                : transformedCourses.filter(c => c.type === 'Template').length;
            
            return (
              <Button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  // Clear search khi đổi filter để tránh confusion
                  if (searchQuery.trim()) {
                    setSearchQuery('');
                  }
                }}
                variant={activeFilter === filter.id ? "default" : "outline"}
                className={activeFilter === filter.id 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }
              >
                {filter.name} ({count})
              </Button>
            );
          })}
        </div>
        
        {isLoading ? (
          <div className="py-8">
            <div className="flex justify-center items-center mb-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg font-medium">Loading...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3 border rounded-lg p-4">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <Skeleton className="h-[28px] w-3/4" />
                  <Skeleton className="h-[20px] w-full" />
                  <Skeleton className="h-[20px] w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <h3 className="text-xl text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</h3>
            <p className="text-gray-600">Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Tải lại trang
            </Button>
          </div>
        ) : (
          <>
            {searchQuery.trim() && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <strong>Kết quả tìm kiếm cho "{searchQuery}":</strong> {filteredCourses.length} sản phẩm
                </p>
              </div>
            )}
            
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchQuery.trim() ? 'Không tìm thấy kết quả' : 'Chưa có sản phẩm nào'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery.trim() 
                      ? `Không có sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                      : 'Hiện tại chưa có sản phẩm nào trong danh mục này.'
                    }
                  </p>
                  {searchQuery.trim() ? (
                    <Button 
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                    >
                      Xóa bộ lọc
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : (
              <ProductGrid 
                products={filteredCourses}
                subtitle={
                  searchQuery.trim()
                    ? `${filteredCourses.length} sản phẩm được tìm thấy`
                    : activeFilter === 'all' 
                      ? `Tất cả khóa học và template (${filteredCourses.length})` 
                      : activeFilter === 'course' 
                        ? `Danh sách khóa học (${filteredCourses.length})`
                        : `Danh sách template (${filteredCourses.length})`
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesList;