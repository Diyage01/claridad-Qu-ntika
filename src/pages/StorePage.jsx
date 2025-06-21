import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ShoppingCart, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/productsData';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useLocalStorage('cart', []);
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();

  const categories = ['all', ...new Set(productsData.map(product => product.category))];

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
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

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="space-y-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text">Tienda de Productos</h1>
          <Button onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
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
              className="px-3 py-2 bg-background border border-input rounded-md text-secondary-foreground"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </motion.div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      )}

      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-xl z-50 flex flex-col"
          >
            <Card className="flex-1 flex flex-col border-0 rounded-none">
              <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                <CardTitle className="text-xl">Tu Carrito</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tu carrito está vacío.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <img  class="w-16 h-16 object-cover rounded" alt={item.name} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="icon" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="h-7 w-7">-</Button>
                        <span>{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="h-7 w-7">+</Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-400">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Proceder al Pago (${cartTotal.toFixed(2)})
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePage;