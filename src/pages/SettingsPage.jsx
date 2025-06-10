import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Sun, Moon, Bell, BellOff, Palette, TextCursorInput } from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16); 
  const [notificationsMuted, setNotificationsMuted] = useLocalStorage('notificationsMuted', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [darkMode, fontSize]);

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked);
    toast({
      title: `Modo ${checked ? 'Oscuro' : 'Claro'} Activado`,
      description: `La apariencia ha sido actualizada.`,
    });
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value[0]);
  };

  const handleNotificationsToggle = (checked) => {
    setNotificationsMuted(checked);
    toast({
      title: `Notificaciones ${checked ? 'Silenciadas' : 'Activadas'}`,
      description: `Tus preferencias de notificación han sido guardadas.`,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold gradient-text">Configuración</h1>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><Palette className="h-5 w-5" /> <span>Apariencia</span></CardTitle>
          <CardDescription>Personaliza cómo se ve la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode" className="flex items-center space-x-2">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>Modo Oscuro</span>
            </Label>
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontSize" className="flex items-center space-x-2">
              <TextCursorInput className="h-4 w-4" />
              <span>Tamaño de Fuente: {fontSize}px</span>
            </Label>
            <Slider
              id="fontSize"
              min={12}
              max={20}
              step={1}
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><Bell className="h-5 w-5" /> <span>Notificaciones</span></CardTitle>
          <CardDescription>Administra tus preferencias de notificación.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="notificationsMuted" className="flex items-center space-x-2">
              {notificationsMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              <span>Silenciar Notificaciones</span>
            </Label>
            <Switch
              id="notificationsMuted"
              checked={notificationsMuted}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>
        </CardContent>
      </Card>

       <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Otras Configuraciones</CardTitle>
          <CardDescription>Más opciones estarán disponibles pronto.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Estamos trabajando para añadir más personalizaciones.</p>
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default SettingsPage;