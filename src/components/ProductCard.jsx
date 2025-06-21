import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full glass-effect hover:neon-glow transition-all duration-300 overflow-hidden flex flex-col">
        <div className="relative">
          <img 
            class="w-full h-56 object-cover"
            alt={`Imagen del producto ${product.name}`}
           src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {product.category}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 hover:gradient-text transition-all">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm">
            {product.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col justify-between mt-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
            <span className="text-xs">({product.stock} en stock)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold gradient-text">
              ${product.price.toFixed(2)}
            </div>
            <Button 
              onClick={() => onAddToCart(product)}
              className="bg-gradient-to-r from-purple-500 to-cian-500 hover:from-blue-600 hover:to-pink-600"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;