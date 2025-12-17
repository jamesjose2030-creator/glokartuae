
import React, { useState } from 'react';
import { User, Product } from '../types';
import { LucideX, LucideLogOut, LucideUser, LucideMapPin, LucidePhone, LucideMail, LucidePackage, LucidePencil, LucideTrash2, LucideHeart, LucideShoppingBag } from 'lucide-react';

interface UserProfileModalProps {
  user: User;
  allProducts: Product[];
  onClose: () => void;
  onLogout: () => void;
  onOfferAction?: (productId: string, offerId: string, action: 'accept' | 'reject') => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, allProducts, onClose, onLogout, onOfferAction, onEditProduct, onDeleteProduct }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'listings' | 'orders' | 'offers'>('profile');

  // Filter products
  const myListings = allProducts.filter(p => p.sellerName === user.name);
  const ordersPlaced = allProducts.filter(p => p.buyerEmail === user.email && p.isSold);
  const ordersReceived = allProducts.filter(p => p.sellerName === user.name && p.isSold);
  
  const myWishlist = allProducts.filter(p => user.savedProductIds?.includes(p.id));
  const myOffersReceived = myListings.filter(p => p.offers && p.offers.length > 0 && !p.isSold);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary-600 px-6 pt-6 pb-4 text-white text-center flex-shrink-0 relative">
            <div className="bg-white/20 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 backdrop-blur-md border-2 border-white/30">
                <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-primary-100 text-sm">{user.email}</p>
            {user.isAdmin && <span className="bg-white/20 text-xs px-2 py-0.5 rounded mt-1 inline-block">Admin</span>}
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"><LucideX size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0 overflow-x-auto scrollbar-hide">
            {['profile', 'wishlist', 'listings', 'offers', 'orders'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-3 px-3 text-sm font-medium whitespace-nowrap capitalize relative ${activeTab === tab ? 'bg-white text-primary-600 border-t-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50/30">
            {activeTab === 'profile' && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center"><div className="bg-slate-100 p-2 rounded mr-3"><LucideUser size={18}/></div><div><p className="text-xs text-slate-500 font-bold">FULL NAME</p><p>{user.name}</p></div></div>
                        <div className="flex items-center"><div className="bg-slate-100 p-2 rounded mr-3"><LucideMail size={18}/></div><div><p className="text-xs text-slate-500 font-bold">EMAIL</p><p>{user.email}</p></div></div>
                        <div className="flex items-center"><div className="bg-slate-100 p-2 rounded mr-3"><LucideMapPin size={18}/></div><div><p className="text-xs text-slate-500 font-bold">ADDRESS</p><p>{user.address}</p></div></div>
                        <div className="flex items-center"><div className="bg-slate-100 p-2 rounded mr-3"><LucidePhone size={18}/></div><div><p className="text-xs text-slate-500 font-bold">PHONE</p><p>{user.phoneNumber}</p></div></div>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100">
                            <LucideLogOut size={18} /><span>Log Out</span>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'wishlist' && (
                 <div className="space-y-3">
                    {myWishlist.length === 0 ? (
                        <div className="text-center py-8 text-slate-400"><LucideHeart className="mx-auto mb-2 opacity-50" size={32} /><p>Your wishlist is empty.</p></div>
                    ) : (
                        myWishlist.map(product => (
                             <div key={product.id} className="border border-slate-200 rounded-lg bg-white shadow-sm p-3 flex items-center">
                                <img src={product.imageUrl} className="w-12 h-12 rounded bg-slate-100 object-cover mr-3" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 truncate">{product.title}</h4>
                                    <div className="text-sm font-bold text-primary-600">{product.currency} {product.price.toLocaleString()}</div>
                                </div>
                             </div>
                        ))
                    )}
                 </div>
            )}

            {activeTab === 'listings' && (
                <div className="space-y-3">
                    {myListings.length === 0 ? (
                        <div className="text-center py-8 text-slate-400"><LucidePackage className="mx-auto mb-2 opacity-50" size={32} /><p>No listings.</p></div>
                    ) : (
                        myListings.map(product => (
                            <div key={product.id} className="border border-slate-200 rounded-lg bg-white shadow-sm p-3">
                                <div className="flex items-center mb-3">
                                    <img src={product.imageUrl} className="w-12 h-12 rounded bg-slate-100 object-cover mr-3" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-slate-900 truncate">{product.title}</h4>
                                        <div className="flex items-center text-xs mt-1">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mr-2 ${product.isSold ? 'bg-red-100 text-red-700' : product.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{product.isSold ? 'SOLD' : product.status}</span>
                                        </div>
                                    </div>
                                </div>
                                {product.status === 'rejected' && product.rejectionReason && <div className="mb-3 text-xs bg-red-50 p-2 rounded text-red-800">Reason: {product.rejectionReason}</div>}
                                <div className="flex space-x-2 pt-2 border-t border-slate-100">
                                    <button onClick={(e) => {e.stopPropagation(); if(onEditProduct) onEditProduct(product);}} disabled={product.isSold || product.status === 'offer_accepted'} className="flex-1 py-1.5 rounded text-xs font-medium border bg-white hover:bg-slate-50"><LucidePencil size={12} className="inline mr-1"/> Edit</button>
                                    <button onClick={(e) => {e.stopPropagation(); if(onDeleteProduct) onDeleteProduct(product.id);}} disabled={product.isSold || product.status === 'offer_accepted'} className="flex-1 py-1.5 rounded text-xs font-medium border bg-white text-red-600 hover:bg-red-50"><LucideTrash2 size={12} className="inline mr-1"/> Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'offers' && myOffersReceived.length > 0 && (
                <div className="space-y-4">
                    {myOffersReceived.map(product => (
                        <div key={product.id} className="border border-slate-200 rounded-lg bg-white shadow-sm p-3">
                            <div className="text-xs font-bold mb-2">{product.title}</div>
                            {product.offers?.map(offer => (
                                <div key={offer.id} className="bg-slate-50 p-2 rounded mb-2 text-sm">
                                    <div className="flex justify-between font-bold"><span>{offer.bidderName}</span><span>{product.currency} {offer.amount}</span></div>
                                    {offer.status === 'pending' && onOfferAction && (
                                        <div className="flex space-x-2 mt-2">
                                            <button onClick={() => onOfferAction(product.id, offer.id, 'accept')} className="flex-1 bg-green-100 text-green-700 text-xs py-1 rounded">Accept</button>
                                            <button onClick={() => onOfferAction(product.id, offer.id, 'reject')} className="flex-1 bg-red-100 text-red-700 text-xs py-1 rounded">Reject</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center"><LucideShoppingBag size={14} className="mr-1"/> Orders Placed (Bought)</h3>
                        {ordersPlaced.length === 0 ? (
                            <p className="text-sm text-slate-400 italic pl-2">You haven't purchased anything yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {ordersPlaced.map(product => (
                                    <div key={product.id} className="border border-slate-200 rounded-lg bg-white shadow-sm p-3 flex items-center">
                                        <img src={product.imageUrl} className="w-12 h-12 rounded bg-slate-100 object-cover mr-3" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900 truncate">{product.title}</h4>
                                            <div className="text-sm font-bold text-green-600">{product.currency} {product.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center"><LucidePackage size={14} className="mr-1"/> Orders Received (Sold)</h3>
                         {ordersReceived.length === 0 ? (
                            <p className="text-sm text-slate-400 italic pl-2">You haven't sold anything yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {ordersReceived.map(product => (
                                    <div key={product.id} className="border border-slate-200 rounded-lg bg-white shadow-sm p-3 flex items-center">
                                        <img src={product.imageUrl} className="w-12 h-12 rounded bg-slate-100 object-cover mr-3" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900 truncate">{product.title}</h4>
                                            <div className="text-sm font-bold text-green-600">{product.currency} {product.price.toLocaleString()}</div>
                                            <div className="text-xs text-slate-500 mt-1">Buyer: {product.buyerName}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
