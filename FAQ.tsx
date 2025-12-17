
import React from 'react';
import { LucideChevronDown, LucideChevronUp } from 'lucide-react';

interface FAQProps {
    onBack: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onBack }) => {
  const faqs = [
    {
        question: "How does GloKart work?",
        answer: "GloKart is a fully managed marketplace. We handle all logistics! We pick up the item from the seller, perform a Quality Check (QC), and deliver it to the buyer. No awkward meetups or private messages required."
    },
    {
        question: "What happens during the Quality Check (QC)?",
        answer: "Our team inspects the item at the time of pickup to ensure it matches the seller's description and photos. If the item passes QC, we accept it for delivery. This guarantees buyers get exactly what they ordered."
    },
    {
        question: "Are there any delivery charges?",
        answer: "Yes, a delivery fee applies to ensure safe handling and transport. For Furniture & Home Appliances, the delivery charge is AED 100. For all other categories (Electronics, Fashion, Toys, etc.), the charge is AED 30. This amount is added to the total at checkout."
    },
    {
        question: "When do sellers get paid?",
        answer: "Sellers receive a Credit Note upon successful pickup and QC. A service commission of 5% is deducted from the final selling price. Once the item is delivered to the buyer and payment is collected, we transfer the remaining balance to your bank account within 1 business day."
    },
    {
        question: "What payment methods are supported for buyers?",
        answer: "We offer both Cash on Delivery (COD) and Card on Delivery. You can pay securely when the item arrives at your doorstep."
    },
    {
        question: "Do I need to meet the buyer or seller?",
        answer: "No. GloKart respects your privacy and convenience. We act as the intermediary, picking up from the seller and delivering to the buyer directly."
    },
    {
        question: "Is it free to list items?",
        answer: "Yes! Listing items on GloKart is completely free. We AI-power your listing process to make it fast and easy."
    },
    {
        question: "Can I sell items outside of the UAE?",
        answer: "Currently, our logistics and marketplace services are exclusively available for residents within the United Arab Emirates."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-500">Find answers to common questions about using GloKart.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 mb-4">Still have questions?</p>
        <button onClick={onBack} className="text-primary-600 font-medium hover:underline">Back to Home</button>
      </div>
    </div>
  );
};

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
                <span className="font-semibold text-slate-900">{question}</span>
                {isOpen ? <LucideChevronUp className="text-slate-400" /> : <LucideChevronDown className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default FAQ;
