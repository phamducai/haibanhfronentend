
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Separator } from '@/components/ui/separator';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const loginFormSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu')
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setIsGoogleSubmitting(true);
      if (!credentialResponse.credential) {
        throw new Error('Google authentication failed: No credentials provided');
      }
      
      // Decode the JWT token to get user information
      const decodedToken = decodeJwtToken(credentialResponse.credential);
      
      // Create a Google auth response object from the decoded token
      const googleUserData = {
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      };
      
      // Call the authentication method with the Google user data
      const success = await loginWithGoogle(googleUserData);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };
  
  // Helper function to decode JWT token
  const decodeJwtToken = (token: string) => {
    try {
      // JWT tokens are formatted as header.payload.signature
      // We need the payload part (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw error;
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập | Haismartlife</title>
        <meta name="description" content="Đăng nhập vào tài khoản Haismartlife của bạn để truy cập các khóa học và template" />
        <meta property="og:title" content="Đăng nhập | Haismartlife" />
        <meta property="og:description" content="Đăng nhập vào tài khoản Haismartlife của bạn để truy cập các khóa học và template" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Login Button */}
            <div className="grid gap-2">
              <div className="w-full flex justify-center">
                {isGoogleSubmitting ? (
                  <div className="w-full flex items-center justify-center p-2 border rounded-md">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.error('Google Login Failed');
                    }}
                    useOneTap
                    theme="outline"
                    size="large"
                    width="100%"
                    locale="vi"
                    text="signin_with"
                    logo_alignment="center"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Separator className="w-[40%]" />
              <span className="text-xs text-muted-foreground px-2">HOẶC</span>
              <Separator className="w-[40%]" />
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@example.com"
                          disabled={isSubmitting || isGoogleSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          disabled={isSubmitting || isGoogleSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : "Đăng nhập"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/dang-ky" className="text-primary hover:underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
