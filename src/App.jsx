import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { coursesData as initialCoursesData } from '@/data/coursesData'; // Renamed to avoid conflict
import { productsData as initialProductsData } from '@/data/productsData';


import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import MyCourses from '@/components/MyCourses';
import CourseDetail from '@/components/CourseDetail'; // This is the student's view of an enrolled course content
import Achievements from '@/components/Achievements';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import StorePage from '@/pages/StorePage'; 
import TeacherDashboardPage from '@/pages/TeacherDashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import PublicCoursePage from '@/pages/PublicCoursePage'; // This is the public-facing course sales page
import PublicProductPage from '@/pages/PublicProductPage';

const ProtectedRoute = ({ children, isAuthenticated, isTeacherRoute = false, userRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isTeacherRoute && userRole !== 'teacher') {
    return <Navigate to="/" replace />; 
  }
  return children;
};

function App() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourseIdForStudentView, setSelectedCourseIdForStudentView] = useState(null); // For student's enrolled course content view
  
  const [courses, setCourses] = useLocalStorage('courses', initialCoursesData);
  const [products, setProducts] = useLocalStorage('products', initialProductsData);
  const [enrolledCourses, setEnrolledCourses] = useLocalStorage('enrolledCourses', []);
  const [users, setUsers] = useLocalStorage('users', []);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);

  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role;

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const fontSize = localStorage.getItem('fontSize') || '16';
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, []);

  const handleLogin = (credentials) => {
    if (credentials.password === 'CQVD') {
      const teacherUser = { 
        email: credentials.email, 
        name: `Prof. ${credentials.email.split('@')[0]}`, 
        role: 'teacher', 
        id: `teacher_${Date.now()}` 
      };
      setCurrentUser(teacherUser);
      setActiveTab('teacher-dashboard');
      return true;
    }

    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      setCurrentUser({...user, role: 'student'});
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  const handleSignup = (newUserData) => {
    if (users.some(u => u.email === newUserData.email)) {
      return false; 
    }
    const newUser = { ...newUserData, id: Date.now().toString(), role: 'student' };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard'); 
  };

  const handleEnrollCourse = (courseId) => {
    if (!isAuthenticated || currentUser.role !== 'student') {
      toast({ title: "Acción Requerida", description: "Por favor, inicia sesión como estudiante para inscribirte.", variant: "destructive" });
      return;
    }
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newEnrollment = {
      courseId,
      userId: currentUser.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedModules: [],
      lastCompletedModuleTimestamp: null,
    };

    setEnrolledCourses(prev => [...prev, newEnrollment]);
    
    toast({
      title: "¡Inscripción exitosa!",
      description: `Te has inscrito en "${course.title}". ¡Comienza a aprender!`,
    });
  };

  const handleContinueCourse = (courseId) => { // This is for student to view enrolled course content
    setSelectedCourseIdForStudentView(courseId);
    setActiveTab('course-content'); // Special tab for this view
  };

  const handleToggleModule = (courseId, moduleId) => {
    setEnrolledCourses(prev => {
      return prev.map(enrollment => {
        if (enrollment.courseId === courseId && enrollment.userId === currentUser?.id) {
          const courseData = courses.find(c => c.id === courseId);
          if (!courseData) return enrollment;

          const completedModules = enrollment.completedModules || [];
          const isCompleted = completedModules.includes(moduleId);
          
          let newCompletedModules;
          if (isCompleted) {
            newCompletedModules = completedModules.filter(id => id !== moduleId);
          } else {
            newCompletedModules = [...completedModules, moduleId];
          }
          
          const totalModules = courseData.modules?.length || 1;
          const progress = Math.round((newCompletedModules.length / totalModules) * 100);

          if (!isCompleted && progress === 100) {
            toast({
              title: "¡Felicitaciones!",
              description: `Has completado el programa "${courseData.title}"`,
            });
          }

          return {
            ...enrollment,
            completedModules: newCompletedModules,
            progress,
            lastCompletedModuleTimestamp: new Date().toISOString(),
          };
        }
        return enrollment;
      });
    });
  };
  
  const userEnrolledCourses = enrolledCourses.filter(enrollment => enrollment.userId === currentUser?.id);

  const renderContent = () => {
    // Student view of enrolled course content
    if (activeTab === 'course-content' && selectedCourseIdForStudentView && currentUser?.role === 'student') {
      const courseToView = courses.find(c => c.id === selectedCourseIdForStudentView);
      const enrollmentDetails = userEnrolledCourses.find(e => e.courseId === selectedCourseIdForStudentView);
      
      return (
        <CourseDetail
          course={courseToView}
          enrolledCourse={enrollmentDetails}
          onBack={() => {
            setSelectedCourseIdForStudentView(null);
            setActiveTab('courses'); // Go back to My Courses tab
          }}
          onToggleModule={handleToggleModule}
          onEnroll={handleEnrollCourse} // Should not be needed here if already enrolled
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return currentUser?.role === 'student' ? (
          <Dashboard 
            enrolledCourses={userEnrolledCourses}
            coursesData={courses} // Use updated courses from state
            currentUser={currentUser}
          />
        ) : <Navigate to="/teacher-dashboard" replace />;
      case 'courses':
        return currentUser?.role === 'student' ? (
          <MyCourses
            enrolledCourses={userEnrolledCourses}
            coursesData={courses} // Use updated courses from state
            onContinueCourse={handleContinueCourse}
            onEnrollCourse={handleEnrollCourse} // For enrolling from "Available" tab
          />
        ) : <Navigate to="/teacher-dashboard" replace />;
      case 'achievements':
        return currentUser?.role === 'student' ? (
          <Achievements
            enrolledCourses={userEnrolledCourses}
            coursesData={courses}
          />
        ) : <Navigate to="/teacher-dashboard" replace />;
      case 'store':
        return <StorePage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'teacher-dashboard':
        return currentUser?.role === 'teacher' ? <TeacherDashboardPage /> : <Navigate to="/" replace />;
      default:
        return currentUser?.role === 'teacher' ? <Navigate to="/teacher-dashboard" replace /> : <Navigate to="/" replace />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
          <Route path="/course/:courseId" element={<PublicCoursePage />} />
          <Route path="/product/:productId" element={<PublicProductPage />} />
          <Route 
            path="/teacher-dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isTeacherRoute={true} userRole={userRole}>
                <div className="flex">
                  <Sidebar // Permanent for teacher dashboard
                    isOpen={true} 
                    onClose={() => {}} 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={handleLogout}
                    isAuthenticated={isAuthenticated}
                    userRole={userRole}
                  />
                  <div className="flex-1 flex flex-col min-h-screen">
                    <Header 
                      user={currentUser}
                      onMenuToggle={() => setSidebarOpen(true)} // For mobile potentially
                      isAuthenticated={isAuthenticated}
                      userRole={userRole}
                    />
                    <main className="flex-1 p-6">
                      <div className="max-w-7xl mx-auto">
                        <TeacherDashboardPage />
                      </div>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/*" // Main app routes for students mostly
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <div className="flex">
                   <div className="hidden md:block"> {/* Permanent sidebar for desktop */}
                    <Sidebar
                      isOpen={true}
                      onClose={() => {}} // Not closable on desktop
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onLogout={handleLogout}
                      isAuthenticated={isAuthenticated}
                      userRole={userRole}
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-h-screen">
                    <Header 
                      user={currentUser}
                      onMenuToggle={() => setSidebarOpen(true)} // For mobile sidebar
                      isAuthenticated={isAuthenticated}
                      userRole={userRole}
                    />
                    <main className="flex-1 p-6">
                      <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab + (selectedCourseIdForStudentView || '')}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            {renderContent()}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </main>
                  </div>
                </div>
                 {/* Mobile sidebar */}
                <Sidebar 
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onLogout={handleLogout}
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;