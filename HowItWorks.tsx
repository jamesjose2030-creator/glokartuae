
import React from 'react';
import { LucideShoppingBag, LucideCamera, LucideCheckCircle, LucideTruck, LucideClipboardCheck, LucideBanknote, LucideCreditCard, LucidePackageCheck } from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  const sellerSteps = [
    {
      icon: <LucideCamera size={32} />,
      title: "1. List in Seconds",
      desc: "Snap photos of your item. Our AI auto-fills the details. Once approved by our admin, your listing goes live."
    },
    {
      icon: <LucideTruck size={32} />,
      title: "2. We Pick Up & QC",
      desc: "When sold, we pick up the item and perform a Quality Check (QC). You receive an immediate Credit Note upon successful pickup."
    },
    {
      icon: <LucideBanknote size={32} />,
      title: "3. Get Paid via Bank",
      desc: "Once delivered and paid for by the buyer, we transfer the funds to your bank account within 1 business day."
    }
  ];

  const buyerSteps = [
    {
      icon: <LucideShoppingBag size={32} />,
      title: "1. Buy or Make Offer",
      desc: "Browse unique items. Buy directly at the listed price or negotiate a better deal by sending an offer."
    },
    {
      icon: <LucidePackageCheck size={32} />,
      title: "2. We Deliver to You",
      desc: "No awkward meetups. We handle the logistics and deliver the verified item directly to your doorstep."
    },
    {
      icon: <LucideCreditCard size={32} />,
      title: "3. Pay on Delivery",
      desc: "Pay securely upon arrival. We accept both Cash and Card on Delivery for your convenience."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">How GloKart Works</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            We take the hassle out of buying and selling used goods. <br />
            <span className="text-primary-600 font-semibold">We handle the logistics, QC, and payments</span> so you don't have to.
        </p>
      </div>

      <div className="space-y-20">
        {/* For Sellers */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center mb-12">
            <span className="bg-white px-6 text-2xl font-bold text-slate-900 flex items-center">
                <span className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm mr-4 uppercase tracking-wider">For Sellers</span>
                Hassle-Free Selling
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellerSteps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                {idx < 2 && (
                   <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-slate-300 z-10">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start max-w-2xl mx-auto">
             <LucideClipboardCheck className="text-blue-600 mt-1 mr-3 flex-shrink-0" size={20} />
             <div>
                <h4 className="font-bold text-blue-900 text-sm">Quality Control Guarantee</h4>
                <p className="text-blue-700 text-xs mt-1">
                    We inspect every item upon pickup. If the item matches your description, we issue a Credit Note instantly. 
                    This guarantees your payment once the delivery is complete.
                </p>
             </div>
          </div>
        </div>

        {/* For Buyers */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center mb-12">
            <span className="bg-white px-6 text-2xl font-bold text-slate-900 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm mr-4 uppercase tracking-wider">For Buyers</span>
                Safe & Easy Buying
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerSteps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                 {idx < 2 && (
                   <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-slate-300 z-10">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={onBack}
          className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 transform hover:-translate-y-0.5"
        >
          Start Exploring GloKart
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
