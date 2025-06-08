
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LessonSidebar from '../components/LessonSidebar';
import VideoPlayer from '../components/VideoPlayer';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { chapterService, Chapter as BackendChapter } from '@/api/services/chapterService';
import { lessonService } from '@/api/services/lessonService';
import { Lesson } from '@/api/types';

// Define interfaces that match our UI components
interface UILesson {
  id: string;
  title: string;
  duration: string;
  chapterId?: string;
  videoUrl: string;
}

interface UIChapter {
  id: string;
  title: string;
  description?: string;
  order?: number;
  courseId: string;
  lessons: UILesson[];
}

// Adapter function to convert backend data to UI format for a single lesson
const adaptLessonToUIFormat = (lesson: Lesson): UILesson => ({
  id: lesson.lessonid,
  title: lesson.lessonname,
  duration: lesson.duration || '0:00',
  chapterId: lesson.chapterid,
  videoUrl: lesson.videourl
});

// Adapter function to convert backend data to UI format for chapters
const adaptChaptersToUIFormat = (chapters: BackendChapter[]): UIChapter[] => {
  return chapters.map(chapter => ({
    id: chapter.chapterid,
    title: chapter.chaptername,
    description: '', // Phần mô tả mặc định vì BackendChapter không có trường description
    order: chapter.displayorder,
    courseId: chapter.productid,
    lessons: [] // Lessons will be loaded when chapter is selected
  }));
}

interface CourseDetailProps {
  courseName?: string;
}

