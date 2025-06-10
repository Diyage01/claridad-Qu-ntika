import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import CourseCard from '@/components/CourseCard';

const MyCourses = ({ 
  enrolledCourses, 
  coursesData, 
  onContinueCourse, 
  onEnrollCourse 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const enrolledCoursesDetails = enrolledCourses.map(enrolled => {
    const courseData = coursesData.find(course => course.id === enrolled.courseId);
    return {
      ...courseData,
      progress: enrolled.progress,
      enrolledData: enrolled 
    };
  }).filter(Boolean); 

  const availableCourses = coursesData.filter(course => 
    !enrolledCourses.some(enrolled => enrolled.courseId === course.id)
  );

  const categories = ['all', ...new Set(coursesData.map(course => course.category).filter(Boolean))];

  const filterCourses = (coursesToFilter) => {
    return coursesToFilter.filter(course => {
      if (!course || !course.title || !course.description) return false; 
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const inProgressCourses = filterCourses(enrolledCoursesDetails.filter(course => 
    course.progress > 0 && course.progress < 100
  ));

  const completedCourses = filterCourses(enrolledCoursesDetails.filter(course => 
    course.progress === 100
  ));

  const notStartedCourses = filterCourses(enrolledCoursesDetails.filter(course => 
    course.progress === 0
  ));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold gradient-text">Mis Cursos</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar en mis cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded-md text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="in-progress">En Progreso ({inProgressCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({completedCourses.length})</TabsTrigger>
          <TabsTrigger value="not-started">Sin Empezar ({notStartedCourses.length})</TabsTrigger>
          <TabsTrigger value="available">Explorar Cursos ({filterCourses(availableCourses).length})</TabsTrigger>
        </TabsList>

        {[
          { value: "in-progress", courses: inProgressCourses, emptyMsg: "No tienes cursos en progreso." },
          { value: "completed", courses: completedCourses, emptyMsg: "Aún no has completado ningún curso." },
          { value: "not-started", courses: notStartedCourses, emptyMsg: "Todos tus cursos inscritos están iniciados o completados." }
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tab.courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    isEnrolled={true}
                    progress={course.progress}
                    onContinue={() => onContinueCourse(course.id)}
                  />
                </motion.div>
              ))}
            </div>
            {tab.courses.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>{tab.emptyMsg}</p>
              </div>
            )}
          </TabsContent>
        ))}
        
        <TabsContent value="available" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCourses(availableCourses).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/course/${course.id}`}>
                  <CourseCard
                    course={course}
                    isEnrolled={false}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
          {filterCourses(availableCourses).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No hay más cursos disponibles que coincidan con tu búsqueda o ya estás inscrito en todos.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyCourses;