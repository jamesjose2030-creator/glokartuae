
import React from 'react';
import { LucideMail, LucidePhone, LucideMapPin, LucideSend } from 'lucide-react';

interface ContactUsProps {
    onCancel: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you shortly.");
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h1>
        <p className="text-slate-500">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start">
                <div className="bg-primary-50 p-3 rounded-lg text-primary-600 mr-4">
                    <LucideMail size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Email Us</h3>
                    <p className="text-slate-500 text-sm mb-1">Our friendly team is here to help.</p>
                    <a href="mailto:info@squareonegcc.com" className="text-primary-600 font-medium hover:underline">info@squareonegcc.com</a>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start">
                <div className="bg-primary-50 p-3 rounded-lg text-primary-600 mr-4">
                    <LucideMapPin size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Visit Us</h3>
                    <p className="text-slate-500 text-sm mb-1">Come say hello at our office HQ.</p>
                    <p className="text-slate-800 font-medium">Meydan Grandstand, 6th floor, Meydan Road, Nad Al Sheba, Dubai, U.A.E.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start">
                <div className="bg-primary-50 p-3 rounded-lg text-primary-600 mr-4">
                    <LucidePhone size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Call Us</h3>
                    <p className="text-slate-500 text-sm mb-1">Mon-Fri from 9am to 6pm.</p>
                    <a href="tel:+971504548513" className="text-primary-600 font-medium hover:underline">+971 50 454 8513</a>
                </div>
            </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="Your Name" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="you@example.com" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center">
                    <LucideSend size={18} className="mr-2" />
                    Send Message
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
