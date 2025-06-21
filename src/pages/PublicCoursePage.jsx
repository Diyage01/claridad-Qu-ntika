import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, Star, BookOpen, Award, CalendarDays, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PublicCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useLocalStorage('courses', []);
  const [currentUser] = useLocalStorage('currentUser', null);
  const [enrolledCourses, setEnrolledCourses] = useLocalStorage('enrolledCourses', []);

  const course = courses.find(c => c.id.toString() === courseId);

  if (!course) {
    return <div className="text-center py-12">programa no encontrado.</div>;
  }

  const isEnrolled = currentUser && enrolledCourses.some(ec => ec.courseId.toString() === courseId && ec.userId === currentUser.id);
  const userEnrollment = isEnrolled ? enrolledCourses.find(ec => ec.courseId.toString() === courseId && ec.userId === currentUser.id) : null;
  
  const handleEnroll = () => {
    if (!currentUser) {
      toast({ title: "Acción Requerida", description: "Inicia sesión para inscribirte.", variant: "destructive" });
      navigate('/login');
      return;
    }
    if (currentUser.role === 'teacher') {
       toast({ title: "Acción no permitida", description: "Los profesores no pueden inscribirse a programas.", variant: "destructive" });
       return;
    }

    const newEnrollment = {
      courseId: course.id,
      userId: currentUser.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedModules: [],
      lastCompletedModuleAt: null, 
    };
    setEnrolledCourses(prev => [...prev, newEnrollment]);
    toast({ title: "¡Inscripción Exitosa!", description: `Te has inscrito en "${course.title}".` });
  };
  
  const getModuleUnlockDate = (moduleIndex) => {
    if (!userEnrollment || moduleIndex === 0 || !course.hoursBetweenModules) return null;
    if (userEnrollment.completedModules.includes(course.modules[moduleIndex - 1].id)) {
       const lastModuleCompletionTime = new Date(userEnrollment.lastCompletedModuleTimestamp || userEnrollment.enrolledAt).getTime();
       const unlockTime = lastModuleCompletionTime + (course.hoursBetweenModules * 60 * 60 * 1000);
       return new Date(unlockTime);
    }
    return null;
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-effect overflow-hidden">
            <img  class="w-full h-72 object-cover" alt={`Banner del programa ${course.title}`} src="https://images.unsplash.com/photo-1677696795233-5ef097695f12" />
            <CardHeader>
              <CardTitle className="text-3xl font-bold gradient-text">{course.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
                {course.tags?.map(tag => <Badge key={tag} className="bg-primary/20 text-primary">{tag}</Badge>)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">{course.description}</p>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><BookOpen className="h-6 w-6" /><span>Contenido del programa</span></CardTitle>
              {course.hoursBetweenModules && <CardDescription>Las clases se desbloquean {course.hoursBetweenModules} horas después de completar la anterior.</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              {course.modules?.map((module, index) => {
                const isModuleCompleted = userEnrollment?.completedModules.includes(module.id);
                const previousModuleId = index > 0 ? course.modules[index-1].id : null;
                const isPreviousModuleCompleted = index === 0 || userEnrollment?.completedModules.includes(previousModuleId);
                const unlockDate = getModuleUnlockDate(index);
                const isLockedByTime = unlockDate && new Date() < unlockDate;
                const isAccessible = isEnrolled && isPreviousModuleCompleted && !isLockedByTime;

                return (
                  <div key={module.id} className={`p-4 rounded-lg border flex justify-between items-center ${isModuleCompleted ? 'bg-green-500/10 border-green-500' : isAccessible ? 'bg-muted/30' : 'bg-muted/10 opacity-70'}`}>
                    <div>
                      <h4 className="font-semibold">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">{module.duration}</p>
                      {isLockedByTime && (
                        <p className="text-xs text-amber-500 mt-1 flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          Disponible el {format(unlockDate, "PPPp", { locale: es })}
                        </p>
                      )}
                    </div>
                    {isEnrolled && isAccessible && !isModuleCompleted && (
                      <Button size="sm" onClick={() => {
                        setEnrolledCourses(prev => prev.map(ec => ec.courseId === course.id && ec.userId === currentUser.id ? {...ec, completedModules: [...ec.completedModules, module.id], progress: Math.round(((ec.completedModules.length + 1) / course.modules.length) * 100), lastCompletedModuleTimestamp: new Date().toISOString() } : ec));
                        toast({title: "Módulo Completado!", description: `Has completado "${module.title}".`})
                      }}>Marcar Completado</Button>
                    )}
                    {isModuleCompleted && <Badge variant="secondary" className="bg-green-600 text-white">Completado</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect sticky top-24">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold gradient-text">${course.price}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><Star className="h-4 w-4 mr-2 text-yellow-400" /> {course.rating} Estrellas ({course.students} estudiantes)</li>
                <li className="flex items-center"><Clock className="h-4 w-4 mr-2" /> {course.duration} de contenido</li>
                <li className="flex items-center"><Users className="h-4 w-4 mr-2" /> Instructor: {course.instructor}</li>
                <li className="flex items-center"><Award className="h-4 w-4 mr-2" /> Certificado al completar</li>
              </ul>
              {isEnrolled ? (
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm font-medium text-green-500">¡Ya estás inscrito!</p>
                  <Link to="/" onClick={() => {
                     const appInstance = document.querySelector("#root")._reactRootContainer._internalRoot.current.child.stateNode;
                     appInstance.setActiveTab('courses');
                     appInstance.setSelectedCourse(course.id);
                    }}>
                    <Button variant="link" className="mt-1">Ir a Mis programas</Button>
                  </Link>
                </div>
              ) : (
                <Button onClick={handleEnroll} size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Inscribirse Ahora
                </Button>
              )}
            </CardContent>
            <CardFooter>
               <p className="text-xs text-muted-foreground">Acceso de por vida. Aprende a tu propio ritmo.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicCoursePage;