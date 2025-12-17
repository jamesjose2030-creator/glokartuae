
import React from 'react';
import { Product } from '../types';
import { LucideMapPin, LucideClock, LucideHandshake } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer group flex flex-col h-full ${product.isSold ? 'opacity-75 grayscale-[0.5]' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] md:text-xs font-semibold text-slate-700 shadow-sm">
          {product.condition}
        </div>
        
        {product.isSold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 md:px-4 py-1 font-bold text-base md:text-lg transform -rotate-12 border-2 border-white shadow-lg">
              SOLD
            </span>
          </div>
        )}

        {product.status === 'offer_accepted' && !product.isSold && (
          <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
            <span className="bg-purple-600 text-white px-2 md:px-4 py-1 font-bold text-xs md:text-sm transform -rotate-6 border-2 border-white shadow-lg flex items-center">
              <LucideHandshake size={14} className="mr-1" /> Offer Accepted
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm md:text-lg font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </div>
        
        <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mb-3 md:mb-4 flex-1">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="text-base md:text-xl font-bold text-primary-700 mb-2 md:mb-3">
            {product.currency} {product.price.toLocaleString()}
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-[10px] md:text-xs text-slate-400 border-t border-slate-50 pt-2 md:pt-3 space-y-1 md:space-y-0">
            <div className="flex items-center truncate">
              <LucideMapPin size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            <div className="flex items-center">
              <LucideClock size={12} className="mr-1 flex-shrink-0" />
              {product.postedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
