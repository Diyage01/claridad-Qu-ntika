import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  X,
  ShoppingBag,
  Briefcase,
  LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, onLogout, isAuthenticated, userRole }) => {
  const navigate = useNavigate();

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Mis Cursos', icon: BookOpen },
    { id: 'store', label: 'Tienda', icon: ShoppingBag },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const teacherMenuItems = [
    { id: 'teacher-dashboard', label: 'Panel Profesor', icon: LayoutDashboard },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    if (userRole === 'teacher' && tabId === 'teacher-dashboard') {
      navigate('/');
    } else if (userRole === 'student' && tabId === 'dashboard') {
      navigate('/');
    }
    
    if (window.innerWidth < 768) { 
      onClose();
    }
  };
  
  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
    if (window.innerWidth < 768) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && isAuthenticated && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 md:relative md:translate-x-0 flex flex-col"
          >
            <div className="p-4 border-b border-border md:hidden">
              <div className="flex items-center justify-between">
                <Link to={userRole === 'teacher' ? "/teacher-dashboard" : "/"} className="flex items-center space-x-2" onClick={onClose}>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AC</span>
                  </div>
                  <span className="font-semibold gradient-text">Academia Cursos</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <nav className="p-4 space-y-2 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} whileHover={{ x: 4 }}>
                    <Button
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="w-full justify-start space-x-3"
                      onClick={() => handleNavigation(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </nav>

            {isAuthenticated && (
              <div className="p-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;