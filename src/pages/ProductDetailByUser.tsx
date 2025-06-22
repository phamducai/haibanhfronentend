import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../data/courses';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Download, Package, ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductGrid from '../components/ProductGrid';

const ProductDetailByUser = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const product = courses.find(course => course.id === courseId);
  const [isPurchased, setIsPurchased] = useState(() => {
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
    return purchasedItems.some(item => item.id === courseId);
  });
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Không tìm thấy sản phẩm</p>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // Get current cart items or initialize empty array
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // If item exists, increment quantity
      cartItems[existingItemIndex].quantity += 1;
      toast.info("Đã cập nhật số lượng", {
        description: product.title,
      });
    } else {
      // Add new item to cart
      cartItems.push({
        id: product.id,
        name: product.title,
        price: parseFloat(product.price.replace(/[^\d]/g, '')), // Convert "499.000đ" to 499000
        quantity: 1
      });
      toast.success("Đã thêm vào giỏ hàng", {
        description: product.title,
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch a custom event to notify other components (like Navbar) that cart has changed
    window.dispatchEvent(new Event('cart-updated'));
  };
  
  const handleDownload = () => {
    toast.success("Đang tải xuống template", {
      description: "File sẽ được tải xuống trong giây lát"
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast.success("Template đã được tải xuống thành công", {
        description: product.title
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Hình ảnh sản phẩm */}
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Thông tin sản phẩm */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {product.type}
              </span>
              <span className="text-gray-500 text-sm">Cập nhật gần đây</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-bold text-primary">{product.price}</span>
              {isPurchased && (
                <span className="flex items-center gap-1 text-green-600 text-sm border border-green-600 px-2 py-1 rounded">
                  <Check size={16} /> Đã mua
                </span>
              )}
            </div>
            
            <div className="flex gap-4 mb-8">
              {isPurchased ? (
                <Button 
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" /> Tải xuống template
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleAddToCart}
                    variant="outline" 
                    className="flex-1"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                  </Button>
                  <Link to="/thanh-toan" className="flex-1">
                    <Button className="w-full">Mua ngay</Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded border mb-6">
              <h3 className="font-medium mb-2">Thông tin template:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  Tương thích với phiên bản n8n v1.0 trở lên
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  Bao gồm hướng dẫn chi tiết cài đặt và sử dụng
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  Hỗ trợ kỹ thuật 30 ngày
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  Cập nhật miễn phí trọn đời
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="features">Tính năng</TabsTrigger>
              <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3>Giới thiệu Template</h3>
                <p>
                  {product.description} Template này giúp bạn tiết kiệm thời gian và 
                  tự động hóa các quy trình làm việc hàng ngày. Dễ dàng tích hợp vào 
                  hệ thống hiện tại của bạn và tùy chỉnh theo nhu cầu riêng.
                </p>
                <p>
                  Được thiết kế bởi các chuyên gia trong lĩnh vực tự động hóa, 
                  template này đã được tối ưu hóa để mang lại hiệu quả cao nhất 
                  và dễ dàng triển khai.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Tự động hóa quy trình</h3>
                  <p className="text-gray-600">
                    Template này giúp tự động hóa hoàn toàn quy trình làm việc, 
                    giúp bạn tiết kiệm thời gian và giảm thiểu sai sót.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Tích hợp dễ dàng</h3>
                  <p className="text-gray-600">
                    Dễ dàng tích hợp với các công cụ và nền tảng hiện có của bạn 
                    thông qua API và webhooks.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Khả năng tùy chỉnh</h3>
                  <p className="text-gray-600">
                    Tùy chỉnh workflow theo nhu cầu cụ thể của doanh nghiệp hoặc 
                    dự án của bạn.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">Báo cáo và phân tích</h3>
                  <p className="text-gray-600">
                    Theo dõi hiệu suất workflow và nhận báo cáo chi tiết về 
                    quy trình tự động hóa.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="requirements" className="mt-6">
              <div className="prose max-w-none">
                <h3>Yêu cầu hệ thống</h3>
                <ul>
                  <li>n8n phiên bản 1.0 trở lên</li>
                  <li>Tài khoản cho các dịch vụ được tích hợp (nếu có)</li>
                  <li>Quyền truy cập API cho các dịch vụ bên thứ ba (nếu có)</li>
                </ul>
                
                <h3 className="mt-6">Trình độ người dùng</h3>
                <p>
                  Template này được thiết kế cho mọi cấp độ kỹ năng, từ người mới bắt đầu 
                  đến người dùng nâng cao. Tài liệu hướng dẫn chi tiết được cung cấp để 
                  hỗ trợ việc triển khai và tùy chỉnh.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Template tương tự</h2>
          <ProductGrid 
            products={courses
              .filter(c => c.type === 'Template' && c.id !== product.id)
              .slice(0, 4)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailByUser;