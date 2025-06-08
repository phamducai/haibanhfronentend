
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  path: string;
  label: string;
}

interface DesktopNavProps {
  items: NavigationItem[];
}

const DesktopNav = ({ items }: DesktopNavProps) => {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {items.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={cn(
            "text-gray-800 font-medium hover:text-primary transition-colors relative group",
            location.pathname === item.path && "text-primary font-semibold"
          )}
        >
          {item.label}
          <span className={cn(
            "absolute bottom-[-4px] left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100 duration-300",
            location.pathname === item.path && "scale-x-100"
          )}></span>
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
