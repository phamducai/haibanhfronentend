
import React, { useState, useEffect, useRef } from 'react';
import Plyr, { APITypes } from 'plyr-react';
import 'plyr-react/plyr.css';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onVideoComplete?: () => void;
}

const VideoPlayer = ({ videoUrl, title, onVideoComplete }: VideoPlayerProps) => {
  const playerRef = useRef<APITypes>(null);
  const [videoSrc, setVideoSrc] = useState<string>('');

  // Xử lý URL video - đơn giản hóa logic
  useEffect(() => {
    if (!videoUrl) return;
    
    // Giữ nguyên nếu là URL đầy đủ, thêm / nếu chưa có
    setVideoSrc(videoUrl.startsWith('http') || videoUrl.startsWith('/') 
      ? videoUrl 
      : `/${videoUrl}`);
  }, [videoUrl]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector('.plyr__video-wrapper video');
      if (element) {
        observer.disconnect();
        
        element.addEventListener('ended', () => onVideoComplete?.());
        
        element.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
          }
        });
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [onVideoComplete]);

  const [isVideoValid, setIsVideoValid] = useState(true);
  
  useEffect(() => {
    if (!videoSrc) return;
    setIsVideoValid(true); 
    
    const handleVideoError = () => setIsVideoValid(false);
    window.addEventListener('error', handleVideoError, { once: true, capture: true });
    
    return () => window.removeEventListener('error', handleVideoError, { capture: true });
  }, [videoSrc]);

  // Trạng thái hiển thị thống nhất
  const renderPlaceholder = (message: string) => (
    <div className="w-full bg-black flex items-center justify-center text-white aspect-w-16 aspect-h-9 min-h-[400px]">
      {message}
    </div>
  );
  
  if (!videoSrc) return renderPlaceholder("Loading video player...");
  if (!isVideoValid) return renderPlaceholder("Video không khả dụng hoặc đang được tải lên. Vui lòng thử lại sau.");

  // Cấu hình Plyr
  const plyrConfig = {
    source: {
      type: 'video' as const,
      sources: [{ src: videoSrc, type: 'video/mp4' }]
    },
    options: {
      title,
      autoplay: false,
      controls: [
        'play-large', 'play', 'progress', 'current-time',
        'mute', 'volume', 'settings', 'fullscreen'
      ]
    }
  };

  return (
    <div className="w-full bg-black">
      <div className="aspect-w-16 aspect-h-9 max-h-[80vh]">
        <Plyr 
          ref={playerRef}
          source={plyrConfig.source}
          options={plyrConfig.options}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
