
import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from './ui/sonner';
import { blogPosts } from '../data/blogPosts';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import SearchDialog from './navbar/SearchDialog';
import CartPopover from './navbar/CartPopover';
import DesktopNav from './navbar/DesktopNav';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { GetUserProductService, userProductService } from '@/api/services/userProductService';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<GetUserProductService[]>([]);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate=useNavigate();
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedCartItems = await userProductService.getUserProductsByUserId(false)
        if (savedCartItems) {
          setCartItems(savedCartItems);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setCartItems([]);
      }
    };

    // Load initial cart items
    loadCartItems();

    // Set up event listener for cart updates
    window.addEventListener('cart-updated', loadCartItems);

    // Clean up event listener
    return () => {
      window.removeEventListener('cart-updated', loadCartItems);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.info("Đã đăng xuất");
  };

  // Navigation items for desktop and mobile
  const navItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/blog', label: 'Blog' },
    { path: '/khoa-hoc', label: 'Sản Phẩm' },
    { path: '/cau-chuyen', label: 'Câu chuyện' },
    { path: '/lien-he', label: 'Liên hệ' },
  ];

  // Kết hợp dữ liệu từ khóa học và bài viết cho tìm kiếm
  const searchableItems = [
    ...blogPosts.map(post => ({
      id: post.id,
      name: post.title,
      type: 'Bài viết',
      url: `/blog/${post.id}`
    }))
  ];

  return (
    <header className="w-full bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Haismartlife
        </Link>
        
        {/* Desktop Navigation */}
        <DesktopNav items={navItems} />
        
        <div className="flex items-center space-x-3">
          {/* Search Dialog */}
          <SearchDialog searchableItems={searchableItems} />
          
          {/* Shopping Cart */}
          <CartPopover 
            cartItems={cartItems} 
            setCartItems={setCartItems}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
          
          {/* User Menu or Login Button */}
          {isAuthenticated ? (
            <UserMenu user={{
              name: user?.fullname || 'User',
              email: user?.email || '',
              avatar: 'https://i.pravatar.cc/150?img=68',
            }} onLogout={handleLogout} />
          ) : (
            <Button className="w-full" onClick={()=>navigate('/dang-nhap')}>
              Đăng nhập
            </Button>
          )}
          
          {/* Mobile Menu */}
          <MobileMenu 
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
