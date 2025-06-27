
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/sonner';
import { useAuth } from '@/context/AuthContext';
import { userProductService } from '@/api/services/userProductService';

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  regularPrice?: string;
  type?: string;
  registerted?: boolean;
  buttonType?: 1 | 2 | 3;
  downloadurl?:string
}

const CourseCard = ({ id, title, description, image, price, regularPrice, type, buttonType,downloadurl }: CourseCardProps) => {

  const navigate = useNavigate()
  const formatVND = (price: string) => {
    if (!price) return '0 VND';
    const numericValue = parseFloat(price.replace(/[^\d]/g, ''));
    return numericValue.toLocaleString('vi-VN') + ' VND';
  };

  const {isAuthenticated} =useAuth()

  const getButtonText = () => {
    switch (buttonType) {
      case 1:
        return "Học ngay";
      case 2:
        return "Tải xuống";
      case 3:
        return "Mua ngay";
      default:
        return "Mua ngay";
    }
  };

  // Hàm xử lý khi nhấn nút "Học ngay"
  const handleStudyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/khoa-hoc/${id}/hoc`)
    // Chuyển hướng đến trang học khóa học
  };

  // Hàm xử lý khi nhấn nút "Tải xuống"
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if(!downloadurl) {
      toast.error("Lỗi", {
        description: "Không tìm thấy URL tải xuống",
      });
      return;
    }
    
    try {
      // Kiểm tra độ dài URL tải xuống
      if (downloadurl.length > 10) {
        toast.success("Đang chuẩn bị tải xuống", {
          description: `Chuẩn bị tải ${title}`,
        });
        
        let jsonData;
        
        // Xử lý chuỗi JSON trực tiếp (trường hợp chính của chúng ta)
        try {
          // Thử parse JSON trực tiếp
          jsonData = JSON.parse(downloadurl);
          
          // Tạo Blob và tải xuống
          const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          const blobUrl = URL.createObjectURL(blob);
          
          // Tạo thẻ a để tải xuống
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`;
          
          // Thêm thẻ a vào body, click và xóa
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Dọn dẹp
          URL.revokeObjectURL(blobUrl);
          
          toast.success("Tải xuống thành công", {
            description: `Tệp ${title} đã được tải xuống.`,
          });
          return;
        } catch (parseError) {
          // Nếu đây không phải là JSON hợp lệ, xử lý theo các trường hợp khác
          console.log("Không phải JSON hợp lệ, xử lý trường hợp khác");
        }
        
        // Kiểm tra xem có phải là URL không
        if (downloadurl.startsWith('http://') || downloadurl.startsWith('https://')) {
          // Tạo link trực tiếp để tải xuống
          const a = document.createElement('a');
          a.href = downloadurl;
          a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`;
          a.target = "_blank"; // Mở trong tab mới để tránh vấn đề CORS
          
          // Thêm thẻ a vào body, click và xóa
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          toast.success("Tải xuống thành công", {
            description: `Tệp ${title} đã được tải xuống.`,
          });
        } else {
          // Trường hợp còn lại, tạo một object chứa dữ liệu
          jsonData = { data: downloadurl };
          
          // Tạo Blob và tải xuống
          const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
          const blobUrl = URL.createObjectURL(blob);
          
          // Tạo thẻ a để tải xuống
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`;
          
          // Thêm thẻ a vào body, click và xóa
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Dọn dẹp
          URL.revokeObjectURL(blobUrl);
          
          toast.success("Tải xuống thành công", {
            description: `Tệp ${title} đã được tải xuống.`,
          });
        }
      } else {
        toast.error("URL tải xuống không hợp lệ", {
          description: "Vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      console.error('Lỗi tải xuống:', error);
      toast.error("Lỗi khi tải xuống", {
        description: "Không thể tải xuống tệp. Vui lòng thử lại sau.",
      });
    }
  };
  const handleAddToCart = async (e: React.MouseEvent) => {
    if(!isAuthenticated){
      toast.info("Vui lòng đăng nhập để thêm khóa học vào giỏ hàng", {
        description: title,
      });
      return
    }
    e.preventDefault();
    e.stopPropagation();
    const cartItems =await userProductService.getUserProductsByUserId(false)
    const existingItemIndex = cartItems.findIndex(item => item.productid === id);
    
    if (existingItemIndex >= 0) {
      toast.info("Khóa học này đã có trong giỏ hàng", {
        description: title,
      });
    } else {
      await userProductService.createUserProduct({
        productid:id,
        amount:price,
        status:false
      })
      console.log("")
      toast.success("Đã thêm vào giỏ hàng", {
        description: `${title} - Mua ngay và sỡ hữu mãi mãi!`,
      });
    }
    
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/khoa-hoc/${id}`} state={{ imageUrl: image, productData: { id, title, description, image, price, regularPrice, type } }}>
        <div className="relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover" 
          />
          {type && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {type}
            </div>
          )}
        </div>
        
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-1 mb-4">{description}</p>
          <div className="flex flex-col space-y-2">
            {/* Hiển thị giá gốc và giá khuyến mãi */}
            {regularPrice && price !== regularPrice ? (
              <>
                {/* Khi có giá khuyến mãi */}
                <div className="flex items-center">
                  {/* Phần trăm giảm giá */}
                  <span className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-l-md">
                    {(() => {
                      const priceValue = parseFloat(price.replace(/[^\d]/g, ''));
                      const regularPriceValue = parseFloat(regularPrice.replace(/[^\d]/g, ''));
                      if (regularPriceValue > priceValue) {
                        const discountPercent = Math.round((1 - priceValue / regularPriceValue) * 100);
                        return `-${discountPercent}%`;
                      }
                      return '';
                    })()} 
                  </span>
                  {/* Nút màu vàng làm nổi bật giá khuyến mãi */}
                  <div className="bg-amber-100 text-amber-900 px-2 py-1 rounded-r-md font-bold">
                    Khuyến mãi
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {/* Giá khuyến mãi */}
                  <div className="flex items-center">
                    <p className="font-bold text-red-600 text-xl">{formatVND(price)}</p>
                  </div>
                  
                  {/* Giá gốc */}
                  <div className="flex items-center">
                    <p className="text-gray-500 line-through text-sm">{formatVND(regularPrice)}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Khi không có giá khuyến mãi */}
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-md">
                    Giá gốc
                  </span>
                </div>
                
                <div className="flex flex-col">
                  {/* Chỉ hiển thị giá gốc */}
                  <p className="font-bold text-primary text-xl">{formatVND(price)}</p>
                </div>
              </>
            )}
            
            {/* Thông báo đăng ký 1 lần dùng mãi mãi */}
            <p className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md text-center">
              <span className="font-medium">Đăng ký 1 lần - Dùng mãi mãi</span>
              <span className="ml-1">✓</span>
            </p>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="flex justify-between pt-0 pb-4">
        <Button asChild variant="outline" className="text-gray-700 flex-1 mr-2">
          <Link to={`/khoa-hoc/${id}`} state={{ imageUrl: image, productData: { id, title, description, image, price, regularPrice, type } }}>Chi tiết</Link>
        </Button>
        <Button 
          className="bg-gradient-to-r to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold flex-1 shadow-md transition-all duration-300 hover:shadow-lg" 
          onClick={(() => {
            switch (buttonType) {
              case 1:
                return handleStudyNow;
              case 2:
                return handleDownload;
              case 3:
              default:
                return handleAddToCart;
            }
          })()}
        >
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;


