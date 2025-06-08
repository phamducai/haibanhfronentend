
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="bg-muted py-20 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <div className="bg-white bg-opacity-70 py-3 px-6 rounded-full inline-block mb-6">
          <p className="text-primary font-medium">
            Chia sẻ hành trình học tập và công nghệ
          </p>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          <span className="text-gray-900">Khám phá thế giới </span>
          <span className="text-primary">Automation</span>
          <br />
          <span className="text-gray-900">và </span>
          <span className="text-primary">AI</span>
          <span className="text-gray-900"> cùng Haismartlife</span>
        </h1>
        
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          Nơi chia sẻ kiến thức, kinh nghiệm và ứng dụng công nghệ vào cuộc sống 
          hằng ngày. Cùng tôi ưu hóa công việc và khám phá tiềm năng vô tận của AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-md px-6 py-2 flex items-center gap-2">
            <Link to="/blog">
              Khám phá bài viết <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-md px-6 py-2">
            <Link to="/khoa-hoc">
              Về Haismartlife
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
