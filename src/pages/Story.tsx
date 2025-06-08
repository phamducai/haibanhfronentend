
import React from 'react';

const Story = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Câu chuyện của Haismartlife</h1>
            <p className="text-gray-600 text-lg">
              Hành trình khám phá và chia sẻ kiến thức về tự động hóa và AI
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose">
          <p className="text-lg">
            Xin chào, tôi là người sáng lập Haismartlife. Câu chuyện của tôi bắt đầu từ niềm đam mê với công nghệ và mong muốn tối ưu hóa mọi công việc hàng ngày.
          </p>
          
          <h2>Khởi đầu</h2>
          <p>
            Khi lần đầu tiên phát hiện ra n8n và các công cụ tự động hóa, tôi nhận ra rằng đây chính là chìa khóa để giải phóng thời gian và sáng tạo. Không chỉ giúp tôi hoàn thành công việc nhanh hơn, mà còn mở ra một thế giới khả năng mới.
          </p>
          
          <h2>Tầm nhìn</h2>
          <p>
            Haismartlife được tạo ra với sứ mệnh đơn giản: chia sẻ kiến thức và kinh nghiệm về tự động hóa và AI với cộng đồng Việt Nam, giúp mọi người tiết kiệm thời gian và tập trung vào những điều thực sự quan trọng.
          </p>
          
          <h2>Giá trị cốt lõi</h2>
          <ul>
            <li>
              <strong>Chia sẻ kiến thức:</strong> Chúng tôi tin rằng kiến thức nên được chia sẻ rộng rãi để giúp cộng đồng phát triển.
            </li>
            <li>
              <strong>Thực tế và ứng dụng:</strong> Mọi khóa học và template của chúng tôi đều được thiết kế để giải quyết các vấn đề thực tế.
            </li>
            <li>
              <strong>Liên tục học hỏi:</strong> Trong thế giới công nghệ luôn thay đổi, chúng tôi cam kết không ngừng học hỏi và cập nhật kiến thức.
            </li>
          </ul>
          
          <h2>Tương lai</h2>
          <p>
            Chúng tôi đang không ngừng phát triển thêm các khóa học và template mới, đồng thời mở rộng cộng đồng những người đam mê tự động hóa và AI. Hãy cùng Haismartlife khám phá tiềm năng vô tận của công nghệ!
          </p>
          
          <div className="my-10 text-center">
            <a href="/khoa-hoc" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Khám phá khóa học
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
