
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductGrid from '../components/ProductGrid';
import { courses } from '../data/courses';
import { Package } from 'lucide-react';

const Products = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', name: 'Tất cả' },
    { id: 'template', name: 'Template n8n' },
    { id: 'ai', name: 'Template AI' }
  ];
  
  const filteredProducts = activeFilter === 'all' 
    ? courses.filter(course => course.type === 'Template')
    : courses.filter(course => {
        if (activeFilter === 'template') return course.type === 'Template' && course.title.toLowerCase().includes('n8n');
        if (activeFilter === 'ai') return course.type === 'Template' && course.title.toLowerCase().includes('ai');
        return course.type === 'Template';
      });

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Package size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Template</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các template n8n và AI giúp bạn tự động hóa quy trình làm việc
            và tăng năng suất với công nghệ tiên tiến
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={activeFilter === filter.id 
                ? "bg-primary text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100 border"
              }
              variant={activeFilter === filter.id ? "default" : "outline"}
            >
              {filter.name}
            </Button>
          ))}
        </div>
        
        <ProductGrid 
          products={filteredProducts}
          subtitle={
            activeFilter === 'all' 
              ? "Tất cả các template" 
              : activeFilter === 'template' 
                ? "Template n8n để tự động hóa công việc"
                : "Template AI để tối ưu workflow"
          }
        />
      </div>
    </div>
  );
};

export default Products;
