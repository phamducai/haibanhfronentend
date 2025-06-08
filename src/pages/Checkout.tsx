
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { ShoppingCart, QrCode } from 'lucide-react';
import { GetUserProductService, userProductService } from '@/api/services/userProductService';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<GetUserProductService[]>([]);
  // Tạo một state để lưu trữ mã đơn hàng duy nhất
  const [orderCode, setOrderCode] = useState('');
  // State cho việc theo dõi trạng thái thanh toán
  const [paymentFound, setPaymentFound] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hàm tạo mã ngẫu nhiên 6 số dựa trên thời gian và số ngẫu nhiên
  const generateUniqueId = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    const randomNum = Math.floor(Math.random() * 1000);
    const part1 = minutes.toString().padStart(2, '0'); // 2 chữ số cho phút
    
    const part2 = Math.floor((seconds * 1000 + milliseconds) % 100).toString().padStart(2, '0');
    const part3 = (randomNum % 100).toString().padStart(2, '0');
    return part1 + part2 + part3;
  };

  useEffect(() => {
    try {
      // Tạo mã đơn hàng duy nhất khi component được render
      setOrderCode(generateUniqueId());

      const loadCartItems = async () => {
        const savedCartItems = await userProductService.getUserProductsByUserId(false)
        if (savedCartItems) {
          setCartItems(savedCartItems);
        }
      };
      // Load initial cart items
      loadCartItems();
    } catch (error) {
      setCartItems([]);
    }
  }, []);
  
  // Tự động bắt đầu kiểm tra thanh toán khi có dữ liệu giỏ hàng
  useEffect(() => {
    // Chỉ bắt đầu kiểm tra khi có đơn hàng và chưa tìm thấy thanh toán
    if (cartItems.length > 0 && orderCode && !paymentFound) {
      // Dọn dẹp interval cũ nếu có
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      // Tạo interval mới kiểm tra mỗi 15 giây
      checkIntervalRef.current = setInterval(() => {
        // Gọi API kiểm tra thanh toán
        fetch(`https://script.google.com/macros/s/AKfycbwLvYJ_n8Fo5eQkUNTJqYxx8CE774SDAgPqKw6ti_JWnQt0SUxP9sWjIxYxxfxL-8NP/exec?containerId=${orderCode}`)
          .then(response => response.json())
          .then(data => {
            if (data.success && data.found) {
              clearInterval(checkIntervalRef.current!);
              if (Math.abs(data.amount - totalPrice) <= 500) {
                setPaymentFound(true);  
                handlePaymentSuccess(data.amount);
                for(const item of cartItems){
                  userProductService.updateUsersProducts(item.userproductid,{
                    transactionid:orderCode,
                    status:true
                  })
                }

              } else {
                toast.error("Số tiền thanh toán không đúng", {
                  description: `Số tiền yêu cầu: ${formatPrice(totalPrice)}, số tiền nhận được: ${formatPrice(data.amount)}`,
                });
                checkIntervalRef.current = setInterval(() => {
                  fetch(`https://script.google.com/macros/s/AKfycbwLvYJ_n8Fo5eQkUNTJqYxx8CE774SDAgPqKw6ti_JWnQt0SUxP9sWjIxYxxfxL-8NP/exec?containerId=${orderCode}`)
                    .then(response => response.json())
                    .then(data => {
                      if (data.success && data.found) {
                        if (Math.abs(data.amount - totalPrice) <= 500) {
                          clearInterval(checkIntervalRef.current!);
                          setPaymentFound(true);
                          handlePaymentSuccess(data.amount);
                        }
                      }
                    })
                    .catch(error => {
                      console.error('Lỗi kiểm tra thanh toán:', error);
                    });
                }, 15000);
              }
            }
          })
          .catch(error => {
            console.error('Lỗi kiểm tra thanh toán:', error);
          });
      }, 10000); 
    }
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [cartItems.length, orderCode, paymentFound]);
  
  const totalPrice = cartItems.reduce((total, item) => total + Number(item.amount), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  
  // Hàm xử lý khi tìm thấy thanh toán thành công
  const handlePaymentSuccess = (amount: number) => {
    toast.success("Thanh toán thành công!", {
      description: `Cảm ơn bạn đã mua hàng. Chúng tôi đã nhận được ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}`,
    });
    
    // Clear cart
    window.dispatchEvent(new Event('cart-updated'));
    setTimeout(() => {
      navigate('/san-pham-da-mua');
    }, 3000);
  };
  
  // Dọn dẹp interval khi component unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Tóm tắt đơn hàng
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.userproductid} className="flex justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{item.products.productname}</p>
                        </div>
                        <p className="font-medium">{formatPrice(Number(item.amount))}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Tạm tính</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                  
                  <Tabs defaultValue="transfer" className="mb-6">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="transfer">
                        <QrCode className="mr-2 h-4 w-4" /> Chuyển khoản
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="transfer" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* QR Code */}
                        <div className="text-center">
                          <h3 className="font-semibold mb-4">Quét mã QR để thanh toán</h3>
                          <div className="bg-white p-4 border-2 border-gray-200 rounded-lg inline-block">
                            <img 
                              src={`https://qr.sepay.vn/img?acc=29165397&bank=ACB&amount=${totalPrice}&des=${orderCode}`}
                              alt="QR Code thanh toán"
                              className="w-48 h-48"
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Quét mã QR bằng app ngân hàng để thanh toán
                          </p>
                        </div>
                        
                        {/* Bank Info */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Thông tin chuyển khoản</h3>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div>
                              <span className="font-medium">Ngân hàng:</span>
                              <span className="ml-2">ACB</span>
                            </div>
                            <div>
                              <span className="font-medium">Số tài khoản:</span>
                              <span className="ml-2 font-mono">29165397</span>
                            </div>
                            <div>
                              <span className="font-medium">Chủ tài khoản:</span>
                              <span className="ml-2">PHAM DUC AI</span>
                            </div>
                            <div>
                              <span className="font-medium">Số tiền:</span>
                              <span className="ml-2 text-red-600 font-bold">{formatPrice(totalPrice)}</span>
                            </div>
                            <div>
                              <span className="font-medium">Nội dung:</span>
                              <span className="ml-2">{orderCode}</span>
                            </div>
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý nhanh chóng.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        {paymentFound ? (
                          <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg animate-pulse">
                            <div className="flex justify-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-green-700 mb-2">Đã xác nhận thanh toán thành công!</h3>
                            <p className="text-green-600">Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
                            <p className="text-sm text-green-600 mt-2">Đang chuyển hướng về trang chủ...</p>
                          </div>
                        ) : (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-center text-blue-600">
                              Vui lòng hoàn tất việc chuyển khoản theo hướng dẫn bên trên.<br />
                              Giao Dịch Có thể mấy ít phút.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>        
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán</p>
            <Button onClick={() => navigate('/khoa-hoc')}>
              Xem sản phẩm và khóa học
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
