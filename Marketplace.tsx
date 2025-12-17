import React, { useState } from 'react';
import { Product, Category, View } from '../types';
import ProductCard from '../components/ProductCard';
import { LucideFilter, LucideHelpCircle, LucideBookOpen, LucideMail, LucideTruck, LucideShieldCheck, LucideBanknote, LucideSearch } from 'lucide-react';

interface MarketplaceProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onViewChange: (view: View) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, onProductClick, onViewChange, searchQuery, onSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Object.values(Category)];

  const filteredProducts = products.filter(product => {
    // 1. Filter by Category
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // 2. Filter by Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
       product.title.toLowerCase().includes(query) ||
       product.description.toLowerCase().includes(query) ||
       product.tags.some(tag => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      
      {/* Mobile Search Bar - Visible only on small screens */}
      <div className="md:hidden mb-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LucideSearch className="h-4 w-4 text-slate-400" />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm text-sm"
                placeholder="Search for items..."
            />
        </div>
      </div>
      
      {/* Hero / Banner */}
      <div className="mb-6 md:mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl">
        <div className="absolute inset-0 opacity-20">
            {/* Abstract decorative pattern */}
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        <div className="relative px-6 py-8 md:px-8 md:py-16 text-center md:text-left">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight">
            Buy & Sell in <span className="text-primary-400">Seconds</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-xl max-w-2xl mb-6 md:mb-8 mx-auto md:mx-0">
            UAE's smartest marketplace. Use AI to list your items instantly and find great deals near you.
          </p>

          {/* Marketing Icons - Grid on mobile (side-by-side), Flex on desktop */}
          <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:justify-start md:gap-6">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start bg-white/10 backdrop-blur-md rounded-xl md:rounded-full p-2 md:px-5 md:py-2.5 text-white border border-white/10 shadow-lg">
                <div className="bg-primary-500/20 p-1.5 rounded-full mb-1 md:mb-0 md:mr-3">
                    <LucideTruck className="text-primary-400" size={16} md:size={18} />
                </div>
                <span className="font-semibold text-[10px] md:text-sm leading-tight text-center md:text-left">Pickup &<br className="md:hidden"/> Deliver</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start bg-white/10 backdrop-blur-md rounded-xl md:rounded-full p-2 md:px-5 md:py-2.5 text-white border border-white/10 shadow-lg">
                <div className="bg-primary-500/20 p-1.5 rounded-full mb-1 md:mb-0 md:mr-3">
                    <LucideShieldCheck className="text-primary-400" size={16} md:size={18} />
                </div>
                <span className="font-semibold text-[10px] md:text-sm leading-tight text-center md:text-left">Quality<br className="md:hidden"/> Checked</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start bg-white/10 backdrop-blur-md rounded-xl md:rounded-full p-2 md:px-5 md:py-2.5 text-white border border-white/10 shadow-lg">
                <div className="bg-primary-500/20 p-1.5 rounded-full mb-1 md:mb-0 md:mr-3">
                    <LucideBanknote className="text-primary-400" size={16} md:size={18} />
                </div>
                <span className="font-semibold text-[10px] md:text-sm leading-tight text-center md:text-left">Secure<br className="md:hidden"/> Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section - Grid 3 cols on mobile */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
        <button 
          onClick={() => onViewChange(View.HOW_IT_WORKS)}
          className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all flex flex-col md:flex-row items-center justify-center md:justify-start group"
        >
          <div className="bg-blue-50 text-blue-600 p-2 md:p-3 rounded-lg mb-1 md:mb-0 md:mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <LucideBookOpen size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-slate-900 text-xs md:text-base">How it Works</h3>
            <p className="hidden md:block text-xs text-slate-500">Learn about buying & selling</p>
          </div>
        </button>

        <button 
          onClick={() => onViewChange(View.CONTACT)}
          className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all flex flex-col md:flex-row items-center justify-center md:justify-start group"
        >
          <div className="bg-purple-50 text-purple-600 p-2 md:p-3 rounded-lg mb-1 md:mb-0 md:mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <LucideMail size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-slate-900 text-xs md:text-base">Contact Us</h3>
            <p className="hidden md:block text-xs text-slate-500">Get support & help</p>
          </div>
        </button>

        <button 
          onClick={() => onViewChange(View.FAQ)}
          className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all flex flex-col md:flex-row items-center justify-center md:justify-start group"
        >
          <div className="bg-orange-50 text-orange-600 p-2 md:p-3 rounded-lg mb-1 md:mb-0 md:mr-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <LucideHelpCircle size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-slate-900 text-xs md:text-base">FAQ</h3>
            <p className="hidden md:block text-xs text-slate-500">Frequently asked questions</p>
          </div>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <div className="flex-shrink-0 flex items-center px-3 py-2 bg-white border border-slate-200 rounded-full text-slate-500 mr-2 shadow-sm">
            <LucideFilter size={16} />
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
            <div className="text-6xl mb-4">🏜️</div>
            <h3 className="text-xl font-medium text-slate-900">No items found.</h3>
            <p className="text-slate-500">Try adjusting your search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={onProductClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;