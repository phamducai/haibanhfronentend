
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

interface SearchResultItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'blog' | 'course' | 'product';
  image: string;
  url: string;
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  
  useEffect(() => {
    if (!query) return;
    
    // Combine blog posts and courses into searchable items
    const blogResults: SearchResultItem[] = blogPosts
      .filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(query.toLowerCase())
      )
      .map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        type: 'blog',
        image: post.image,
        url: `/blog/${post.id}`
      }));
    
    setResults([...blogResults]);
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };
  
  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl font-bold mb-6">Kết quả tìm kiếm</h1>
          
          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 py-3 w-full"
            />
            <Button 
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="all">
                Tất cả ({results.length})
              </TabsTrigger>
              <TabsTrigger value="blog">
                Bài viết ({results.filter(item => item.type === 'blog').length})
              </TabsTrigger>
              <TabsTrigger value="course">
                Khóa học ({results.filter(item => item.type === 'course').length})
              </TabsTrigger>
              <TabsTrigger value="product">
                Sản phẩm ({results.filter(item => item.type === 'product').length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {renderResults(filteredResults)}
            </TabsContent>
            <TabsContent value="blog" className="mt-0">
              {renderResults(filteredResults)}
            </TabsContent>
            <TabsContent value="course" className="mt-0">
              {renderResults(filteredResults)}
            </TabsContent>
            <TabsContent value="product" className="mt-0">
              {renderResults(filteredResults)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

function renderResults(results: SearchResultItem[]) {
  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy kết quả nào phù hợp.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {results.map(item => (
        <Link 
          key={`${item.type}-${item.id}`} 
          to={item.url}
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <img 
            src={item.image} 
            alt={item.title}
            className="w-24 h-24 object-cover rounded" 
          />
          <div>
            <div className="mb-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.type === 'blog' 
                  ? 'bg-blue-50 text-blue-600' 
                  : item.type === 'course' 
                  ? 'bg-green-50 text-green-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {item.type === 'blog' ? 'Bài viết' : item.type === 'course' ? 'Khóa học' : 'Sản phẩm'}
              </span>
            </div>
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{item.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SearchResults;
