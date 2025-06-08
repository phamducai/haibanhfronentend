
import React from 'react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Liên hệ với chúng tôi</h1>
            <p className="text-gray-600 text-lg">
              Hãy kết nối với Haismartlife để được hỗ trợ hoặc tìm hiểu thêm về các dịch vụ của chúng tôi
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="subject">
                    Chủ đề
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="message">
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                <Button className="bg-primary hover:bg-primary/90 w-full py-2">
                  Gửi tin nhắn
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-700">haismartlife@gmail.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Điện thoại</h3>
                  <p className="text-gray-700">+84 769 478 010</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mạng xã hội</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/vudink.tran/"  target="_blank" className="text-primary hover:text-primary/80" >
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                     </svg>
                    </a>
                    {/* YouTube Icon */}
                    <a href="https://www.youtube.com/@QuocHaiOfficial#"  target="_blank" className="text-primary hover:text-primary/80">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.411 0 5.822 0 12s.488 8.589 4.385 8.816c3.6.245 11.626.246 15.23 0C23.512 20.589 24 18.178 24 12s-.488-8.589-4.385-8.816zM9.75 15.6V8.4l6.3 3.6-6.3 3.6z" clipRule="evenodd" />
                     </svg>
                    </a>
                    {/* LinkedIn Icon */}
                    <a href="https://www.linkedin.com/in/hai-nguyen-quoc-530475270/"  target="_blank" className="text-primary hover:text-primary/80">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
                     </svg>
                    </a>
                </div>  
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Câu hỏi thường gặp</h3>
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-gray-200">
                      <h4 className="font-medium mb-1">Làm thế nào để mua khóa học?</h4>
                      <p className="text-sm text-gray-600">
                        Bạn có thể dễ dàng mua khóa học bằng cách chọn khóa học và nhấn vào nút "Thêm vào giỏ".
                      </p>
                    </div>
                    <div className="pb-3 border-b border-gray-200">
                      <h4 className="font-medium mb-1">Tôi có thể xem khóa học trong bao lâu?</h4>
                      <p className="text-sm text-gray-600">
                        Sau khi mua, bạn có thể truy cập khóa học vĩnh viễn.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Làm thế nào để nhận hỗ trợ?</h4>
                      <p className="text-sm text-gray-600">
                        Bạn có thể liên hệ với chúng tôi qua email hoặc điền vào biểu mẫu liên hệ này.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
