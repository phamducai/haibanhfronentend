
import React from 'react';
import { useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = blogPosts.find(post => post.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <span className="text-sm text-primary bg-blue-50 px-2 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            {new Date(post.date).toLocaleDateString('vi-VN')}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        
        <div className="mb-8">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-96 object-cover rounded-lg shadow"
          />
        </div>
        
        <div className="prose prose-lg max-w-none">
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
