
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CoursesList from "./pages/CoursesList";
import CourseDetail from "./pages/CourseDetail";
import Story from "./pages/Story";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Products from "./pages/Products";

// Admin Pages (lazy loaded)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminTemplates = lazy(() => import("./pages/admin/AdminTemplates"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCourseContent = lazy(() => import("./pages/admin/AdminCourseContent"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-3">Đang tải...</span>
  </div>
);

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Helmet>
                <title>Haismartlife - Tự động hóa và AI</title>
                <meta name="description" content="Chia sẻ kiến thức về tự động hoá quy trình làm việc nâng cao hiệu suất bằng việc tích hợp AI và bán hàng template và khoá học về n8n." />
                <meta name="keywords" content="n8n, workflow, automation, template, AI, machine learning, course" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://haismartlife.com" />
                <meta property="og:title" content="Haismartlife - Tự động hóa và AI" />
                <meta property="og:description" content="Chia sẻ kiến thức về tự động hoá quy trình làm việc nâng cao hiệu suất bằng việc tích hợp AI." />
                <meta name="twitter:card" content="summary_large_image" />
              </Helmet>
              <Toaster />
              <Sonner />
              
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminLayout />
                  </Suspense>
                }>
                  <Route index element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminDashboard />
                    </Suspense>
                  } />
                  <Route path="courses" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminCourses />
                    </Suspense>
                  } />
                  <Route path="courses/:courseId" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminCourseContent />
                    </Suspense>
                  } />
                  <Route path="templates" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminTemplates />
                    </Suspense>
                  } />
                  <Route path="users" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminUsers />
                    </Suspense>
                  } />
                </Route>
                
                {/* Auth Pages */}
                <Route path="/dang-nhap" element={<LoginPage />} />
                <Route path="/dang-ky" element={<RegisterPage />} />
                
                {/* Main Website Routes */}
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <main>
                        <Home />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="*"
                  element={
                    <>
                      <Navbar />
                      <main>
                        <Routes>
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:postId" element={<BlogPost />} />
                          <Route path="/khoa-hoc" element={<CoursesList />} />
                          <Route path="/khoa-hoc/:courseId" element={<CourseDetail />} />
                          <Route path="/cau-chuyen" element={<Story />} />
                          <Route path="/lien-he" element={<Contact />} />
                          <Route path="/thanh-toan" element={<Checkout />} />
                          <Route path="/tim-kiem" element={<SearchResults />} />
                          <Route path="/tai-khoan" element={<UserDashboard />} />
                          <Route path="/san-pham-da-mua" element={<CoursesList />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
