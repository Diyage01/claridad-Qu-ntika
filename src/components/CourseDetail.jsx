import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  Star,
  BookOpen,
  Award,
  Lock,
  CalendarDays
} from 'lucide-react';
import { format, addHours, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLocalStorage } from '@/hooks/useLocalStorage'; // Needed to update courses for unlock time

const CourseDetail = ({ course, enrolledCourse, onBack, onToggleModule }) => {
  const [activeModuleContent, setActiveModuleContent] = useState(null);
  const [courses, setCourses] = useLocalStorage('courses', []); // Access global courses for unlock logic

  useEffect(() => {
    if (course && course.modules && course.modules.length > 0) {
       const firstAccessibleModule = course.modules.find((module, index) => {
         const isPreviouslyCompleted = index === 0 || enrolledCourse?.completedModules?.includes(course.modules[index - 1]?.id);
         const unlockDate = getModuleUnlockDate(module, index);
         const isUnlockedByTime = !unlockDate || isPast(unlockDate);
         return isPreviouslyCompleted && isUnlockedByTime;
       });
       if (firstAccessibleModule) {
         setActiveModuleContent(firstAccessibleModule);
       } else {
         setActiveModuleContent(course.modules[0]); // Default to first module if none are immediately accessible (e.g. time lock)
       }
    }
  }, [course, enrolledCourse]);


  if (!course) return <div className="text-center py-12">Cargando detalles del programa...</div>;
  if (!enrolledCourse) return <div className="text-center py-12">No estás inscrito en este programa.</div>;

  const completedModules = enrolledCourse.completedModules || [];
  const progress = enrolledCourse.progress || 0;

  const getModuleUnlockDate = (module, moduleIndex) => {
    const courseConfig = courses.find(c => c.id === course.id); // Get full course data from global state
    if (!courseConfig || !courseConfig.hoursBetweenModules || moduleIndex === 0) return null;

    const previousModuleId = course.modules[moduleIndex - 1]?.id;
    if (enrolledCourse.completedModules.includes(previousModuleId)) {
      const lastCompletionTimestamp = enrolledCourse.lastCompletedModuleTimestamp || enrolledCourse.enrolledAt;
      if (!lastCompletionTimestamp) return null; // Should not happen if previous module is completed
      
      return addHours(new Date(lastCompletionTimestamp), parseInt(courseConfig.hoursBetweenModules));
    }
    return null; 
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold gradient-text">{course.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeModuleContent && (
            <Card className="glass-effect sticky top-20 z-10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-6 w-6 text-primary" />
                  <span>{activeModuleContent.title}</span>
                </CardTitle>
                <CardDescription>Duración: {activeModuleContent.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {activeModuleContent.content || "El contenido de este módulo estará disponible pronto. ¡Sigue aprendiendo!"}
                </p>
                {/* Placeholder for rich text/image editor content */}
                <div className="mt-4 p-4 border rounded-lg bg-background/50 min-h-[200px]">
                  <h3 className="font-semibold mb-2">Contenido del Módulo:</h3>
                  <p>Aquí se mostraría el contenido enriquecido del módulo: texto, imágenes, videos, etc.</p>
                  <img  className="w-full h-auto rounded-md my-4 object-cover" alt={`Contenido visual para ${activeModuleContent.title}`} src="https://images.unsplash.com/photo-1516116216624-53e697fedbea" />
                  <p>Este es un ejemplo de cómo se podría estructurar el contenido. Los profesores podrán editar esto.</p>
                </div>
                 {!completedModules.includes(activeModuleContent.id) && (
                    <Button 
                      onClick={() => onToggleModule(course.id, activeModuleContent.id)} 
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-600"
                    >
                      Marcar como Completado
                    </Button>
                  )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:pt-0 pt-8"> {/* Adjust pt for sticky behavior */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Módulos del programas</span>
              </CardTitle>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Tu Progreso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
              {course.modules?.map((module, index) => {
                const isCompleted = completedModules.includes(module.id);
                const previousModuleId = index > 0 ? course.modules[index - 1]?.id : null;
                const isPreviousModuleCompleted = index === 0 || completedModules.includes(previousModuleId);
                
                const unlockDate = getModuleUnlockDate(module, index);
                const isLockedByTime = unlockDate && !isPast(unlockDate);
                const isAccessible = isPreviousModuleCompleted && !isLockedByTime;

                return (
                  <motion.div
                    key={module.id}
                    whileHover={isAccessible ? { scale: 1.02 } : {}}
                    className={`p-3 rounded-lg border transition-all ${
                      isCompleted 
                        ? 'bg-green-500/20 border-green-500/50' 
                        : isAccessible 
                          ? 'bg-muted/50 hover:bg-muted/70 cursor-pointer' 
                          : 'bg-muted/20 opacity-50 cursor-not-allowed'
                    } ${activeModuleContent?.id === module.id && isAccessible ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => isAccessible && setActiveModuleContent(module)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-full ${
                          isCompleted ? 'bg-green-500' : isAccessible ? 'bg-primary' : 'bg-muted-foreground'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-3 w-3 text-white" /> : isAccessible ? <Play className="h-3 w-3 text-white" /> : <Lock className="h-3 w-3 text-background" />}
                        </div>
                        <div>
                          <h4 className={`text-sm font-medium ${!isAccessible && !isCompleted ? 'text-muted-foreground' : ''}`}>{module.title}</h4>
                          <p className="text-xs text-muted-foreground">{module.duration}</p>
                        </div>
                      </div>
                    </div>
                    {isLockedByTime && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        Se desbloquea: {format(unlockDate, "dd MMM, HH:mm", { locale: es })}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;