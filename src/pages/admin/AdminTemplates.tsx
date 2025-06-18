
import React, { Suspense, useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,  
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash, Search, Upload, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import {useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/api/services/courseService';
import { ProductCourse } from '@/api/types';

// Course form schema
const courseSchema = z.object({
  productid:z.string(),
  productname: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string(),
  regularprice: z.string(),
  saleprice: z.string(),
  downloadurl: z.string(),
  textfunction: z.string(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-40">
    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const AdminTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
    // Fetch courses with React Query
  const {
    data: coursesData,
    isLoading,
    isError,
    refetch
  } = useQuery<ProductCourse[]>({
    queryKey: ['products', 'templates', searchQuery],
    queryFn: () => courseService.getCoursesAsProducts(searchQuery || undefined, false),
    enabled: true
  });
  // Form setup with react-hook-form and zod validation
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      productid: '',
      productname: '',
      description: '',
      regularprice: '',
      saleprice: '',
      downloadurl:'',
      textfunction:'',
    }
  });
  
  const handleAddNewCourse = () => {
    setIsEditing(false);
    setCurrentCourseId(null);
    setSelectedImage(null);
    setImagePreview(null);
    form.reset({
      productid: '',
      productname: '',
      description: '',
      regularprice: '',
      saleprice: '',
      downloadurl:'',
      textfunction:'',
    });
    setShowCourseDialog(true);
  };
  const handleEditCourse = async (courseId: string) => {
    try {
      setIsEditing(true);
      setCurrentCourseId(courseId);
      setSelectedImage(null);
      setImagePreview(null);
      const courseDetail = await courseService.getCourseById(courseId) as ProductCourse;
      form.reset({
        productid: courseDetail.productid,
        productname: courseDetail.productname || '',
        description: courseDetail.description || '',
        regularprice: courseDetail.regularprice || '',
        saleprice: courseDetail.saleprice || '',
        downloadurl:courseDetail.downloadurl||'',
        textfunction:courseDetail.textfunction||'',
      });
      
      if (courseDetail.imageurl) {
        setImagePreview(`http://localhost:3000/${courseDetail.imageurl}`);
      }
      setShowCourseDialog(true);
    } catch (error) {
      toast.error('Không thể lấy thông tin khóa học. Vui lòng thử lại sau.');
    }
  };
  
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.deleteCourse(courseId);
      toast.success(`Đã xoá templates có ID: ${courseId}`);
      
      refetch();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xoá templates.');
    }
  };

  const onSubmit = async (data: CourseFormValues) => {
    try {
      if (isEditing && currentCourseId) {
        await courseService.updateCourse(currentCourseId, {
          productname: data.productname,
          description: data.description,
          regularprice: data.regularprice,
          saleprice: data.saleprice,
          iscourse: false,
          downloadurl:data.downloadurl,
          textfunction:data.textfunction
        } as ProductCourse);
        
        if (selectedImage) {
          const imageFormData = new FormData();
          imageFormData.append('file', selectedImage);
          
          await courseService.uploadCourseImage(currentCourseId, imageFormData);
        }
        
        toast.success(`Đã cập nhật templates: ${data.productname}`);
      } else {
        const formData = new FormData();
        formData.append('productname', data.productname);
        formData.append('description', data.description);
        formData.append('regularprice', data.regularprice);
        formData.append('saleprice', data.saleprice);
        formData.append('iscourse', 'false'); // Phải gửi dạng string theo yêu cầu API
        formData.append('downloadurl',data.downloadurl)
        formData.append('textfunction',data.textfunction)
        // Thêm hình ảnh vào FormData nếu đã chọn
        if (selectedImage) {
          formData.append('file', selectedImage);
        }
        await courseService.createCourse(formData);
        toast.success(`Đã tạo templates mới: ${data.productname}`);
      }
      
      setShowCourseDialog(false);
      
      // Refetch courses to update the list
      refetch();
    } catch (error) { 
      toast.error('Có lỗi xảy ra khi lưu templates.');
      console.error('Error saving course:', error);
    }
  };
  

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Templates</h2>
        <Button onClick={handleAddNewCourse}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Template mới
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Suspense fallback={<LoadingFallback />}>
        <div className="border rounded-md">
          {isLoading ? (
            <LoadingFallback />
          ) : isError ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên templates</TableHead>
                <TableHead>Giá Bán</TableHead>
                <TableHead>Giá gốc</TableHead>
                <TableHead className="text-right">Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursesData.length > 0 ? (
                coursesData.map((course,index) => (
                  <TableRow key={course.productid}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{course.productname}</TableCell>
                    <TableCell>{course.saleprice}</TableCell>
                    <TableCell>{course.regularprice}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCourse(course.productid)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCourse(course.productid)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    Không tìm thấy templates nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </div>
      </Suspense>
      
      {/* Course Dialog Form */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa templates' : 'Thêm templates mới'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(
      (data) => {
        console.log("FORM SUBMITTED SUCCESSFULLY", data);
        onSubmit(data);
      }, 
      (errors) => {
        console.error("FORM VALIDATION ERRORS:", errors);
        Object.entries(errors).forEach(([field, error]) => {
          toast.error(`Lỗi: ${error?.message || 'Vui lòng kiểm tra lại trường ' + field}`);
        });
      }
    )} className="space-y-4">
              <FormField
                control={form.control}
                name="productname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên templates</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên templates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="saleprice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá Bán</FormLabel>
                    <FormControl>
                      <Input placeholder="499.000đ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regularprice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá gốc</FormLabel>
                    <FormControl>
                      <Input placeholder="499.000đ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập mô tả templates" 
                        className="h-16" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
             <FormField
                control={form.control}
                name="textfunction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Function</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập text function" 
                        className="h-16" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          
           <FormField
                control={form.control}
                name="downloadurl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập JSON</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập JSON" 
                        className="h-16" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           
              <div className="border-t pt-2">
                <FormLabel>Hình ảnh templates</FormLabel>
                <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-2 rounded-md">
                  {imagePreview ? (
                    <div className="text-center">
                      <img 
                        src={imagePreview} 
                        alt="Course preview" 
                        className="h-40 w-auto object-contain mb-4" 
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button" 
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Xóa hình ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
                        >
                          Tải hình ảnh lên
                        </label>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) { // 5MB
                                toast.error('File quá lớn. Kích thước tối đa là 5MB.');
                                return;
                              }
                              
                              // Lưu trữ file gốc để gửi lên server
                              setSelectedImage(file);
                              
                              // Tạo URL tạm thời để hiển thị preview
                              const objectUrl = URL.createObjectURL(file);
                              setImagePreview(objectUrl);
                            }
                          }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, GIF tối đa 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCourseDialog(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {isEditing ? 'Cập nhật' : 'Tạo templates'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTemplates;
