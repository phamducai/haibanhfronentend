
import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';
import { GetUserProductService, userProductService } from '@/api/services/userProductService';
interface CartPopoverProps {
  cartItems: GetUserProductService[];
  setCartItems: React.Dispatch<React.SetStateAction<GetUserProductService[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartPopover = ({ cartItems, setCartItems, isCartOpen, setIsCartOpen }: CartPopoverProps) => {
  const navigate = useNavigate();
  const {isAuthenticated}=useAuth()

  const totalCartItems = cartItems.length;
  const totalPrice = cartItems.reduce((total, item) => total + Number(item.amount), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const removeFromCart = async (id: string | number) => {
    await userProductService.deleteUsersProducts(id.toString())
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    window.dispatchEvent(new Event('cart-updated'));
  };

const handlePayment = () => {
  if(isAuthenticated){
    navigate('/thanh-toan')
  }else{
    navigate('/dang-nhap')
  }
  setIsCartOpen(false)
}
  return (
    <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <h3 className="font-medium mb-4 text-lg">Giỏ hàng của bạn</h3>
        {cartItems.length > 0 ? (
          <>
            <div className="space-y-3 max-h-64 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.productid} className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">{item.products.productname}</p>
                    <p className="text-sm text-gray-600">{formatPrice(Number((item.amount)))}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeFromCart(item.userproductid)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Tổng cộng:</span>
                <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
           
                <Button className="w-full" onClick={handlePayment}>Thanh toán</Button>
          
            </div>
          </>
        ) : (
          <p className="text-center py-4 text-gray-500">Giỏ hàng trống</p>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CartPopover;
