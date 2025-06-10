import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Search, Menu, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ user, onMenuToggle, isAuthenticated, userRole }) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-90"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to={userRole === 'teacher' ? "/" : "/"} className="flex items-center space-x-2">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-bold gradient-text">Academia Cursos</span>
            </motion.div>
          </Link>
        </div>

        {isAuthenticated && userRole === 'student' && (
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {userRole === 'student' && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              )}
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground">{userRole === 'teacher' ? 'Profesor' : 'Estudiante'}</p>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;