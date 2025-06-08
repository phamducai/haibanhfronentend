
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
              Haismartlife
            </Link>
            <p className="text-gray-600 mb-4">
              Nơi chia sẻ kiến thức, kinh nghiệm và ứng dụng công nghệ vào cuộc sống hằng ngày. 
              Cùng tôi ưu hóa công việc và khám phá tiềm năng vô tận của AI.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary">Trang chủ</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary">Blog</Link></li>
              <li><Link to="/san-pham" className="text-gray-600 hover:text-primary">Sản phẩm</Link></li>
              <li><Link to="/khoa-hoc" className="text-gray-600 hover:text-primary">Khoá học</Link></li>
              <li><Link to="/cau-chuyen" className="text-gray-600 hover:text-primary">Câu chuyện</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: contact@haismartlife.com</li>
              <li className="text-gray-600">Điện thoại: +84 123 456 789</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Haismartlife. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
