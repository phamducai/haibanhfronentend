
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'ai', name: 'AI' },
    { id: 'automation', name: 'Automation' },
    { id: 'xu-huong', name: 'Xu hướng' },
    { id: 'hoc-tap', name: 'Học tập' },
    { id: 'cong-nghe', name: 'Công nghệ' },
    { id: 'phat-trien-ca-nhan', name: 'Phát triển cá nhân' }
  ];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           post.category.toLowerCase() === activeCategory.replace('-', ' ');
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-white bg-opacity-70 py-2 px-4 rounded-full mb-4">
            <span className="text-primary font-medium">Blog</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Chia sẻ kiến thức và trải nghiệm</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những bài viết chất lượng về AI, automation và hành trình học tập cùng Haismartlife
          </p>
          
          <div className="mt-8">
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((category) => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full ${
                activeCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-primary bg-blue-50 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-1">
                    {post.excerpt}
                  </p>
                  <span className="inline-block text-primary font-medium hover:underline">
                    Đọc thêm
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-500">Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.</p>
            </div>
          )}
        </div>
        
        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="px-6 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
              Xem thêm bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
