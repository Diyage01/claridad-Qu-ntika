import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, Users, Play, CheckCircle } from 'lucide-react';

const CourseCard = ({ course, isEnrolled, progress, onEnroll, onContinue }) => {
  const isCompleted = progress === 100;
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full glass-effect hover:neon-glow transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img  
            className="w-full h-48 object-cover"
            alt={`Imagen del curso ${course.title}`}
           src="https://images.unsplash.com/photo-1635251595512-dc52146d5ae8" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {course.level}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary/90">
              {course.category}
            </Badge>
          </div>
          {isCompleted && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-green-500 rounded-full p-2">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 hover:gradient-text transition-all">
            {course.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.students}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Instructor:</span>
              <span className="text-sm font-medium">{course.instructor}</span>
            </div>
            
            {isEnrolled && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 mt-auto">
            <div className="text-2xl font-bold gradient-text">
              ${course.price}
            </div>
            {isEnrolled ? (
              <Button 
                onClick={() => onContinue && onContinue(course.id)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {isCompleted ? 'Revisar' : 'Continuar'}
              </Button>
            ) : (
              onEnroll && ( 
                <Button 
                  onClick={() => onEnroll(course.id)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Inscribirse
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseCard;