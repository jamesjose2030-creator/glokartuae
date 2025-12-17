
import React, { useState, useRef, useEffect } from 'react';
import { View, Category, Currency, Product, User } from '../types';
import { analyzeImageForListing } from '../services/geminiService';
import { LucideUpload, LucideSparkles, LucideLoader2, LucideCheckCircle, LucideAlertCircle, LucideX, LucidePencil } from 'lucide-react';

interface SellItemProps {
  onCancel: () => void;
  onSubmit: (product: Product) => void;
  user: User;
  initialData?: Product; // Prop for editing mode
}

const SellItem: React.FC<SellItemProps> = ({ onCancel, onSubmit, user, initialData }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Helper to try and get City/Emirate from full address
  const getCityFromAddress = (addr: string) => {
    const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];
    // Look for Emirate name in the address string (case insensitive)
    const found = emirates.find(e => addr.toLowerCase().includes(e.toLowerCase()));
    if (found) return `${found}, UAE`;
    return addr; // Fallback to full address if no emirate detected
  };

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.AED);
  const [category, setCategory] = useState<Category>(Category.OTHERS);
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState(user.address ? getCityFromAddress(user.address) : 'Dubai, UAE');
  const [tags, setTags] = useState<string[]>([]);

  // Extra Details
  const [brand, setBrand] = useState('');
  const [purchaseYear, setPurchaseYear] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [specifications, setSpecifications] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form if editing
  useEffect(() => {
    if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setPrice(initialData.price.toString());
        setCategory(initialData.category);
        setCondition(initialData.condition);
        setLocation(initialData.location);
        setTags(initialData.tags);
        
        // Handle images
        const imgs = [initialData.imageUrl, ...(initialData.additionalImages || [])];
        setPreviewUrls(imgs);

        // Handle details
        if (initialData.details) {
            setBrand(initialData.details.brand || '');
            setPurchaseYear(initialData.details.purchaseYear || '');
            setDimensions(initialData.details.dimensions || '');
            setSpecifications(initialData.details.specifications || '');
        }
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);

      if (validFiles.length !== newFiles.length) {
        setError("Some files were skipped because they exceed 5MB.");
      } else {
        setError(null);
      }

      // Convert to Base64
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAIAnalyze = async () => {
    if (previewUrls.length === 0) return;
    
    // Check if the image is a URL (existing image) or Base64 (new upload)
    const imgData = previewUrls[0];
    if (!imgData.startsWith('data:')) {
        setError("AI analysis works best on newly uploaded images.");
        return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Analyze the first image
      const base64Data = imgData.split(',')[1];
      const result = await analyzeImageForListing(base64Data);
      
      setTitle(result.title);
      setDescription(result.description);
      setPrice(result.suggestedPrice.toString());
      
      const matchedCategory = Object.values(Category).find(c => c === result.category) || Category.OTHERS;
      setCategory(matchedCategory);
      setCurrency(Currency.AED);
      setCondition(result.condition);
      setTags(result.tags);
      
    } catch (err) {
      setError("Failed to analyze image. Please fill in details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || previewUrls.length === 0) {
        setError("Please fill in the required fields and upload at least one image.");
        return;
    }

    const updatedProduct: Product = {
        id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9), // Keep ID if editing
        title,
        description,
        price: parseFloat(price),
        currency: Currency.AED,
        category,
        imageUrl: previewUrls[0], // Main image
        additionalImages: previewUrls.slice(1), // Remaining images
        location,
        sellerName: initialData ? initialData.sellerName : user.name, // Keep original seller if editing
        postedDate: initialData ? initialData.postedDate : 'Just now',
        condition: condition as any,
        tags,
        isSold: initialData ? initialData.isSold : false,
        status: initialData ? initialData.status : 'pending', // Preserve status or default pending
        rejectionReason: initialData ? initialData.rejectionReason : undefined,
        offers: initialData ? initialData.offers : [],
        reservedForEmail: initialData ? initialData.reservedForEmail : undefined,
        offerAcceptedAt: initialData ? initialData.offerAcceptedAt : undefined,
        details: {
          brand,
          purchaseYear,
          dimensions: (category === Category.FURNITURE || category === Category.HOME_APPLIANCES) ? dimensions : undefined,
          specifications: (category === Category.ELECTRONICS) ? specifications : undefined
        }
    };

    onSubmit(updatedProduct);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{initialData ? 'Edit Listing' : 'Sell an Item'}</h2>
                <p className="text-slate-500 text-sm mt-1">Listing as <span className="font-semibold text-primary-700">{user.name}</span></p>
            </div>
            {!initialData && (
                <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <LucideSparkles size={12} className="mr-1" />
                    AI Powered
                </div>
            )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Product Photos</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Upload Button */}
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-slate-50 transition-colors"
               >
                  <LucideUpload className="text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Add Photos</span>
               </div>

               {/* Previews */}
               {previewUrls.map((url, idx) => (
                 <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <LucideX size={14} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                        Main Image
                      </div>
                    )}
                 </div>
               ))}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                multiple
                className="hidden" 
            />

            {/* AI Action Button - Only show on new listings for simplicity */}
            {!initialData && previewUrls.length > 0 && !isAnalyzing && (
                <button
                    type="button"
                    onClick={handleAIAnalyze}
                    className="w-full py-3 bg-gradient-to-r from-primary-600 to-teal-500 hover:from-primary-700 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all transform hover:-translate-y-0.5"
                >
                    <LucideSparkles className="mr-2" />
                    Auto-Fill Details (Using Main Image)
                </button>
            )}

            {isAnalyzing && (
                <div className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-medium flex items-center justify-center animate-pulse">
                    <LucideLoader2 className="mr-2 animate-spin" />
                    Analyzing image features...
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                    <LucideAlertCircle size={16} className="mr-2" />
                    {error}
                </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g. Vintage Leather Sofa"
                    required
                />
            </div>

            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Describe the condition, age, and features..."
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    {Object.values(Category).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Price (AED) <span className="text-red-500">*</span></label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Condition</label>
                <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Location (City/Area)</label>
                <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. Dubai Marina, Dubai"
                />
            </div>

            {/* Additional Details based on Category */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Additional Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-500 uppercase">Brand / Manufacturer</label>
                        <input 
                            type="text" 
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                            placeholder="e.g. Ikea, Sony, Rolex"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-500 uppercase">Purchase Year</label>
                        <input 
                            type="number" 
                            value={purchaseYear}
                            onChange={(e) => setPurchaseYear(e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                            placeholder="e.g. 2022"
                        />
                    </div>

                    {(category === Category.FURNITURE || category === Category.HOME_APPLIANCES) && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 uppercase">Dimensions (L x W x H) in cm</label>
                            <input 
                                type="text" 
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                                placeholder="e.g. 200cm x 90cm x 75cm"
                            />
                        </div>
                    )}

                    {(category === Category.ELECTRONICS) && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 uppercase">Key Specifications</label>
                            <input 
                                type="text" 
                                value={specifications}
                                onChange={(e) => setSpecifications(e.target.value)}
                                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                                placeholder="e.g. 16GB RAM, 512GB SSD, Battery Cycle 50"
                            />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Tags Display */}
            <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Tags (AI Generated)</label>
                 <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                            #{tag}
                        </span>
                    )) : <span className="text-slate-400 text-sm italic">No tags generated yet.</span>}
                 </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-md transition-colors flex items-center"
            >
                {initialData ? (
                    <>
                         <LucidePencil size={18} className="mr-2" />
                         Update Listing
                    </>
                ) : (
                    <>
                        <LucideCheckCircle size={18} className="mr-2" />
                        Submit for Review
                    </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellItem;
