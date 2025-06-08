
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, BookUser } from "lucide-react";
import { courses } from '@/data/courses';

interface PurchasedItem {
  id: string;
  type: 'course' | 'template';
  progress: number;
  lastAccessed?: string;
}

const UserDashboard = () => {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);

  // Simulate loading purchased items from localStorage
  useEffect(() => {
    // In a real application, this would come from a database
    // For demo purposes, we'll generate some fake purchased items or load from localStorage
    const loadPurchasedItems = () => {
      const savedItems = localStorage.getItem('purchasedItems');
      
      if (savedItems) {
        return JSON.parse(savedItems);
      }
      
      // Fallback demo data if no items in localStorage
      return [
        { id: "n8n-telegram-bot", type: "template", progress: 100, lastAccessed: "2023-05-01" },
        { id: "n8n-basic", type: "course", progress: 45, lastAccessed: "2023-05-10" },
        { id: "n8n-ai-integration", type: "course", progress: 20, lastAccessed: "2023-05-15" },
      ];
    };

    setPurchasedItems(loadPurchasedItems());
  }, []);

  // Get course/template details from the courses data
  const getItemDetails = (id: string) => {
    return courses.find(course => course.id === id);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const courseItems = purchasedItems.filter(item => item.type === 'course');
  const templateItems = purchasedItems.filter(item => item.type === 'template');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Trang cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý các khóa học và template đã mua</p>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="courses" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Khóa học ({courseItems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <BookUser className="mr-2 h-4 w-4" />
            <span>Template ({templateItems.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {courseItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseItems.map(item => {
                const course = getItemDetails(item.id);
                if (!course) return null;
                
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      {/* <div className="relative h-48 w-full mb-4">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg" 
                        />
                      </div> */}
                      <CardTitle>{course.productname}</CardTitle>
                      <CardDescription>
                        {item.lastAccessed && (
                          <span>Truy cập gần đây: {formatDate(item.lastAccessed)}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Tiến độ học tập</span>
                          <span className="text-sm font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                      
                      <p className="text-sm text-gray-500 line-clamp-2">{course.productname}</p>
                    </CardContent>
                    
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/khoa-hoc/${item.id}`}>
                          {item.progress === 0 ? "Bắt đầu học" : "Tiếp tục học"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-medium text-gray-600 mb-2">Bạn chưa mua khóa học nào</h3>
              <p className="text-gray-500 mb-6">Khám phá các khóa học của chúng tôi để nâng cao kỹ năng của bạn</p>
              <Button asChild>
                <Link to="/khoa-hoc">Khám phá khóa học</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {templateItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templateItems.map(item => {
                const template = getItemDetails(item.id);
                if (!template) return null;
                
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      {/* <div className="relative h-48 w-full mb-4">
                        <img 
                          src={template.image} 
                          alt={template.title} 
                          className="absolute inset-0 w-full h-full object-cover rounded-t-lg" 
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Template
                        </div>
                      </div> */}
                      <CardTitle>{template.productname}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">{template.productname}</p>
                    </CardContent>
                    
                    <CardFooter>
                      <div className="w-full flex gap-3">
                        <Button asChild className="flex-1" variant="outline">
                          <Link to={`/khoa-hoc/${item.id}`}>
                            Xem chi tiết
                          </Link>
                        </Button>
                        <Button className="flex-1">
                          Tải xuống
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookUser className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-medium text-gray-600 mb-2">Bạn chưa mua template nào</h3>
              <p className="text-gray-500 mb-6">Khám phá các template của chúng tôi để tăng hiệu suất công việc</p>
              <Button asChild>
                <Link to="/san-pham">Khám phá template</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
