import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/api/services/courseService';
import { chapterService } from '@/api/services/chapterService';
import { lessonService } from '@/api/services/lessonService';
import { userProductService } from '@/api/services/userProductService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  Download, 
  ShoppingCart, 
  Play, 
  Clock, 
  BookOpen, 
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  ArrowUp
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Helmet } from 'react-helmet-async';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ProductDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isPurchased, setIsPurchased] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch product details
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError
  } = useQuery({
    queryKey: ['product', courseId],
    queryFn: () => courseService.getCourseById(courseId || ''),
    enabled: !!courseId,
  });

  // Fetch chapters if it's a course
  const {
    data: chapters = [],
    isLoading: isChaptersLoading
  } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: () => chapterService.getChaptersByCourseId(courseId || ''),
    enabled: !!courseId && product?.iscourse === true,
  });

  // Fetch lessons for each chapter
  const {
    data: allLessons = [],
    isLoading: isLessonsLoading
  } = useQuery({
    queryKey: ['all-lessons', courseId],
    queryFn: async () => {
      if (!product?.iscourse || chapters.length === 0) return [];
      const lessons = await lessonService.getAllVideosByCourseId(courseId, undefined);
      return lessons;
    },
    enabled: !!courseId && product?.iscourse === true && chapters.length > 0,
  });

  // Scroll to top when page loads or course changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseId]);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset image states when product changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [product?.productid]);

  // Check if user has purchased this product
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!isAuthenticated || !courseId) return;
      
      try {
        const userProducts = await userProductService.getUserProductsByUserId(true);
        const purchased = userProducts.some(item => item.productid === courseId);
        setIsPurchased(purchased);
      } catch (error) {
        console.error('Error checking purchase status:', error);
      }
    };

    checkPurchaseStatus();
  }, [isAuthenticated, courseId]);

  const formatPrice = (price: string) => {
    if (!price) return '0 VND';
    const numericValue = parseFloat(price.replace(/[^\d]/g, ''));
    return numericValue.toLocaleString('vi-VN') + ' VND';
  };

  const calculateDiscount = (regularPrice: string, salePrice: string) => {
    const regular = parseFloat(regularPrice.replace(/[^\d]/g, ''));
    const sale = parseFloat(salePrice.replace(/[^\d]/g, ''));
    if (regular > sale) {
      return Math.round((1 - sale / regular) * 100);
    }
    return 0;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate('/dang-nhap');
      return;
    }

    try {
      const cartItems = await userProductService.getUserProductsByUserId(false);
      const existingItem = cartItems.find(item => item.productid === courseId);
      
      if (existingItem) {
        toast.info("Sản phẩm này đã có trong giỏ hàng");
      } else {
        await userProductService.createUserProduct({
          productid: courseId || '',
          amount: product?.saleprice || product?.regularprice || '0',
          status: false
        });
        toast.success("Đã thêm vào giỏ hàng");
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleDownload = () => {
    if (!product?.downloadurl) {
      toast.error("Không tìm thấy URL tải xuống");
      return;
    }

    try {
      if (product.downloadurl.length > 10) {
        toast.success("Đang chuẩn bị tải xuống");
        
        let jsonData;
        try {
          jsonData = JSON.parse(product.downloadurl);
        } catch {
          if (product.downloadurl.startsWith('http')) {
            const a = document.createElement('a');
            a.href = product.downloadurl;
            a.download = `${product.productname?.replace(/\s+/g, '-').toLowerCase()}.json`;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Tải xuống thành công");
            return;
          } else {
            jsonData = { data: product.downloadurl };
          }
        }
        
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${product.productname?.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(blobUrl);
        toast.success("Tải xuống thành công");
      }
    } catch (error) {
      toast.error("Lỗi khi tải xuống");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để mua sản phẩm");
      navigate('/dang-nhap');
      return;
    }

    try {
      toast.loading("Đang xử lý...");
      
      // Thêm vào giỏ hàng trước khi chuyển đến thanh toán
      const cartItems = await userProductService.getUserProductsByUserId(false);
      const existingItem = cartItems.find(item => item.productid === courseId);
      
      if (!existingItem) {
        await userProductService.createUserProduct({
          productid: courseId || '',
          amount: product?.saleprice || product?.regularprice || '0',
          status: false
        });
        window.dispatchEvent(new Event('cart-updated'));
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        toast.info("Sản phẩm đã có trong giỏ hàng");
      }
      
      // Chuyển đến trang thanh toán
      navigate('/thanh-toan', { state: { productId: courseId } });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleStartLearning = () => {
    navigate(`/khoa-hoc/${courseId}/hoc`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse textfunction để lấy features
  const getProductFeatures = () => {
    if (!product?.textfunction) {
      // Default features nếu không có textfunction
      return [
        'Truy cập trọn đời',
        'Hỗ trợ kỹ thuật',
        'Cập nhật miễn phí',
        'Tài liệu hướng dẫn'
      ];
    }
    
    // Split bởi dấu ; và trim whitespace
    return product.textfunction
      .split(';')
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0);
  };

  // Image handling functions
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Format image URL
  const getImageUrl = (url: string | undefined) => {
    if (!url?.trim()) {
      return 'https://placehold.co/800x400?text=Product+Image';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    const path = url.startsWith('/') ? url : `/${url}`;
        return `http://localhost:3000${path}`;
  };

  // Simple calculations - không cần memoization phức tạp
  const groupedLessons = chapters.map(chapter => ({
    ...chapter,
    lessons: allLessons.filter(lesson => lesson.chapterid === chapter.chapterid)
  }));

  const totalLessons = allLessons.length;
  const totalDuration = allLessons.reduce((acc, lesson) => {
    const duration = lesson.duration || '0:00';
    const [minutes, seconds] = duration.split(':').map(Number);
    return acc + (minutes || 0) + (seconds || 0) / 60;
  }, 0);

  if (isProductLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-64 rounded-lg mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div>
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Computed values - phải đặt trước early returns
  const isTemplate = !product?.iscourse;
  const discountPercent = product?.regularprice && product?.saleprice && product.regularprice !== product.saleprice
    ? calculateDiscount(product.regularprice, product.saleprice)
    : 0;

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <Button onClick={() => navigate('/khoa-hoc')}>
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.productname} | Haismartlife</title>
        <meta name="description" content={product.description || 'Sản phẩm chất lượng từ Haismartlife'} />
      </Helmet>

      <div className="min-h-screen py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Product image */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-500">Đang tải ảnh...</span>
                    </div>
                  </div>
                )}
                
                                {imageError ? (
                  <div className="w-full h-64 lg:h-80 bg-gray-100 flex flex-col items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-gray-400 mb-3">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">Không thể tải ảnh</p>
                      <button 
                        onClick={() => {
                          setImageError(false);
                          setImageLoading(true);
                          // Force reload ảnh
                          const img = document.querySelector(`img[alt="${product?.productname}"]`) as HTMLImageElement;
                          if (img) {
                            const currentSrc = img.src;
                            img.src = '';
                            img.src = currentSrc + '?t=' + Date.now();
                          }
                        }}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={getImageUrl(product?.imageurl)} 
                    alt={product?.productname || 'Product Image'}
                    className="w-full h-64 lg:h-80 object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ display: imageLoading ? 'none' : 'block' }}
                  />
                )}
              </div>

              {/* Product info */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {isTemplate ? 'Template' : 'Khóa học'}
                  </Badge>
                  {!isTemplate && (
                    <>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        {totalLessons} bài học
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {Math.round(totalDuration)} phút
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.productname}
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description || 'Mô tả sản phẩm đang được cập nhật...'}
                </p>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {isTemplate ? 'Template bao gồm:' : 'Khóa học bao gồm:'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {getProductFeatures().map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course curriculum - only for courses */}
              {!isTemplate && !isChaptersLoading && chapters.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
                  
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{chapters.length}</div>
                        <div className="text-sm text-gray-600">Chương</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
                        <div className="text-sm text-gray-600">Bài học</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{Math.round(totalDuration)}m</div>
                        <div className="text-sm text-gray-600">Tổng thời lượng</div>
                      </div>
                    </div>
                  </div>

                  <Accordion type="multiple" className="space-y-4">
                    {groupedLessons.map((chapter, index) => (
                      <AccordionItem key={chapter.chapterid} value={chapter.chapterid} className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <span className="font-medium text-left">{chapter.chaptername}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {chapter.lessons.length} bài học
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-2">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.lessonid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm">{lessonIndex + 1}. {lesson.lessonname}</span>
                                </div>
                                <span className="text-xs text-gray-500">{lesson.duration || '0:00'}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Sidebar - Purchase card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-6">
                    {discountPercent > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-sm">
                            -{discountPercent}%
                          </Badge>
                          <span className="text-sm text-green-600 font-medium">Giá khuyến mãi</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600">
                          {formatPrice(product.saleprice || '0')}
                        </div>
                        <div className="text-lg text-gray-500 line-through">
                          {formatPrice(product.regularprice || '0')}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-sm text-blue-600 font-medium">Giá gốc</span>
                        <div className="text-3xl font-bold text-gray-900">
                          {formatPrice(product.saleprice || product.regularprice || '0')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isPurchased ? (
                      <>
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-green-800 font-medium">Đã sở hữu</span>
                        </div>
                        
                        {isTemplate ? (
                          <Button 
                            onClick={handleDownload}
                            className="w-full"
                            size="lg"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Tải xuống Template
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleStartLearning}
                            className="w-full"
                            size="lg"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Bắt đầu học
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={handleBuyNow}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          size="lg"
                        >
                          Mua ngay
                        </Button>
                        
                        <Button 
                          onClick={handleAddToCart}
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Thêm vào giỏ hàng
                        </Button>
                      </>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Đăng ký 1 lần - Dùng mãi mãi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Hỗ trợ kỹ thuật 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Cập nhật nội dung mới</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Tài liệu học tập đầy đủ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ProductDetail;
