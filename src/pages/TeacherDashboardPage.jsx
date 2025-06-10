import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { coursesData as initialCoursesData } from '@/data/coursesData';
import { productsData as initialProductsData } from '@/data/productsData';
import { PlusCircle, Edit, Trash2, Bell, Tag, Users, DollarSign, Package, BookOpen, Link as LinkIcon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
const Modal = React.memo(({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-card p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="px-0 pt-0"><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">{children}</CardContent>
        <CardFooter className="px-0 pt-6 pb-0 flex justify-end">
          <Button onClick={onClose} variant="outline" className="mr-2">Cancelar</Button>
          <Button onClick={onSave}>Guardar</Button>
        </CardFooter>
      </motion.div>
    </motion.div>
  );
});

const TeacherDashboardPage = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useLocalStorage('courses', initialCoursesData);
  const [products, setProducts] = useLocalStorage('products', initialProductsData);
  const [notifications, setNotifications] = useLocalStorage('teacherNotifications', []);

  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '', description: '', instructor: '', price: '', duration: '', level: '', category: '', tags: '', modules: [{ id: Date.now(), title: '', duration: '', content: '' }], image: '', hoursBetweenModules: ' ',
  });
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', tags: '', image: ''
  });
  const [notificationForm, setNotificationForm] = useState({
    title: '', message: '', target: 'all_students', courseId: ''
  });

  const handleCourseInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCourseForm(prevState => ({ ...prevState, [name]: name === 'hoursBetweenModules' || name === 'price' ? parseFloat(value) || 0 : value }));
  },[]);

  const handleModuleChange = useCallback((index, e) => {
    const { name, value } = e.target;
    const updatedModules = courseForm.modules.map((mod, i) => i === index ? { ...mod, [name]: value } : mod);
    setCourseForm(prev => ({ ...prev, modules: updatedModules }));
  },[courseForm.modules]);

  const addModuleField = () => {
    setCourseForm(prev => ({ ...prev, modules: [...prev.modules, { id: Date.now(), title: '', duration: '', content: '' }] }));
  };

  const removeModuleField = (index) => {
    setCourseForm(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value }));
  };
  
  const handleNotificationInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationForm(prev => ({ ...prev, [name]: value }));
  };

  const openCourseModal = (course = null) => {
    setCurrentCourse(course);
    if (course) {
      setCourseForm({ 
        ...course, 
        tags: course.tags?.join(', ') || '', 
        modules: course.modules && course.modules.length > 0 ? course.modules : [{ id: Date.now(), title: '', duration: '', content: '' }],
        hoursBetweenModules: course.hoursBetweenModules || 0,
       });
    } else {
      setCourseForm({ title: '', description: '', instructor: '', price: '', duration: '', level: '', category: '', tags: '', modules: [{ id: Date.now(), title: '', duration: '', content: '' }], image: 'Abstract background for new course', hoursBetweenModules: 0 });
    }
    setIsCourseModalOpen(true);
  };

  const openProductModal = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      setProductForm({ ...product, tags: product.tags?.join(', ') || '' });
    } else {
      setProductForm({ name: '', description: '', price: '', category: '', stock: '', tags: '', image: 'Abstract background for new product' });
    }
    setIsProductModalOpen(true);
  };
  
  const openNotificationModal = () => {
    setNotificationForm({ title: '', message: '', target: 'all_students', courseId: '' });
    setIsNotificationModalOpen(true);
  };

  const saveCourse = () => {
    const courseData = {
      ...courseForm,
      price: parseFloat(courseForm.price) || 0,
      tags: courseForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      id: currentCourse ? currentCourse.id : Date.now(),
      rating: currentCourse ? currentCourse.rating : (Math.random() * (5 - 4) + 4).toFixed(1),
      students: currentCourse ? currentCourse.students : Math.floor(Math.random() * 100),
      image: courseForm.image || (currentCourse ? currentCourse.image : 'Abstract background for new course')
    };

    if (currentCourse) {
      setCourses(courses.map(c => c.id === currentCourse.id ? courseData : c));
      toast({ title: "Curso Actualizado", description: `"${courseData.title}" ha sido actualizado.` });
    } else {
      setCourses([...courses, courseData]);
      toast({ title: "Curso Creado", description: `"${courseData.title}" ha sido creado.` });
    }
    setIsCourseModalOpen(false);
  };

  const saveProduct = () => {
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price) || 0,
      stock: parseInt(productForm.stock) || 0,
      tags: productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      id: currentProduct ? currentProduct.id : `prod_${Date.now()}`,
      rating: currentProduct ? currentProduct.rating : (Math.random() * (5 - 4) + 4).toFixed(1),
      image: productForm.image || (currentProduct ? currentProduct.image : 'Abstract background for new product')
    };

    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? productData : p));
      toast({ title: "Producto Actualizado", description: `"${productData.name}" ha sido actualizado.` });
    } else {
      setProducts([...products, productData]);
      toast({ title: "Producto Creado", description: `"${productData.name}" ha sido creado.` });
    }
    setIsProductModalOpen(false);
  };
  
  const sendNotification = () => {
    const newNotification = {
      ...notificationForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    toast({ title: "Notificación Enviada", description: `La notificación "${newNotification.title}" ha sido programada.` });
    setIsNotificationModalOpen(false);
  };

  const deleteCourse = (courseId) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast({ title: "Curso Eliminado", description: "El curso ha sido eliminado." });
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado." });
  };

  

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Panel de Profesor</h1>
        <p className="text-muted-foreground">Gestiona cursos, productos y notificaciones.</p>
      </motion.div>

      <Tabs defaultValue="courses">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses"><BookOpen className="mr-2 h-4 w-4" />Cursos</TabsTrigger>
          <TabsTrigger value="products"><Package className="mr-2 h-4 w-4" />Productos</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCourseModal()}><PlusCircle className="mr-2 h-4 w-4" />Crear Curso</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="glass-effect flex flex-col">
                <img  class="w-full h-40 object-cover rounded-t-lg" alt={`Miniatura de ${course.title}`} src="https://images.unsplash.com/photo-1677696795233-5ef097695f12" />
                <CardHeader>
                  <CardTitle className="truncate text-lg">{course.title}</CardTitle>
                  <CardDescription>${course.price} - {course.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </CardContent>
                <CardFooter className="mt-auto pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => openCourseModal(course)} className="mr-2"><Edit className="mr-1 h-3 w-3" />Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id)} className="mr-2"><Trash2 className="mr-1 h-3 w-3" />Eliminar</Button>
                  <Link to={`/course/${course.id}`} target="_blank">
                    <Button variant="ghost" size="icon" title="Ver página pública"><LinkIcon className="h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openProductModal()}><PlusCircle className="mr-2 h-4 w-4" />Crear Producto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="glass-effect flex flex-col">
                <img  class="w-full h-40 object-cover rounded-t-lg" alt={`Miniatura de ${product.name}`} src="https://images.unsplash.com/photo-1646193186132-7976c1670e81" />
                <CardHeader>
                  <CardTitle className="truncate text-lg">{product.name}</CardTitle>
                  <CardDescription>${product.price} - {product.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="mt-auto pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => openProductModal(product)} className="mr-2"><Edit className="mr-1 h-3 w-3" />Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)} className="mr-2"><Trash2 className="mr-1 h-3 w-3" />Eliminar</Button>
                   <Link to={`/product/${product.id}`} target="_blank">
                    <Button variant="ghost" size="icon" title="Ver página pública"><LinkIcon className="h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNotificationModal}><PlusCircle className="mr-2 h-4 w-4" />Crear Notificación</Button>
          </div>
          <Card className="glass-effect">
            <CardHeader><CardTitle>Historial de Notificaciones</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 && <p className="text-muted-foreground">No hay notificaciones enviadas.</p>}
              {notifications.map(notif => (
                <div key={notif.id} className="p-3 bg-muted/50 rounded-md">
                  <h4 className="font-semibold">{notif.title}</h4>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dirigido a: {notif.target === 'all_students' ? 'Todos los estudiantes' : `Estudiantes de ${courses.find(c=>c.id.toString() === notif.courseId)?.title || 'curso desconocido'}`} - {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)} 
        title={currentCourse ? "Editar Curso" : "Crear Curso"} 
        onSave={saveCourse}
      >
        <div className="space-y-4">
          <div><Label htmlFor="title">Título</Label><Input id="title" name="title" value={courseForm.title} onChange={handleCourseInputChange} /></div>
          <div><Label htmlFor="description">Descripción</Label><Textarea id="description" name="description" value={courseForm.description} onChange={handleCourseInputChange} /></div>
          <div><Label htmlFor="instructor">Instructor</Label><Input id="instructor" name="instructor" value={courseForm.instructor} onChange={handleCourseInputChange} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="price">Precio</Label><Input id="price" name="price" type="number" value={courseForm.price} onChange={handleCourseInputChange} /></div>
            <div><Label htmlFor="duration">Duración (ej: 10 semanas)</Label><Input id="duration" name="duration" value={courseForm.duration} onChange={handleCourseInputChange} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="level">Nivel</Label><Input id="level" name="level" value={courseForm.level} onChange={handleCourseInputChange} /></div>
            <div><Label htmlFor="category">Categoría</Label><Input id="category" name="category" value={courseForm.category} onChange={handleCourseInputChange} /></div>
          </div>
          <div><Label htmlFor="image">URL de Imagen Miniatura</Label><Input id="image" name="image" value={courseForm.image} onChange={handleCourseInputChange} placeholder="https://example.com/image.jpg"/></div>
          <div><Label htmlFor="tags">Etiquetas (separadas por coma)</Label><Input id="tags" name="tags" value={courseForm.tags} onChange={handleCourseInputChange} /></div>
          <div><Label htmlFor="hoursBetweenModules" className="flex items-center"><Clock className="mr-2 h-4 w-4"/> Horas de espera entre módulos (0 para ninguno)</Label><Input id="hoursBetweenModules" name="hoursBetweenModules" type="number" value={courseForm.hoursBetweenModules} onChange={handleCourseInputChange} /></div>

          <div>
            <Label className="mb-2 block">Módulos</Label>
            {courseForm.modules.map((module, index) => (
              <Card key={module.id || index} className="mb-3 p-3 bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <Label>Módulo {index + 1}</Label>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeModuleField(index)} disabled={courseForm.modules.length <= 1}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input name="title" placeholder="Título del módulo" value={module.title} onChange={(e) => handleModuleChange(index, e)} className="mb-2" />
                <Input name="duration" placeholder="Duración (ej: 2 horas)" value={module.duration} onChange={(e) => handleModuleChange(index, e)} className="mb-2"/>
                <Textarea name="content" placeholder="Contenido del módulo (texto simple por ahora)..." value={module.content} onChange={(e) => handleModuleChange(index, e)} />
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addModuleField}>Añadir Módulo</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={currentProduct ? "Editar Producto" : "Crear Producto"} onSave={saveProduct}>
        <div className="space-y-4">
          <div><Label htmlFor="name">Nombre</Label><Input id="name" name="name" value={productForm.name} onChange={handleProductInputChange} /></div>
          <div><Label htmlFor="description">Descripción</Label><Textarea id="description" name="description" value={productForm.description} onChange={handleProductInputChange} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="price">Precio</Label><Input id="price" name="price" type="number" value={productForm.price} onChange={handleProductInputChange} /></div>
            <div><Label htmlFor="category">Categoría</Label><Input id="category" name="category" value={productForm.category} onChange={handleProductInputChange} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="stock">Stock</Label><Input id="stock" name="stock" type="number" value={productForm.stock} onChange={handleProductInputChange} /></div>
            <div><Label htmlFor="tags">Etiquetas (separadas por coma)</Label><Input id="tags" name="tags" value={productForm.tags} onChange={handleProductInputChange} /></div>
          </div>
          <div><Label htmlFor="productImage">URL de Imagen</Label><Input id="productImage" name="image" value={productForm.image} onChange={handleProductInputChange} placeholder="https://example.com/product.jpg" /></div>
        </div>
      </Modal>
      
      <Modal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} title="Crear Notificación" onSave={sendNotification}>
        <div className="space-y-4">
          <div><Label htmlFor="title">Título</Label><Input id="title" name="title" value={notificationForm.title} onChange={handleNotificationInputChange} /></div>
          <div><Label htmlFor="message">Mensaje</Label><Textarea id="message" name="message" value={notificationForm.message} onChange={handleNotificationInputChange} /></div>
          <div>
            <Label htmlFor="target">Dirigido a</Label>
            <Select name="target" value={notificationForm.target} onValueChange={(value) => setNotificationForm(prev => ({ ...prev, target: value, courseId: value === 'specific_course' ? prev.courseId : '' }))}>
              <SelectTrigger><SelectValue placeholder="Seleccionar audiencia" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all_students">Todos los estudiantes</SelectItem>
                <SelectItem value="specific_course">Estudiantes de un curso específico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {notificationForm.target === 'specific_course' && (
            <div>
              <Label htmlFor="courseId">Curso Específico</Label>
              <Select name="courseId" value={notificationForm.courseId} onValueChange={(value) => setNotificationForm(prev => ({ ...prev, courseId: value }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TeacherDashboardPage;