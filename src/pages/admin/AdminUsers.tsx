
import React, { Suspense, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Pencil, Trash, UserCheck, UserX } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { 
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage 
} from '@/components/ui/form';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock user data
const mockUsers = [
  { id: '1', fullName: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'admin', status: 'active' },
  { id: '2', fullName: 'Trần Thị B', email: 'tranthib@example.com', role: 'user', status: 'active' },
  { id: '3', fullName: 'Lê Văn C', email: 'levanc@example.com', role: 'user', status: 'active' },
  { id: '4', fullName: 'Phạm Thị D', email: 'phamthid@example.com', role: 'user', status: 'inactive' },
  { id: '5', fullName: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'user', status: 'active' }
];

// User form schema
const userSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  role: z.string().min(1, "Vai trò không được để trống"),
  status: z.string().min(1, "Trạng thái không được để trống"),
  password: z.string().optional()
});

type UserFormValues = z.infer<typeof userSchema>;

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-40">
    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Form setup with react-hook-form and zod validation
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      fullName: '',
      email: '',
      role: 'user',
      status: 'active',
      password: ''
    }
  });
  
  const handleAddNewUser = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    form.reset({
      id: '',
      fullName: '',
      email: '',
      role: 'user',
      status: 'active',
      password: ''
    });
    setShowUserDialog(true);
  };
  
  const handleEditUser = (userId: string) => {
    setIsEditing(true);
    setCurrentUserId(userId);
    
    const userToEdit = mockUsers.find(u => u.id === userId);
    if (userToEdit) {
      form.reset({
        id: userToEdit.id,
        fullName: userToEdit.fullName,
        email: userToEdit.email,
        role: userToEdit.role,
        status: userToEdit.status,
      });
      setShowUserDialog(true);
    }
  };
  
  const handleDeleteUser = (userId: string) => {
    // In a real app, this would call an API to delete the user
    toast.success(`Đã xoá người dùng có ID: ${userId}`);
  };
  
  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    // In a real app, this would call an API to update the user status
    toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} người dùng có ID: ${userId}`);
  };

  const onSubmit = (data: UserFormValues) => {
    if (isEditing) {
      toast.success(`Đã cập nhật thông tin người dùng: ${data.fullName}`);
    } else {
      toast.success(`Đã tạo người dùng mới: ${data.fullName}`);
    }
    setShowUserDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <Button onClick={handleAddNewUser}>
          Thêm người dùng mới
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm người dùng..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Suspense fallback={<LoadingFallback />}>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id, user.status)}
                      >
                        {user.status === 'active' ? (
                          <UserX className="h-4 w-4 text-red-500" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteUser(user.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Suspense>
      
      {/* User Dialog Form */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Chỉnh sửa thông tin người dùng' : 'Thêm người dùng mới'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Quản trị viên</SelectItem>
                          <SelectItem value="user">Người dùng</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Bị khóa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowUserDialog(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {isEditing ? 'Cập nhật' : 'Tạo người dùng'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
