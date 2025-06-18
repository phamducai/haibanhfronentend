
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

interface MobileMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const MobileMenu = ({ isAuthenticated, onLogout }: MobileMenuProps) => {
  const location = useLocation();
  const navigate=useNavigate();
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: 'home' },
    { path: '/blog', label: 'Blog', icon: 'file-text' },
    // { path: '/san-pham', label: 'Sản phẩm', icon: 'shopping-bag' },
    { path: '/khoa-hoc', label: 'Sản Phẩm', icon: 'book-open' },
    { path: '/cau-chuyen', label: 'Câu chuyện', icon: 'bookmark' },
    { path: '/lien-he', label: 'Liên hệ', icon: 'mail' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Haismartlife</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          {!isAuthenticated && (
            <Button className="w-full" onClick={()=>navigate('/dang-nhap')}>
              Đăng nhập
            </Button>
          )}
          {navItems.map((item) => (
            <SheetClose asChild key={item.path}>
              <Link 
                to={item.path} 
                className={cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
          {isAuthenticated && (
            <>
              <div className="h-px bg-border my-2"></div>
              <SheetClose asChild>
                <Link to="/tai-khoan" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">
                  Tài khoản
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/san-pham-da-mua" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">
                  Khoá học đã mua
                </Link>
              </SheetClose>
              <button 
                onClick={onLogout}
                className="flex items-center py-2 px-3 rounded-md hover:bg-muted text-red-500 text-left w-full"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
