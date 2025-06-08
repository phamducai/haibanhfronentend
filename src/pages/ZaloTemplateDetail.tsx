
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Zap,
  BarChart3
} from 'lucide-react';

const ZaloTemplateDetail = () => {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);

  const templateData = {
    id: 'zalo-template-1',
    title: 'Template Zalo Automation',
    price: '600,000đ',
    originalPrice: '800,000đ',
    rating: 4.8,
    reviews: 127,
    sales: 1250,
    description: 'Template tự động hóa Zalo Marketing với n8n - Tăng hiệu quả bán hàng và chăm sóc khách hàng',
    image: 'https://placehold.co/600x400?text=Zalo+Template',
    features: [
      'Tự động trả lời tin nhắn khách hàng',
      'Gửi tin nhắn marketing hàng loạt',
      'Phân loại và quản lý khách hàng',
      'Tích hợp với CRM và database',
      'Báo cáo chi tiết về hiệu suất',
      'Hỗ trợ đa dạng loại tin nhắn'
    ],
    benefits: [
      'Tiết kiệm 80% thời gian chăm sóc khách hàng',
      'Tăng 300% hiệu quả marketing',
      'Không cần kiến thức lập trình',
      'Cài đặt nhanh chóng trong 30 phút'
    ]
  };

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const newItem = {
      id: templateData.id,
      name: templateData.title,
      price: 600000,
      quantity: 1
    };
    
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === templateData.id);
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(newItem);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cart-updated'));
    setIsInCart(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/thanh-toan');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template image */}
            <Card>
              <CardContent className="p-0">
                <img 
                  src={templateData.image} 
                  alt={templateData.title}
                  className="w-full h-80 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>

            {/* Template info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{templateData.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {templateData.rating} ({templateData.reviews} đánh giá)
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {templateData.sales} lượt mua
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Template</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {templateData.description}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Tính năng chính
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templateData.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-blue-500" />
                  Lợi ích khi sử dụng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templateData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase card */}
            <Card className="sticky top-6">
              <CardHeader>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">{templateData.price}</span>
                    <span className="text-lg text-gray-500 line-through">{templateData.originalPrice}</span>
                  </div>
                  <Badge variant="destructive" className="mb-4">Giảm 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleBuyNow}
                  className="w-full"
                  size="lg"
                >
                  Mua ngay
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  disabled={isInCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
                </Button>
                
                <Separator />
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Download ngay sau khi thanh toán</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Cập nhật miễn phí trọn đời</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-xs text-gray-600 mb-2">JSON Template Preview:</div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "nodes": [
    {
      "id": "zalo-webhook",
      "type": "webhook",
      "name": "Zalo Webhook"
    },
    {
      "id": "message-processor", 
      "type": "function",
      "name": "Process Message"
    }
  ]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZaloTemplateDetail;
