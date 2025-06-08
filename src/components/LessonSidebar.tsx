
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, BookOpen } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  chapterId?: string;
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  order?: number;
  courseId: string;
  lessons: Lesson[];
}

interface LessonSidebarProps {
  title: string;
  chapters: Chapter[];
  activeChapterId: string;
  activeLessonId: string;
  onSelectChapter: (chapterId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  completedLessons?: string[];
}

const LessonSidebar = ({ 
  title, 
  chapters, 
  activeChapterId,
  activeLessonId, 
  onSelectChapter,
  onSelectLesson,
  completedLessons = [] 
}: LessonSidebarProps) => {
  // Calculate total lessons across all chapters
  const totalLessons = chapters.reduce((total, chapter) => {
    return total + (chapter.lessons ? chapter.lessons.length : 0);
  }, 0);

  // Calculate total completed lessons
  const totalCompleted = completedLessons.length;
  
  return (
    <div className="h-full bg-gray-50 border-r overflow-y-auto">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{totalLessons} bài học</p>
          <p className="text-sm text-green-600">{totalCompleted}/{totalLessons} hoàn thành</p>
        </div>
      </div>
      
      <div className="p-2">
        <Accordion 
          type="multiple" 
          defaultValue={[activeChapterId]} 
          className="w-full"
        >
          {chapters.map((chapter, chapterIndex) => {
            // Count completed lessons in this chapter
            const chapterCompletedCount = chapter.lessons.filter(
              lesson => completedLessons.includes(lesson.id)
            ).length;
            
            // Calculate completion percentage for this chapter
            const chapterProgress = 
              chapter.lessons.length > 0 
                ? Math.round((chapterCompletedCount / chapter.lessons.length) * 100) 
                : 0;
            
            return (
              <AccordionItem key={chapter.id} value={chapter.id} className="border-b">
                <AccordionTrigger 
                  className={`py-3 px-2 hover:bg-gray-100 ${activeChapterId === chapter.id ? 'font-medium' : ''}`}
                  onClick={() => onSelectChapter(chapter.id)}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-2 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      {chapterIndex + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between w-full">
                        <span>{chapter.title}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="space-y-1 pl-8">
                    {chapter.lessons.map((lesson, lessonIndex) => {
                      const isActive = lesson.id === activeLessonId;
                      const isCompleted = completedLessons.includes(lesson.id);
                      
                      return (
                        <button
                          key={lesson.id}
                          className={`w-full text-left p-2 rounded-md flex justify-between items-center ${
                            isActive 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            onSelectChapter(chapter.id);
                            onSelectLesson(lesson.id);
                          }}
                        >
                          <div className="flex flex-1 min-w-0">
                            <span className="text-gray-500 mr-2">{lessonIndex + 1}.</span>
                            <span className={`truncate ${isCompleted ? 'font-medium' : ''}`}>
                              {lesson.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center ml-2">
                            {isCompleted && (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            )}
                            <span className="text-xs text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        
        {chapters.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Không có chương nào trong khóa học này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonSidebar;
