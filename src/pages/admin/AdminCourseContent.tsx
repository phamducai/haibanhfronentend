import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Await } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage 
} from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Plus, Pencil, Trash, Video, ArrowLeft, Loader2
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { ChapterInput, chapterService } from '@/api/services/chapterService';
import { lessonService } from '@/api/services/lessonService';
import { courseService } from '@/api/services/courseService';
import { VideoInput } from '@/api/types';


// Chapter schema
const chapterSchema = z.object({
  chapterid: z.string().optional(),
  chaptername: z.string(),
  displayorder: z.number(),
  productid: z.string().optional(), 
});

// Video schema
const videoSchema = z.object({
  lessonid: z.string(),
  chapterid: z.string(),
  lessonname: z.string(),
  videourl: z.string(),
  displayorder: z.number(),
  description: z.string(),
  productid: z.string(),
});

type ChapterFormValues = z.infer<typeof chapterSchema>;
type VideoFormValues = z.infer<typeof videoSchema>;

const AdminCourseContent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('chapters');
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // States cho loading
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [isUpdatingChapter, setIsUpdatingChapter] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState(false);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [isUpdatingVideo, setIsUpdatingVideo] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  
  // Fetch course data
  const { data: currentCourse, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourseById(courseId || ''),
    enabled: !!courseId,
  });
  
  // Fetch chapters for course
  const { 
    data: chapters = [], 
    isLoading: chaptersLoading,
    isError: chaptersError,
    refetch: refetchChapters  
  } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: () => chapterService.getChaptersByCourseId(courseId || ''),
    enabled: !!courseId,
  });
  
  // Fetch videos for course
  const {
    data: videos = [],
    isLoading: videosLoading,
    isError: videosError,
    refetch: refetchVideos
  } = useQuery({
    queryKey: ['videos', courseId],
    queryFn: () => lessonService.getAllVideosByCourseId(courseId || ''),
    enabled: !!courseId && chapters.length > 0,
  });
  
  // Hàm xử lý thêm chương mới
  const handleCreateChapter = async (data: ChapterInput) => {
    setIsCreatingChapter(true);
    try {
      await chapterService.createChapter(data);
      refetchChapters();
      setShowChapterDialog(false);
      toast.success('Đã thêm chương mới thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm chương mới');
      console.error(error);
    } finally {
      setIsCreatingChapter(false);
    }
  };
  
  // Hàm xử lý cập nhật chương
  const handleUpdateChapter = async (id: string, data: Partial<ChapterInput>) => {
    setIsUpdatingChapter(true);
    try {
      await chapterService.updateChapter(id, data);
      refetchChapters();
      setShowChapterDialog(false);
      toast.success('Đã cập nhật chương thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật chương');
      console.error(error);
    } finally {
      setIsUpdatingChapter(false);
    }
  };
  
  // Hàm xử lý xóa chương
  const handleDeleteChapter = async (id: string) => {
    setIsDeletingChapter(true);
    setDeletingChapterId(id);
    try {
      await chapterService.deleteChapter(id);
      refetchChapters();        
      toast.success('Đã xóa chương thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa chương');
      console.error(error);
    } finally {
      setIsDeletingChapter(false);
      setDeletingChapterId(null);
    }
  };
  
  // Hàm xử lý tạo video mới
  const handleCreateVideo = async (chapterId: string, data: VideoInput, file: File | null) => {
    if (!file) {
      toast.error('Cần phải chọn file video để tạo mới');
      return;
    }
    if(!courseId){
      toast.error('Cần phải chọn khóa học để tạo video');
      return
    }
    setIsCreatingVideo(true);
    try {
      // Tạo FormData ở component
      const formData = new FormData();
      
      // Thêm file video
      formData.append('file', file);
      
      // Thêm các trường dữ liệu khác
      formData.append('lessonname', data.lessonname);
      formData.append('chapterid', chapterId);
      formData.append('displayorder', data.displayorder.toString());
      if (data.description) formData.append('description', data.description);
      formData.append('productid', courseId );
      
      // Gửi FormData đã được tạo đến API
      await lessonService.createVideo(formData);
      refetchVideos();
      setShowVideoDialog(false);
      toast.success('Đã thêm video mới thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm video mới');
      console.error(error);
    } finally {
      setIsCreatingVideo(false);
    }
  };
  
  // Hàm xử lý cập nhật video
  const handleUpdateVideo = async (id: string, data: Partial<VideoInput>, file: File | null) => {
    // Khi cập nhật video, chúng ta không cho phép thay đổi file
    if (file) {
      toast.error('Không thể thay đổi file video khi cập nhật. Chỉ có thể thay đổi thông tin metadata.');
      return;
    }
    
    setIsUpdatingVideo(true);
    try {
      // Gửi dữ liệu cập nhật thông qua API
      await lessonService.updateVideo(id, data);
      refetchVideos();
      setShowVideoDialog(false);
      toast.success('Đã cập nhật video thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật video');
      console.error(error);
    } finally {
      setIsUpdatingVideo(false);
    }
  };
  
  // Hàm xử lý xóa video
  const handleDeleteVideo = async (id: string) => {
    setIsDeletingVideo(true);
    setDeletingVideoId(id);
    try {
      await lessonService.deleteVideo(id);
      refetchVideos();
      toast.success('Đã xóa video thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa video');
      console.error(error);
    } finally {
      setIsDeletingVideo(false);
      setDeletingVideoId(null);
    }
  };
  
  // Chapter form
  const chapterForm = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      chapterid: '',
      chaptername: '',
      displayorder: 0,
    }
  });
  
  // Video form
  const videoForm = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      lessonid: '',
      chapterid: '',
      lessonname: '',
      videourl: '',
      displayorder: 0,
      description: '',
      productid: ''
    }
  });
  
  // Handle add new chapter
  const handleAddNewChapter = () => {
    setIsEditing(false);
    setCurrentItemId(null);
    chapterForm.reset({
      chapterid: '',
      chaptername: '',
      displayorder: chapters.length + 1,
    });
    setShowChapterDialog(true);
  };
  
  // Handle add new video
  const handleAddNewVideo = () => {
    setIsEditing(false);
    setCurrentItemId(null);
    setVideoFile(null);
    videoForm.reset({
      lessonid: '',
      chapterid: '',
      lessonname: '',
      videourl: '',
      displayorder: videos.length + 1,
      description: '',
      productid: courseId || ''
    });
    setShowVideoDialog(true);
  };
  
  // Handle edit chapter
  const handleEditChapter = async (chapterId: string) => {
    setIsEditing(true);
    setCurrentItemId(chapterId);
    
    try {
      const chapterToEdit = await chapterService.getChapterById(chapterId);
      chapterForm.reset({
        chapterid: chapterToEdit.chapterid,
        chaptername: chapterToEdit.chaptername,
        displayorder: chapterToEdit.displayorder
      });
      setShowChapterDialog(true);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lấy thông tin chương');
      console.error(error);
    }
  }; 
  
  // Handle edit video
  const handleEditVideo = async (videoId: string) => {
    setIsEditing(true);
    setCurrentItemId(videoId);
    setVideoFile(null);
    
     try {
      const videoToEdit = await lessonService.getVideoById(videoId);
      if (videoToEdit) {
        videoForm.reset({
          lessonid: videoToEdit.lessonid,
          chapterid: videoToEdit.chapterid,
          lessonname: videoToEdit.lessonname,
          videourl: videoToEdit.videourl,
          displayorder: videoToEdit.displayorder,
          description: videoToEdit.description || '',
          productid: videoToEdit.productid
        });
        setShowVideoDialog(true);
      }
     } catch (error) {
      toast.error('Có lỗi xảy ra khi lấy thông tin video');
      console.error(error);
     }
  };
  
  // Handle video file selection
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };
  
  // Submit video form
  const onSubmitVideo = (data: VideoFormValues) => {
    if (!courseId) return;
    
    // Chuyển đổi từ VideoFormValues sang VideoInput theo định dạng interface
    const videoInputData: VideoInput = {
      lessonname: data.lessonname,
      chapterid: data.chapterid,     
      displayorder: data.displayorder,      
      description: data.description,
    };
    
    if (isEditing && currentItemId) {
      // Chỉnh sửa video - chỉ cập nhật metadata, không cập nhật file video
      handleUpdateVideo(currentItemId, videoInputData, null); // Truyền null cho file để không thay đổi file video
    } else {
      // Tạo video mới - sử dụng FormData để gửi cả file video và metadata
      handleCreateVideo(data.chapterid, videoInputData, videoFile);
    }
  };
  
  // Submit chapter form
  const onSubmitChapter = (data: ChapterFormValues) => {
    if(courseId){
      if (isEditing && currentItemId) {
        // Update existing chapter
        handleUpdateChapter(currentItemId, {
          chaptername: data.chaptername,
          displayorder: data.displayorder,
          productid: courseId
        });
      } else {
        // Add new chapter
        handleCreateChapter({
          chaptername: data.chaptername,
          displayorder: data.displayorder,
          productid: courseId
        });
      }
    }
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }
  
  if (!currentCourse) {
    return <div className="p-6">Khóa học không tồn tại</div>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => navigate('/admin/courses')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách khóa học
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý nội dung: {currentCourse.productname}</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="chapters">Chương</TabsTrigger>
          <TabsTrigger value="videos">Video</TabsTrigger>
        </TabsList>
        
        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddNewChapter}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm chương mới
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="text-right">Tùy chọn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chaptersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : chaptersError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-red-500">
                      Có lỗi khi tải dữ liệu
                    </TableCell>
                  </TableRow>
                ) : chapters.length > 0 ? (
                  chapters.map((chapter,index) => (
                    <TableRow key={chapter.chapterid}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{chapter.chaptername}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditChapter(chapter.chapterid)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteChapter(chapter.chapterid)}
                          disabled={isDeletingChapter}
                        >
                          {isDeletingChapter && deletingChapterId === chapter.chapterid ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Chưa có chương nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddNewVideo} disabled={chapters.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm video mới
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Chương</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead className="text-right">Tùy chọn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videosLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : videosError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-red-500">
                      Có lỗi khi tải dữ liệu
                    </TableCell>
                  </TableRow>
                ) : videos.length > 0 ? (
                  videos.map((video) => {
                    return (
                      <TableRow key={video.lessonid}>
                        <TableCell>{video.displayorder}</TableCell>
                        <TableCell>{video.chapters?.chaptername || 'N/A'}</TableCell>
                        <TableCell>{video.lessonname}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditVideo(video.lessonid)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteVideo(video.lessonid)}
                            disabled={isDeletingVideo}
                          >
                            {isDeletingVideo && deletingVideoId === video.lessonid ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      Chưa có video nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Chapter Dialog */}
      <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa chương' : 'Thêm chương mới'}</DialogTitle>
          </DialogHeader>
          
          <Form {...chapterForm}>
            <form onSubmit={chapterForm.handleSubmit(onSubmitChapter)} className="space-y-4">
              
              <FormField
                control={chapterForm.control}
                name="chaptername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề chương" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={chapterForm.control}
                name="displayorder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowChapterDialog(false)}
                  disabled={isCreatingChapter || isUpdatingChapter}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  disabled={isCreatingChapter || isUpdatingChapter}
                >
                  {(isCreatingChapter || isUpdatingChapter) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : isEditing ? 'Cập nhật' : 'Thêm chương'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa video' : 'Thêm video mới'}</DialogTitle>
          </DialogHeader>
          
          <Form {...videoForm}>
            <form onSubmit={videoForm.handleSubmit(onSubmitVideo)} className="space-y-4">      
              <FormField
                control={videoForm.control}
                name="lessonname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={videoForm.control}
                name="chapterid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chương</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="" disabled>Chọn chương</option>
                        {chapters.map(chapter => (
                          <option key={chapter.chapterid} value={chapter.chapterid}>{chapter.chaptername}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={videoForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={videoForm.control}
                name="displayorder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditing && <div className="space-y-2">
                <FormLabel>File video</FormLabel>
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md">
                  <div className="text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                      >
                        Chọn file video
                      </label>
                      <input 
                        id="video-upload" 
                        name="video-upload" 
                        type="file" 
                        className="sr-only"
                        onChange={handleVideoFileChange}
                        accept="video/*" 
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {videoFile ? videoFile.name : "MP4, MOV, tối đa 500MB"}
                    </p>
                  </div>
                </div>
              </div>
              } 
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowVideoDialog(false)}
                  disabled={isCreatingVideo || isUpdatingVideo}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  disabled={isCreatingVideo || isUpdatingVideo}
                >
                  {(isCreatingVideo || isUpdatingVideo) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : isEditing ? 'Cập nhật' : 'Thêm video'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourseContent;