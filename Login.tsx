
import React, { useState } from 'react';
import { LucideUser, LucideMail, LucideLock, LucideShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string, password?: string) => void;
  onRegisterClick: () => void;
  initialAdminMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick, initialAdminMode = false }) => {
  // Directly use the prop to determine mode, no toggling allowed
  const isAdminMode = initialAdminMode;
  
  const [identifier, setIdentifier] = useState(''); // Email for User, Username for Admin
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(isAdminMode ? 'Please enter your username.' : 'Please enter your email address.');
      return;
    }
    if (isAdminMode && !password.trim()) {
      setError('Please enter your password.');
      return;
    }
    
    onLogin(identifier, password);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-50 p-6 text-center border-b border-slate-100">
             <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isAdminMode ? 'bg-slate-200 text-slate-700' : 'bg-primary-100 text-primary-600'}`}>
                {isAdminMode ? <LucideShieldCheck size={32} /> : <LucideUser size={32} />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
               {isAdminMode ? 'Admin Portal' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
               {isAdminMode ? 'Secure login for administrators.' : 'Enter your email to access your account.'}
            </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-6 flex items-center">
              <LucideLock size={14} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                {isAdminMode ? 'Username' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isAdminMode ? <LucideUser className="h-5 w-5 text-slate-400" /> : <LucideMail className="h-5 w-5 text-slate-400" />}
                </div>
                <input
                  type={isAdminMode ? "text" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={isAdminMode ? "admin" : "john@example.com"}
                />
              </div>
            </div>

            {/* Password Field - Only visible in Admin Mode */}
            {isAdminMode && (
                <div className="space-y-1 animate-in slide-in-from-top-2 fade-in duration-300">
                <label className="block text-sm font-medium text-slate-700">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LucideLock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    />
                </div>
                </div>
            )}

            <button
              type="submit"
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all ${isAdminMode ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'}`}
            >
              {isAdminMode ? 'Access Dashboard' : 'Log In'}
            </button>

            {!isAdminMode && (
                <div className="text-center pt-2">
                <span className="text-slate-500 text-sm">Don't have an account? </span>
                <button
                    type="button"
                    onClick={onRegisterClick}
                    className="text-primary-600 font-medium text-sm hover:underline"
                >
                    Create one here
                </button>
                </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
