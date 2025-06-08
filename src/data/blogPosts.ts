
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  category: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Cách tự động hóa công việc hàng ngày với n8n",
    excerpt: "Khám phá cách sử dụng n8n để tối ưu hóa quy trình làm việc hàng ngày, giúp bạn tiết kiệm thời gian và tăng năng suất.",
    content: [
      "Trong thời đại số hóa ngày nay, việc tự động hóa các công việc lặp đi lặp lại đã trở thành một nhu cầu thiết yếu đối với mỗi cá nhân và doanh nghiệp. N8n là một trong những công cụ mạnh mẽ giúp bạn thực hiện điều này một cách đơn giản và hiệu quả.",
      "N8n là một nền tảng tự động hóa quy trình làm việc mã nguồn mở và dựa trên luồng công việc (workflow). Với giao diện trực quan kéo-thả, n8n cho phép người dùng tạo các quy trình tự động mà không cần kiến thức lập trình chuyên sâu.",
      "Một trong những ưu điểm lớn nhất của n8n là khả năng kết nối với hơn 200 dịch vụ khác nhau như Gmail, Google Drive, Slack, Trello, và nhiều dịch vụ phổ biến khác. Điều này cho phép bạn tự động hóa các tác vụ giữa các nền tảng khác nhau một cách liền mạch.",
      "Trong bài viết này, chúng ta sẽ khám phá một số cách mà n8n có thể giúp bạn tự động hóa công việc hàng ngày, từ gửi email tự động đến đồng bộ hóa dữ liệu giữa các ứng dụng khác nhau.",
    ],
    image: "/placeholder.svg",
    category: "Automation",
    date: "2023-05-15"
  },
  {
    id: "blog-2",
    title: "Tích hợp AI vào quy trình làm việc của bạn",
    excerpt: "Tìm hiểu cách AI có thể cách mạng hóa quy trình làm việc và tăng hiệu suất công việc của bạn.",
    content: [
      "Trí tuệ nhân tạo (AI) đang thay đổi cách chúng ta làm việc và sống. Trong bài viết này, chúng ta sẽ khám phá cách tích hợp AI vào quy trình làm việc hàng ngày để tăng hiệu suất và giảm thời gian cho các tác vụ thủ công.",
      "AI có thể giúp tự động hóa các tác vụ lặp đi lặp lại như phân tích dữ liệu, tạo nội dung, dịch thuật, và nhiều hơn nữa. Bằng cách tận dụng sức mạnh của AI, bạn có thể tập trung vào các khía cạnh sáng tạo và chiến lược của công việc.",
      "N8n cung cấp nhiều nút (nodes) tích hợp AI như OpenAI, Google AI, và các dịch vụ nhận dạng hình ảnh, cho phép bạn dễ dàng tích hợp các khả năng AI vào quy trình làm việc của mình mà không cần kiến thức lập trình phức tạp.",
      "Trong bài viết này, chúng ta sẽ xem xét một số ví dụ thực tế về cách kết hợp n8n với các dịch vụ AI để tự động hóa các tác vụ phức tạp và tăng năng suất làm việc."
    ],
    image: "/placeholder.svg",
    category: "AI",
    date: "2023-06-20"
  },
  {
    id: "blog-3",
    title: "Những xu hướng mới nhất trong lĩnh vực tự động hóa",
    excerpt: "Cập nhật về các xu hướng tự động hóa mới nhất và cách áp dụng chúng vào doanh nghiệp của bạn.",
    content: [
      "Tự động hóa đang phát triển nhanh chóng, với các công nghệ mới xuất hiện hàng ngày. Từ tự động hóa quy trình robot (RPA) đến trí tuệ nhân tạo (AI) và học máy (ML), có rất nhiều công cụ và phương pháp để tối ưu hóa quy trình làm việc của bạn.",
      "Một trong những xu hướng nổi bật nhất là sự kết hợp giữa tự động hóa và trí tuệ nhân tạo, tạo ra các hệ thống thông minh có thể học hỏi và thích nghi theo thời gian. Điều này đặc biệt hữu ích cho các tác vụ phức tạp đòi hỏi ra quyết định.",
      "Ngoài ra, tự động hóa dựa trên đám mây đang trở nên phổ biến, cho phép các doanh nghiệp triển khai và quản lý các quy trình tự động từ bất kỳ đâu, mà không cần cơ sở hạ tầng phức tạp.",
      "Trong bài viết này, chúng ta sẽ khám phá những xu hướng hàng đầu trong lĩnh vực tự động hóa và cách bạn có thể áp dụng chúng vào doanh nghiệp của mình để giữ cho công ty của bạn cạnh tranh trong thời đại kỹ thuật số."
    ],
    image: "/placeholder.svg",
    category: "Xu hướng",
    date: "2023-07-10"
  }
];