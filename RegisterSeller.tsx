
import React, { useState } from 'react';
import { User } from '../types';
import { LucideUser, LucideMapPin, LucidePhone, LucideCheckCircle, LucideMail } from 'lucide-react';

interface RegisterSellerProps {
  onRegister: (user: User) => void;
  onCancel: () => void;
  existingEmails: string[];
}

const RegisterSeller: React.FC<RegisterSellerProps> = ({ onRegister, onCancel, existingEmails }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !address.trim() || !phoneNumber.trim()) {
      setError("All fields are required to create an account.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (existingEmails.some(e => e.toLowerCase() === email.trim().toLowerCase())) {
      setError("This email address is already registered. Please log in.");
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: email.trim(),
      address,
      phoneNumber,
      isSeller: true
    };

    onRegister(newUser);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 text-center">
            <div className="mx-auto bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <LucideUser size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 text-sm mt-2">Join GloKart to buy and sell instantly.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LucideUser className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LucideMail className="h-5 w-5 text-slate-400" /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Address</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LucideMapPin className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" placeholder="Villa 12, Street 5, Jumeirah 1, Dubai" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LucidePhone className="h-5 w-5 text-slate-400" /></div>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" placeholder="+971 50 123 4567" />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
              Create Account <LucideCheckCircle size={18} className="ml-2" />
            </button>
            <button type="button" onClick={onCancel} className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 transition-all">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterSeller;
