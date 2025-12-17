
import React from 'react';
import { View, User } from '../types';
import { LucideShoppingBag, LucidePlus, LucideSearch, LucideMapPin, LucideUser, LucideChevronDown, LucideLayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  user: User | null;
  onSellClick: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onChangeView, 
  user,
  onSellClick,
  onLoginClick,
  onProfileClick,
  onDashboardClick,
  searchQuery,
  onSearch
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group flex-shrink-0" 
            onClick={() => onChangeView(View.MARKETPLACE)}
          >
            <div className="bg-primary-600 text-white p-2 rounded-lg mr-2 group-hover:bg-primary-700 transition-colors">
              <LucideShoppingBag size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
              GloKart
            </span>
          </div>

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden md:flex flex-1 mx-8 max-w-lg">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LucideSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                placeholder="Search for watches, furniture, electronics..."
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Admin Dashboard Button */}
            {user?.isAdmin && (
              <button
                onClick={onDashboardClick}
                className="flex items-center px-2 sm:px-3 py-2 border border-primary-600 text-sm font-medium rounded-full text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none transition-colors"
                title="Dashboard"
              >
                <LucideLayoutDashboard size={18} className="sm:mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            )}

            {user ? (
               <button 
                 onClick={onProfileClick}
                 className="flex items-center text-slate-700 text-sm font-medium bg-slate-100 hover:bg-slate-200 p-2 sm:px-3 sm:py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
               >
                 <LucideUser size={20} className="text-primary-600 sm:mr-2 sm:w-4 sm:h-4" />
                 <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                 <LucideChevronDown size={14} className="ml-2 text-slate-400 hidden sm:block" />
               </button>
            ) : (
              <div className="hidden sm:flex items-center text-slate-600 text-sm font-medium">
                <LucideMapPin size={16} className="mr-1 text-primary-600" />
                <span>UAE</span>
              </div>
            )}

            {currentView !== View.SELL && currentView !== View.REGISTER && currentView !== View.LOGIN && !user?.isAdmin && (
              <button
                onClick={onSellClick}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105 whitespace-nowrap"
              >
                <LucidePlus size={18} className="mr-1" />
                <span className="hidden xs:inline">Sell Now</span>
                <span className="inline xs:hidden">Sell</span>
              </button>
            )}
            
            {(currentView === View.SELL || currentView === View.REGISTER || currentView === View.LOGIN) && (
               <button onClick={() => onChangeView(View.MARKETPLACE)} className="text-sm font-medium text-slate-500 hover:text-slate-800">
                  Cancel
               </button>
            )}
            
            {!user && currentView !== View.REGISTER && currentView !== View.LOGIN && (
                 <button onClick={onLoginClick} className="text-sm font-medium text-slate-600 hover:text-primary-600 ml-2">
                   Log In
                 </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
