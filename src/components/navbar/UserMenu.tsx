
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
}

const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const { isAdmin } = useAuth();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block">{user.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="grid gap-1">
          <Link to="/tai-khoan" className="block p-2 hover:bg-muted rounded-md">Tài khoản</Link>
          <Link to="/san-pham-da-mua" className="block p-2 hover:bg-muted rounded-md">Sản phẩm đã mua</Link>
          
          {isAdmin && (
            <Link to="/admin" className="block p-2 hover:bg-muted rounded-md text-primary">
              Quản lý hệ thống
            </Link>
          )}
          
          <button 
            onClick={onLogout}
            className="w-full text-left p-2 hover:bg-muted rounded-md text-red-500"
          >
            Đăng xuất
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
