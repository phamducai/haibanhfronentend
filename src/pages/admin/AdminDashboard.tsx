
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Package, Users, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { courseService } from '@/api/services/courseService';
import { userProductService } from '@/api';
import { authService } from '@/api/services/authService';

// Loading card component for statistics
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[100px] mb-2" />
      <Skeleton className="h-3 w-[200px]" />
    </CardContent>
  </Card>
);

// Main AdminDashboard component
const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    totalCourses: number;
    totalTemplates: number;
    totalUsers: number;
    totalRevenue: number;
  }>({
    totalCourses: 0,
    totalTemplates: 0,
    totalUsers:0, // Mock value
    totalRevenue: 0 // Mock value in VND
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Using Promise.all to fetch courses and templates counts in parallel
        const [coursesResponse, templatesResponse, usersResponse, totalAmountResponse] = await Promise.all([
          courseService.getCountCoursesAsProducts(true), // Courses (isCourse = true)
          courseService.getCountCoursesAsProducts(false), // Templates (isCourse = false)
          authService.getCountUsers(),
          userProductService.getTotalAmountAdmin(),
        ]);
         
        console.log(coursesResponse,templatesResponse,"templatesResponse")
        setStats(prevStats => ({
          ...prevStats,
          totalCourses: coursesResponse,
          totalTemplates: templatesResponse,
          totalUsers: usersResponse,
          totalRevenue: totalAmountResponse,
        }));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }
  
  const { totalCourses, totalTemplates, totalUsers, totalRevenue } = stats;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số khoá học</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Các khóa học đang cung cấp</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số templates</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">Templates đang cung cấp</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số người dùng</CardTitle>
            <Users className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Người dùng đã đăng ký</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Doanh thu tháng này</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê mua hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu mua hàng gần đây</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Người dùng mới đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu người dùng mới</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
