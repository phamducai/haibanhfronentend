import React from 'react';
import { Button } from '@/components/ui/button';

const Story = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold pb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Câu chuyện của Haismartlife
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Từ ý tưởng đơn giản đến hành trình thay đổi cách thức làm việc của hàng nghìn người
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Mission Statement */}
          <div className="text-center mb-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Sứ mệnh của chúng tôi</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Democratize automation technology - Biến công nghệ tự động hóa phức tạp thành những giải pháp đơn giản, 
              giúp mọi người tiết kiệm thời gian và tập trung vào những điều thực sự quan trọng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Story */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Khởi đầu từ nhu cầu thực tế</h2>
                <p className="text-gray-600 leading-relaxed">
                  Haismartlife ra đời từ những trải nghiệm thực tế khi phải đối mặt với các tác vụ lặp đi lặp lại hàng ngày. 
                  Từ việc xử lý hàng trăm email, quản lý dữ liệu khách hàng đến tự động hóa quy trình marketing - 
                  chúng tôi nhận ra rằng công nghệ có thể làm được nhiều hơn thế.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Khám phá sức mạnh của n8n</h2>
                <p className="text-gray-600 leading-relaxed">
                  Khi lần đầu tiếp xúc với n8n, chúng tôi như được mở ra một thế giới mới. Không chỉ là một công cụ, 
                  n8n trở thành cầu nối giúp kết nối mọi ứng dụng, tự động hóa mọi quy trình và giải phóng sức sáng tạo.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tích hợp AI thông minh</h2>
                <p className="text-gray-600 leading-relaxed">
                  Không dừng lại ở tự động hóa, chúng tôi tích hợp AI để tạo ra những workflow thông minh, 
                  có khả năng học hỏi và tự cải thiện. Từ chatbot customer service đến phân tích dữ liệu tự động.
                </p>
              </div>
            </div>

            {/* Right Column - Values & Stats */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Tại sao chọn Haismartlife?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600"><strong>Kinh nghiệm thực chiến:</strong> Hơn 500+ workflow đã triển khai thành công</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600"><strong>Hỗ trợ 24/7:</strong> Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600"><strong>Cập nhật liên tục:</strong> Template và khóa học được cập nhật theo xu hướng mới</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600"><strong>Cộng đồng mạnh:</strong> Kết nối với 1000+ thành viên đam mê automation</span>
                  </li>
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-90">Workflow Templates</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
                  <div className="text-3xl font-bold mb-1">1000+</div>
                  <div className="text-sm opacity-90">Học viên đã đào tạo</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-sm opacity-90">Tỷ lệ hài lòng</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white text-center">
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-sm opacity-90">Hỗ trợ kỹ thuật</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Future */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Tầm nhìn tương lai</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Automation Revolution</h3>
                <p className="text-sm text-gray-600">Dẫn đầu cuộc cách mạng tự động hóa tại Việt Nam</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Education Excellence</h3>
                <p className="text-sm text-gray-600">Nâng cao chất lượng giáo dục công nghệ</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Community Building</h3>
                <p className="text-sm text-gray-600">Xây dựng cộng đồng automation mạnh mẽ</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-16">
            <div className="text-center">
              <div className="text-4xl text-primary mb-4">"</div>
              <p className="text-lg text-gray-700 italic mb-6">
                Haismartlife không chỉ dạy về công nghệ, mà còn thay đổi mindset của tôi về cách làm việc. 
                Từ một người luôn bị overwhelm bởi công việc, giờ tôi có thể tự tin quản lý mọi thứ một cách thông minh.
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  A
                </div>
                <div>
                  <div className="font-bold text-gray-800">Anh Minh</div>
                  <div className="text-sm text-gray-500">Digital Marketing Manager</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary to-blue-600 p-8 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu hành trình của bạn?</h2>
            <p className="text-lg mb-6 opacity-90">
              Hãy cùng Haismartlife khám phá tiềm năng vô tận của tự động hóa và AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 font-medium"
              >
                <a href="/khoa-hoc">Khám phá khóa học</a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-primary hover:bg-gray-100 font-medium"
              >
                <a href="/lien-he">Tư vấn miễn phí</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