const CourseDetail = (props: CourseDetailProps) => {
  const { courseName: propCourseName } = props;
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  // State for selected chapter and lesson
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>('');
  const [currentLessonDuration, setCurrentLessonDuration] = useState<string>('');

  // Cache lessons để cải thiện trải nghiệm người dùng khi chuyển chapter
  const [cachedLessons, setCachedLessons] = useState<Record<string, Lesson[]>>({});

  // Get course name from location state if available
  const location = useLocation();
  const stateCourseName = location.state?.courseName;
  
  // Use prop name, name from location state, or generate a default name
  const courseName = propCourseName || stateCourseName || `Khóa học ${courseId?.substring(0, 8) || ''}`;
  
  // Fetch chapters for course
  const {
    data: chaptersData = [],
    isLoading: isChaptersLoading,
    error: chaptersError
  } = useQuery<BackendChapter[]>({
    queryKey: ['chapters', courseId],
    queryFn: () => chapterService.getChaptersByCourseId(courseId || ''),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch lessons for selected chapter với tối ưu cache
  const {
    data: lessonsData = [],
    isLoading: isLessonsLoading,
    error: lessonsError
  } = useQuery<Lesson[]>({
    queryKey: ['lessons', courseId, selectedChapterId],
    queryFn: async () => {
      // Nếu đã có trong cache thì dùng luôn
      if (cachedLessons[selectedChapterId]) {
        return cachedLessons[selectedChapterId];
      }
      
      const data = await lessonService.getAllVideosByCourseId(courseId, selectedChapterId);
      // Lưu vào cache
      setCachedLessons(prev => ({ ...prev, [selectedChapterId]: data }));
      return data;
    },
    enabled: !!courseId && !!selectedChapterId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Tải trước bài học của các chapter
  useEffect(() => {
    if (!courseId || chaptersData.length === 0) return;
    
    // Tải dữ liệu các chapter khác (không phải chapter đang xem)
    const preloadChapters = async () => {
      const otherChapters = chaptersData.filter(c => c.chapterid !== selectedChapterId);
      
      // Chỉ tải 2 chapter kế tiếp và chapter trước đó
      const currentIndex = chaptersData.findIndex(c => c.chapterid === selectedChapterId);
      const chaptersToPreload = otherChapters.filter((_, index) => {
        const relativeIndex = chaptersData.indexOf(otherChapters[index]);
        return relativeIndex === currentIndex - 1 || relativeIndex === currentIndex + 1;
      });
      
      for (const chapter of chaptersToPreload) {
        if (!cachedLessons[chapter.chapterid]) {
          try {
            const data = await lessonService.getAllVideosByCourseId(courseId, chapter.chapterid);
            setCachedLessons(prev => ({ ...prev, [chapter.chapterid]: data }));
          } catch (error) {
            console.error(`Lỗi khi tải bài học: ${error}`);
          }
        }
      }
    };
    
    preloadChapters();
  }, [selectedChapterId, chaptersData, courseId, cachedLessons]);

  // Dữ liệu bài học hiện tại - ưu tiên từ cache
  const currentLessons = useMemo(() => {
    return selectedChapterId ? (cachedLessons[selectedChapterId] || lessonsData) : [];
  }, [selectedChapterId, cachedLessons, lessonsData]);

  // Tối ưu hóa việc chuyển đổi dữ liệu
  const chaptersWithLessons = useMemo(() => {
    // Chuyển đổi chapters sang định dạng UI
    const uiChapters = adaptChaptersToUIFormat(chaptersData);
    
    // Thêm bài học vào từng chapter
    return uiChapters.map(chapter => ({
      ...chapter,
      lessons: (cachedLessons[chapter.id] || (chapter.id === selectedChapterId ? lessonsData : []))
        .map(adaptLessonToUIFormat)
    }));
  }, [chaptersData, cachedLessons, selectedChapterId, lessonsData]);

  // Tạo một ref để có thể cuộn đến đầu container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tránh hiển thị loading không cần thiết khi đã có cache
  const isLoading = isChaptersLoading || 
    (isLessonsLoading && !cachedLessons[selectedChapterId] && Object.keys(cachedLessons).length === 0);
    
  // Cuộn lên đầu trang khi lần đầu vào trang hoặc chuyển lesson/chapter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedChapterId, selectedLessonId]);
  
  // Cuộn lên đầu container khi thay đổi lesson
  useEffect(() => {
    if (containerRef.current && !isLoading) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentVideoUrl, isLoading]);

  // Set default chapter and handle lesson selection
  useEffect(() => {
    if (!chaptersData || chaptersData.length === 0) return;
    
    // Select first chapter if no chapter is selected
    if (!selectedChapterId) {
      setSelectedChapterId(chaptersData[0].chapterid);
    }
  }, [chaptersData, selectedChapterId]);

  // Cập nhật dữ liệu bài học hiện tại
  const updateCurrentLesson = useCallback((lesson: Lesson) => {
    setSelectedLessonId(lesson.lessonid);
    setCurrentVideoUrl(lesson.videourl);
    setCurrentLessonTitle(lesson.lessonname);
    setCurrentLessonDuration(lesson.duration || '0:00');
  }, []);
  
  // Xử lý khi chọn bài học hoặc khi thay đổi chapter
  useEffect(() => {
    if (currentLessons.length === 0) return;

    // Nếu chưa chọn bài học nào, chọn bài đầu tiên
    if (!selectedLessonId) {
      updateCurrentLesson(currentLessons[0]);
      return;
    }

    // Nếu đã chọn bài học, kiểm tra bài học đó còn tồn tại không
    const lesson = currentLessons.find(l => l.lessonid === selectedLessonId);
    if (lesson) {
      updateCurrentLesson(lesson);
    }
  }, [currentLessons, selectedLessonId, updateCurrentLesson]);

  // Hàm chuyển đến bài học kế tiếp
  const handleNextLesson = useCallback(() => {
    if (currentLessons.length === 0) return;
    
    const currentIndex = currentLessons.findIndex(lesson => lesson.lessonid === selectedLessonId);
    
    // Nếu không phải bài cuối cùng, chuyển đến bài kế tiếp
    if (currentIndex < currentLessons.length - 1) {
      updateCurrentLesson(currentLessons[currentIndex + 1]);
      return;
    }
    
    // Nếu là bài cuối cùng, chuyển đến chapter kế tiếp
    const currentChapterIndex = chaptersData.findIndex(c => c.chapterid === selectedChapterId);
    if (currentChapterIndex < chaptersData.length - 1) {
      const nextChapterId = chaptersData[currentChapterIndex + 1].chapterid;
      const nextChapterLessons = cachedLessons[nextChapterId];
      
      setSelectedChapterId(nextChapterId);
      
      // Nếu đã có dữ liệu trong cache, cập nhật UI ngay lập tức
      if (nextChapterLessons?.length > 0) {
        updateCurrentLesson(nextChapterLessons[0]);
      }
      // Nếu không có trong cache, useEffect sẽ xử lý khi dữ liệu được tải
    }
  }, [currentLessons, selectedLessonId, chaptersData, selectedChapterId, cachedLessons, updateCurrentLesson]);
  
  // Hàm chuyển đến bài học trước đó
  const handlePreviousLesson = useCallback(() => {
    if (currentLessons.length === 0) return;
    
    const currentIndex = currentLessons.findIndex(lesson => lesson.lessonid === selectedLessonId);
    
    // Nếu không phải bài đầu tiên, chuyển đến bài trước đó
    if (currentIndex > 0) {
      updateCurrentLesson(currentLessons[currentIndex - 1]);
      return;
    }
    
    // Nếu là bài đầu tiên, chuyển đến chapter trước đó
    const currentChapterIndex = chaptersData.findIndex(c => c.chapterid === selectedChapterId);
    if (currentChapterIndex > 0) {
      const prevChapterId = chaptersData[currentChapterIndex - 1].chapterid;
      const prevChapterLessons = cachedLessons[prevChapterId];
      
      setSelectedChapterId(prevChapterId);
      
      // Nếu đã có dữ liệu trong cache, cập nhật UI ngay lập tức
      if (prevChapterLessons?.length > 0) {
        // Chọn bài học cuối cùng của chapter trước đó
        updateCurrentLesson(prevChapterLessons[prevChapterLessons.length - 1]);
      }
      // Nếu không có trong cache, useEffect sẽ xử lý khi dữ liệu được tải
    }
  }, [currentLessons, selectedLessonId, chaptersData, selectedChapterId, cachedLessons, updateCurrentLesson]);
  
  // Handle loading and error states
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <Skeleton className="h-12 w-48" />
    </div>;
  }
  
  if (chaptersError || lessonsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Lỗi khi tải dữ liệu</p>
          <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-primary text-white rounded">
            Quay lại
          </button>
        </div>
      </div>
    );
  }
  
  // No chapters or lessons found
  if (chaptersData.length === 0 || (selectedChapterId && currentLessons.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-2">{chaptersData.length === 0 ? 'Không tìm thấy khóa học' : 'Không tìm thấy bài học'}</p>
          <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-primary text-white rounded">
            Quay lại
          </button>
        </div>
      </div>
    );
  }
  
  // Don't render content until video URL is loaded
  if (!currentVideoUrl) {
    return <div className="min-h-screen flex items-center justify-center">
      <Skeleton className="h-12 w-48" />
    </div>;
  }
  


  return (
    <div className="min-h-screen flex flex-col bg-gray-50" ref={containerRef}>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{courseName}</h1>
          <button 
            onClick={() => navigate('/courses')} 
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar container - nhỏ hơn */}
        <div className="w-full lg:w-1/5 h-full">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-[84px]">
            <LessonSidebar
              chapters={chaptersWithLessons}
              activeChapterId={selectedChapterId}
              activeLessonId={selectedLessonId}
              onSelectChapter={setSelectedChapterId}
              onSelectLesson={setSelectedLessonId}
              title={courseName}
              completedLessons={[]}
            />
          </div>
        </div>
        
        {/* Video container - lớn hơn */}
        <div className="flex-1 flex flex-col">
          {/* Video player - lớn hơn, có shadow */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <VideoPlayer 
              videoUrl={currentVideoUrl}
              title={currentLessonTitle}
              onVideoComplete={handleNextLesson}
            />
            
            {/* Nút điều hướng */}
            <div className="flex justify-between p-4 border-t border-gray-100">
              <button 
                onClick={handlePreviousLesson}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center transition-colors"
                disabled={!chaptersData.length || (chaptersData.length > 0 && 
                        chaptersData.findIndex(c => c.chapterid === selectedChapterId) === 0 && 
                        currentLessons.findIndex(l => l.lessonid === selectedLessonId) === 0)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Bài trước
              </button>
              
              <button 
                onClick={handleNextLesson}
                className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center transition-colors"
                disabled={!chaptersData.length || (chaptersData.length > 0 && 
                        chaptersData.findIndex(c => c.chapterid === selectedChapterId) === chaptersData.length - 1 && 
                        currentLessons.findIndex(l => l.lessonid === selectedLessonId) === currentLessons.length - 1)}
              >
                Bài tiếp theo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Thông tin bài học */}
          <div className="bg-white p-6 mt-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{currentLessonTitle}</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {currentLessonDuration}
              </span>
            </div>
            
            {/* Nội dung bài học */}
            <div className="mt-6 prose max-w-none text-gray-600">
              <p>Nội dung bài học sẽ được hiển thị ở đây.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
