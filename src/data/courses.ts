
export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  type: string;
  
  // Properties from API response (product format)
  productname?: string;
  iscourse?: boolean;
  regularprice?: string;
  saleprice?: string;
  imageurl?: string;
  downloadurl?: string;
  isactive?: boolean;
  isdeleted?: boolean;
}

export const courses: Course[] = [
  {
    id: 'zalo-template-1',
    title: 'Template Zalo Automation',
    description: 'Template tự động hóa Zalo Marketing với n8n - Tăng hiệu quả bán hàng và chăm sóc khách hàng',
    image: 'https://placehold.co/600x400?text=Zalo+Template',
    price: '600,000đ',
    type: 'Template',
    productname: 'Template Zalo Automation',
    iscourse: false,
    regularprice: '600000',
    saleprice: '600000',
    downloadurl: '{"nodes":[{"id":"start","type":"trigger","position":{"x":100,"y":100},"data":{"type":"webhook"}}],"connections":[]}',
    isactive: true,
    isdeleted: false
  }
];
