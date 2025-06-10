import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, TrendingUp, Play, Star, Zap } from 'lucide-react';

const Dashboard = ({ enrolledCourses, coursesData, currentUser }) => {
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;
  
  const totalHours = enrolledCourses.reduce((acc, enrolled) => {
    const courseData = coursesData.find(c => c.id === enrolled.courseId);
    return acc + (courseData?.modules.reduce((modAcc, mod) => modAcc + (parseInt(mod.duration) || 0), 0) || 0);
  }, 0);

  const completedHours = enrolledCourses.reduce((acc, enrolled) => {
    const courseData = coursesData.find(c => c.id === enrolled.courseId);
    if (!courseData) return acc;
    const userEnrollment = enrolledCourses.find(e => e.courseId === courseData.id && e.userId === currentUser.id);
    if (!userEnrollment) return acc;

    return acc + courseData.modules
      .filter(mod => userEnrollment.completedModules?.includes(mod.id))
      .reduce((modAcc, mod) => modAcc + (parseInt(mod.duration) || 0), 0);
  }, 0);

  const stats = [
    { title: "Cursos Inscritos", value: totalCourses, icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Cursos Completados", value: completedCourses, icon: Trophy, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "En Progreso", value: inProgressCourses, icon: TrendingUp, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { title: "Horas Completadas", value: `${completedHours}h / ${totalHours}h`, icon: Clock, color: "text-purple-500", bgColor: "bg-purple-500/10" }
  ];

  const recentCourses = enrolledCourses
    .filter(course => course.progress > 0 && course.progress < 100)
    .map(ec => coursesData.find(c => c.id === ec.courseId))
    .filter(Boolean)
    .slice(0, 3);
    
  const getSuggestedCourses = () => {
    const enrolledTags = new Set();
    enrolledCourses.forEach(ec => {
      const course = coursesData.find(c => c.id === ec.courseId);
      course?.tags?.forEach(tag => enrolledTags.add(tag));
    });

    let suggestions = [];
    if (enrolledTags.size > 0) {
      suggestions = coursesData.filter(course => 
        !enrolledCourses.some(ec => ec.courseId === course.id) &&
        course.tags?.some(tag => enrolledTags.has(tag))
      );
    } else {
      // For new students, suggest popular or varied courses
      suggestions = coursesData
        .filter(course => !enrolledCourses.some(ec => ec.courseId === course.id))
        .sort((a, b) => (b.students || 0) - (a.students || 0)) // Suggest popular first
        .slice(0, 5); // Limit to 5 for new students
    }
    return suggestions.slice(0, 3); // Max 3 suggestions displayed
  };

  const suggestedCourses = getSuggestedCourses();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">¡Bienvenido de vuelta, {currentUser?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Continúa tu viaje de aprendizaje o explora algo nuevo.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="glass-effect hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-effect h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Play className="h-5 w-5 text-primary" /><span>Continuar Aprendiendo</span></CardTitle>
              <CardDescription>Tus cursos actualmente en progreso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.length > 0 ? (
                recentCourses.map((course) => {
                  const enrollment = enrolledCourses.find(ec => ec.courseId === course.id);
                  return (
                    <Link to={`/course/${course.id}`} key={course.id}>
                      <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{course.title}</h4>
                          <Badge variant="secondary">{enrollment?.progress || 0}%</Badge>
                        </div>
                        <Progress value={enrollment?.progress || 0} className="h-1 mb-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1"><Star className="h-3 w-3" /><span>{course.rating}</span></span>
                          <span>{course.duration}</span>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tienes cursos en progreso.</p>
                  <p className="text-sm">¡Inscríbete en un curso para comenzar!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-effect h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Zap className="h-5 w-5 text-primary" /><span>Cursos Sugeridos</span></CardTitle>
              <CardDescription>Descubre nuevos temas basados en tus intereses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedCourses.length > 0 ? (
                suggestedCourses.map(course => (
                  <Link to={`/course/${course.id}`} key={course.id}>
                    <motion.div whileHover={{ scale: 1.03 }} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h5 className="font-medium text-sm line-clamp-1">{course.title}</h5>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>{course.category}</span>
                        <span className="flex items-center"><Star className="h-3 w-3 mr-1 text-yellow-400" />{course.rating}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                 <div className="text-center py-6 text-muted-foreground">
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>Explora nuestros cursos para encontrar tu próxima aventura de aprendizaje.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;