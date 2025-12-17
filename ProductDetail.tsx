
import React, { useState, useEffect } from 'react';
import { Product, User, Category } from '../types';
import { 
  LucideArrowLeft, 
  LucideMapPin, 
  LucideShieldCheck, 
  LucideHeart, 
  LucideShare2,
  LucideShoppingBag,
  LucideTag,
  LucideCheckCircle,
  LucideX,
  LucideBanknote,
  LucideLock,
  LucideInfo,
  LucideTimer,
  LucideMessageCircle,
  LucideCopy,
  LucideTruck,
  LucideCreditCard
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  user: User | null;
  onBack: () => void;
  onBuy: (product: Product) => void;
  onMakeOffer: (product: Product, amount: number) => void;
  onRegister: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, user, onBack, onBuy, onMakeOffer, onRegister, isSaved, onToggleSave }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  
  const [offerPrice, setOfferPrice] = useState(product.price.toString());
  const [offerSent, setOfferSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Combine main image and additional images for gallery
  const allImages = [product.imageUrl, ...(product.additionalImages || [])];

  // Calculate Delivery Charge
  const deliveryCharge = (product.category === Category.FURNITURE || product.category === Category.HOME_APPLIANCES) 
    ? 100 
    : 30;
  
  const totalAmount = product.price + deliveryCharge;

  // 24 Hour Countdown Logic
  useEffect(() => {
    if (product.status === 'offer_accepted' && product.offerAcceptedAt) {
      const interval = setInterval(() => {
        const acceptedTime = new Date(product.offerAcceptedAt!).getTime();
        const expiryTime = acceptedTime + (24 * 60 * 60 * 1000);
        const now = new Date().getTime();
        const distance = expiryTime - now;

        if (distance < 0) {
          setTimeLeft('EXPIRED');
          clearInterval(interval);
        } else {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m left`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [product.status, product.offerAcceptedAt]);

  const handleActionClick = (action: 'BUY' | 'OFFER') => {
    if (!user) {
      onRegister();
      return;
    }
    
    if (action === 'BUY') {
      setShowBuyModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleConfirmBuy = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowBuyModal(false);
      onBuy(product);
    }, 1500);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call via App component
    setTimeout(() => {
      setIsProcessing(false);
      setShowOfferModal(false);
      setOfferSent(true);
      onMakeOffer(product, parseFloat(offerPrice));
    }, 1000);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Product link copied to clipboard!");
    setShowShareModal(false);
  };

  const handleWhatsAppShare = () => {
    const text = `Check out this ${product.title} on GloKart! Price: ${product.currency} ${product.price.toLocaleString()}`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareModal(false);
  };

  const isReservedForMe = user && product.status === 'offer_accepted' && product.reservedForEmail === user.email;
  const isReservedForOthers = product.status === 'offer_accepted' && (!user || product.reservedForEmail !== user.email);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <LucideArrowLeft size={20} className="mr-1" /> Back to Marketplace
      </button>

      {/* Reservation Banners */}
      {isReservedForMe && (
        <div className="mb-6 bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-center justify-between text-purple-900">
            <div className="flex items-center">
                <LucideTimer size={24} className="mr-3" />
                <div>
                    <h3 className="font-bold">Offer Accepted!</h3>
                    <p className="text-sm">This item is reserved for you. Please complete purchase within 24 hours.</p>
                </div>
            </div>
            <div className="text-2xl font-bold font-mono bg-white px-3 py-1 rounded-lg shadow-sm border border-purple-100">
                {timeLeft}
            </div>
        </div>
      )}

      {isReservedForOthers && (
        <div className="mb-6 bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center text-slate-600">
            <LucideLock size={20} className="mr-3" />
            <div>
                <h3 className="font-bold">Item Reserved</h3>
                <p className="text-sm">An offer has been accepted for this item. It is currently reserved for another buyer.</p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="space-y-4">
            <div className="aspect-[4/3] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
                <img 
                  src={activeImage} 
                  alt={product.title} 
                  className={`w-full h-full object-contain bg-white ${product.isSold ? 'grayscale' : ''}`} 
                />
                {product.isSold && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-8 py-2 font-bold text-3xl transform -rotate-12 border-4 border-white shadow-xl">
                      SOLD
                    </span>
                  </div>
                )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                        >
                            <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="flex justify-between">
                <button 
                    onClick={onToggleSave}
                    className={`flex-1 flex justify-center items-center py-3 bg-white border border-slate-200 rounded-xl font-medium mr-2 transition-all ${isSaved ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <LucideHeart size={20} className={`mr-2 ${isSaved ? 'fill-red-500' : ''}`} /> 
                    {isSaved ? 'Saved' : 'Save'}
                </button>
                <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 flex justify-center items-center py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 ml-2 transition-colors"
                >
                    <LucideShare2 size={20} className="mr-2 text-primary-600" /> Share
                </button>
            </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="flex justify-between items-start">
                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                    {product.category}
                </span>
                <span className="text-slate-400 text-sm">{product.postedDate}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{product.title}</h1>
            <div className="text-3xl font-bold text-primary-600">{product.currency} {product.price.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <LucideInfo size={18} className="mr-2 text-primary-600" />
                Item Details
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                <div>
                    <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Condition</span>
                    <span className="font-medium text-slate-900">{product.condition}</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Location</span>
                    <span className="font-medium text-slate-900 flex items-center">
                        <LucideMapPin size={14} className="mr-1" />
                        {product.location}
                    </span>
                </div>
                
                {/* Dynamic Details */}
                {product.details?.brand && (
                    <div>
                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Brand</span>
                        <span className="font-medium text-slate-900">{product.details.brand}</span>
                    </div>
                )}
                 {product.details?.purchaseYear && (
                    <div>
                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Year</span>
                        <span className="font-medium text-slate-900">{product.details.purchaseYear}</span>
                    </div>
                )}
                 {product.details?.dimensions && (
                    <div className="col-span-2">
                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Dimensions</span>
                        <span className="font-medium text-slate-900">{product.details.dimensions}</span>
                    </div>
                )}
                {product.details?.specifications && (
                    <div className="col-span-2">
                        <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">Specifications</span>
                        <span className="font-medium text-slate-900">{product.details.specifications}</span>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                </p>
            </div>
             <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">#{tag}</span>
                ))}
            </div>
          </div>

          {/* Seller / Action Box */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mt-auto">
            <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {product.sellerName.charAt(0)}
                </div>
                <div className="ml-4">
                    <div className="font-bold text-slate-900">{product.sellerName}</div>
                    <div className="flex items-center text-xs text-green-600 font-medium">
                        <LucideShieldCheck size={14} className="mr-1" />
                        Verified Seller
                    </div>
                </div>
            </div>
            
            {!product.isSold ? (
              <div className="space-y-3">
                <button 
                  onClick={() => handleActionClick('BUY')}
                  disabled={isReservedForOthers}
                  className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center ${
                      isReservedForOthers 
                        ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
                  }`}
                >
                    {!user && <LucideLock size={16} className="mr-2 opacity-80" />}
                    <LucideShoppingBag className="mr-2" />
                    {isReservedForMe ? 'Complete Purchase' : isReservedForOthers ? 'Reserved' : 'Buy Now'}
                </button>
                
                <button 
                  onClick={() => handleActionClick('OFFER')}
                  disabled={offerSent || isReservedForOthers || isReservedForMe}
                  className={`w-full border font-semibold py-3 rounded-xl transition-all flex items-center justify-center ${
                      offerSent || isReservedForOthers || isReservedForMe
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                    {offerSent ? (
                      <>
                        <LucideCheckCircle size={18} className="mr-2" />
                        Offer Sent
                      </>
                    ) : (
                      <>
                        {!user && <LucideLock size={16} className="mr-2 opacity-80" />}
                        <LucideTag size={18} className="mr-2" />
                        Make Offer
                      </>
                    )}
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <h3 className="text-red-800 font-bold text-lg mb-1">Sold Out</h3>
                <p className="text-red-600 text-sm">This item is no longer available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900">Share Item</h3>
               <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600">
                 <LucideX size={24} />
               </button>
             </div>
             
             <div className="space-y-3">
               <button 
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center bg-[#25D366] text-white py-3 rounded-xl font-bold hover:brightness-105 transition-all"
               >
                  <LucideMessageCircle className="mr-2" />
                  Share via WhatsApp
               </button>
               <button 
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-all"
               >
                  <LucideCopy className="mr-2" size={18} />
                  Copy Link
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Buy Now Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBuyModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-900">Checkout</h3>
               <button onClick={() => setShowBuyModal(false)} className="text-slate-400 hover:text-slate-600">
                 <LucideX size={24} />
               </button>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-xl flex items-center mb-6 border border-slate-100">
               <img src={product.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover mr-4" />
               <div>
                 <div className="font-semibold text-slate-900 line-clamp-1">{product.title}</div>
                 <div className="text-primary-700 font-bold">{product.currency} {product.price.toLocaleString()}</div>
               </div>
             </div>

             <div className="space-y-4 mb-8">
               <div className="text-sm font-medium text-slate-700 mb-2">Payment Method</div>
               
               <label className="flex items-center justify-between p-4 border border-primary-200 bg-primary-50 rounded-xl cursor-pointer ring-1 ring-primary-500">
                 <div className="flex items-center">
                    <div className="bg-primary-100 text-primary-600 p-2 rounded-lg mr-3">
                        <LucideCreditCard size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Cash or Card on Delivery</div>
                      <div className="text-xs text-slate-500">Pay when you receive the item</div>
                    </div>
                 </div>
                 <div className="h-5 w-5 rounded-full border-4 border-primary-600 bg-white"></div>
               </label>
             </div>

             {/* Order Summary */}
             <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span>Item Price</span>
                    <span>{product.currency} {product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span className="flex items-center"><LucideTruck size={14} className="mr-1"/> Delivery Charge</span>
                    <span>{product.currency} {deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
                    <span className="font-bold text-slate-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-700">{product.currency} {totalAmount.toLocaleString()}</span>
                </div>
             </div>

             <button 
               onClick={handleConfirmBuy}
               disabled={isProcessing}
               className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center"
             >
                {isProcessing ? (
                  <>Processing Order...</>
                ) : (
                  <>Confirm Order</>
                )}
             </button>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowOfferModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-900">Make an Offer</h3>
               <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-600">
                 <LucideX size={24} />
               </button>
             </div>
             
             <form onSubmit={handleSendOffer}>
               <div className="text-center mb-8">
                 <div className="text-sm text-slate-500 mb-1">Asking Price</div>
                 <div className="text-3xl font-bold text-slate-900">{product.currency} {product.price.toLocaleString()}</div>
               </div>

               <div className="mb-6">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Your Offer ({product.currency})</label>
                 <input 
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="block w-full text-center text-2xl font-bold p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                 />
                 <p className="text-center text-xs text-slate-500 mt-2">
                   The seller will be notified via email immediately.
                 </p>
               </div>

               <button 
                 type="submit"
                 disabled={isProcessing}
                 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center"
               >
                  {isProcessing ? 'Sending...' : 'Send Offer'}
               </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
