import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Camera, Edit3, Save, Mail, Briefcase, Sparkles } from 'lucide-react';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    reflection: currentUser?.reflection || '',
    avatar: currentUser?.avatar || '',
  });
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentUser(prevUser => ({
      ...prevUser,
      name: profileData.name,
      bio: profileData.bio,
      reflection: profileData.reflection,
      avatar: profileData.avatar, 
    }));
    toast({
      title: "¡Perfil Actualizado!",
      description: "Tu información de perfil ha sido guardada.",
    });
  };

  if (!currentUser) {
    return <div className="text-center py-12">Cargando perfil...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-3xl mx-auto"
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div whileHover={{ scale: 1.1 }} className="relative">
          <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
            <AvatarImage src={profileData.avatar} alt={profileData.name} />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
              {profileData.name?.charAt(0).toUpperCase() || <User />}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full bg-card hover:bg-muted"
            onClick={() => document.getElementById('avatarUpload').click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Input 
            id="avatarUpload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarChange} 
          />
        </motion.div>
        <h1 className="text-3xl font-bold gradient-text">{profileData.name}</h1>
        <p className="text-muted-foreground">{currentUser.role === 'teacher' ? 'Profesor' : 'Estudiante'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Edit3 className="h-5 w-5" /> <span>Información Personal</span></CardTitle>
            <CardDescription>Actualiza tu nombre y correo electrónico.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={profileData.email} disabled className="cursor-not-allowed opacity-70" />
              <p className="text-xs text-muted-foreground mt-1">El correo electrónico no se puede cambiar.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Briefcase className="h-5 w-5" /> <span>Biografía</span></CardTitle>
            <CardDescription>Comparte un poco sobre ti.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              id="bio" 
              name="bio" 
              value={profileData.bio} 
              onChange={handleInputChange} 
              placeholder="Escribe una breve descripción sobre ti..." 
              rows={4}
            />
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Sparkles className="h-5 w-5" /> <span>Reflexión Personal</span></CardTitle>
            <CardDescription>Tus pensamientos, metas o inspiraciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              id="reflection" 
              name="reflection" 
              value={profileData.reflection} 
              onChange={handleInputChange} 
              placeholder="¿Qué te motiva? ¿Cuáles son tus aspiraciones?" 
              rows={4}
            />
          </CardContent>
        </Card>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ProfilePage;