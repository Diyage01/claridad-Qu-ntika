
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Award, BookOpen, Clock, Users } from 'lucide-react';

const Achievements = ({ enrolledCourses, coursesData }) => {
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const totalHours = enrolledCourses.reduce((acc, course) => {
    const courseData = coursesData.find(c => c.id === course.courseId);
    if (!courseData) return acc;
    const completedModules = course.completedModules || [];
    return acc + courseData.modules
      .filter(mod => completedModules.includes(mod.id))
      .reduce((modAcc, mod) => modAcc + parseInt(mod.duration), 0);
  }, 0);

  const achievements = [
    {
      id: 1,
      title: "Primer Paso",
      description: "Completa tu primer módulo",
      icon: Target,
      progress: enrolledCourses.some(course => course.completedModules?.length > 0) ? 100 : 0,
      maxProgress: 100,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      earned: enrolledCourses.some(course => course.completedModules?.length > 0)
    },
    {
      id: 2,
      title: "Estudiante Dedicado",
      description: "Completa 3 cursos",
      icon: BookOpen,
      progress: Math.min((completedCourses / 3) * 100, 100),
      maxProgress: 100,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      earned: completedCourses >= 3
    },
    {
      id: 3,
      title: "Maratonista del Aprendizaje",
      description: "Acumula 50 horas de estudio",
      icon: Clock,
      progress: Math.min((totalHours / 50) * 100, 100),
      maxProgress: 100,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      earned: totalHours >= 50
    },
    {
      id: 4,
      title: "Explorador",
      description: "Inscríbete en cursos de 3 categorías diferentes",
      icon: Star,
      progress: 0, // Simplified for demo
      maxProgress: 100,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      earned: false
    },
    {
      id: 5,
      title: "Velocista",
      description: "Completa un curso en menos de una semana",
      icon: Zap,
      progress: 0, // Simplified for demo
      maxProgress: 100,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      earned: false
    },
    {
      id: 6,
      title: "Maestro",
      description: "Completa 10 cursos",
      icon: Award,
      progress: Math.min((completedCourses / 10) * 100, 100),
      maxProgress: 100,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      earned: completedCourses >= 10
    }
  ];

  const earnedAchievements = achievements.filter(achievement => achievement.earned);
  const inProgressAchievements = achievements.filter(achievement => !achievement.earned && achievement.progress > 0);
  const lockedAchievements = achievements.filter(achievement => !achievement.earned && achievement.progress === 0);

  const stats = [
    {
      title: "Logros Obtenidos",
      value: earnedAchievements.length,
      total: achievements.length,
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Cursos Completados",
      value: completedCourses,
      icon: BookOpen,
      color: "text-green-500"
    },
    {
      title: "Horas de Estudio",
      value: totalHours,
      icon: Clock,
      color: "text-blue-500"
    },
    {
      title: "Puntos de Experiencia",
      value: completedCourses * 100 + totalHours * 10,
      icon: Star,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">Logros y Reconocimientos</h1>
        <p className="text-muted-foreground">Celebra tus éxitos en el aprendizaje</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stat.total ? `${stat.value}/${stat.total}` : stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-6">
        {earnedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Logros Obtenidos</span>
                </CardTitle>
                <CardDescription>¡Felicitaciones por estos logros!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg ${achievement.bgColor} border border-current/20 relative overflow-hidden`}
                      >
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 text-yellow-900">
                            ¡Obtenido!
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-full ${achievement.bgColor}`}>
                            <Icon className={`h-5 w-5 ${achievement.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="mt-3">
                          <Progress value={100} className="h-2" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {inProgressAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>En Progreso</span>
                </CardTitle>
                <CardDescription>¡Estás cerca de conseguir estos logros!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-lg bg-muted/30 border border-muted"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-full ${achievement.bgColor}`}>
                            <Icon className={`h-5 w-5 ${achievement.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>{Math.round(achievement.progress)}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {lockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Por Desbloquear</span>
                </CardTitle>
                <CardDescription>Logros que puedes conseguir en el futuro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-muted/10 border border-muted opacity-60"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 rounded-full bg-muted">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-muted-foreground">{achievement.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="mt-3">
                          <Progress value={0} className="h-2" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
