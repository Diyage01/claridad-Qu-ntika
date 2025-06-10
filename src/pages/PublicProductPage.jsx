import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, ShoppingCart, Package, Tag } from 'lucide-react';

const PublicProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products] = useLocalStorage('products', []);
  const [cart, setCart] = useLocalStorage('cart', []);

  const product = products.find(p => p.id.toString() === productId);

  if (!product) {
    return <div className="text-center py-12">Producto no encontrado.</div>;
  }

  const handleAddToCart = () => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: "¡Producto añadido!",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-effect overflow-hidden">
          <img  class="w-full h-[400px] object-cover" alt={`Imagen del producto ${product.name}`} src="https://images.unsplash.com/photo-1646193186132-7976c1670e81" />
        </Card>

        <div className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-4xl font-bold gradient-text">{product.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.tags?.map(tag => <Badge key={tag} className="bg-primary/20 text-primary">{tag}</Badge>)}
              </div>
              <p className="text-2xl font-semibold pt-2">${product.price.toFixed(2)}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">{product.description}</p>
              <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
                <span className="text-xs">({product.stock > 0 ? `${product.stock} en stock` : 'Agotado'})</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="glass-effect">
             <CardHeader>
                <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5"/> Detalles Adicionales</CardTitle>
             </CardHeader>
             <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Categoría: {product.category}</li>
                    <li>Disponibilidad: {product.stock > 0 ? 'En Stock' : 'Agotado'}</li>
                    <li>Envío: Calculado en el checkout</li>
                </ul>
             </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProductPage;