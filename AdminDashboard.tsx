
import React, { useState } from 'react';
import { Product, User } from '../types';
import { LucideCheckCircle, LucideAlertCircle, LucideShieldCheck, LucideX } from 'lucide-react';

interface AdminDashboardProps {
  allProducts: Product[];
  pendingProducts: Product[];
  soldProducts: Product[];
  productsWithOffers: Product[];
  users: User[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  allProducts, 
  pendingProducts, 
  soldProducts, 
  productsWithOffers, 
  users, 
  onApprove, 
  onReject,
  onEditProduct,
  onDeleteProduct
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'sold' | 'offers' | 'users' | 'products'>('pending');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Rejection State
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (id: string) => {
    onApprove(id);
    setSelectedProduct(null);
    setShowRejectInput(false);
  };

  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  const confirmReject = (id: string) => {
    if (!rejectionReason.trim()) {
        alert("Please provide a reason for rejection.");
        return;
    }
    onReject(id, rejectionReason);
    setSelectedProduct(null);
    setShowRejectInput(false);
    setRejectionReason('');
  };

  const cancelReject = () => {
    setShowRejectInput(false);
    setRejectionReason('');
  };

  const handleDeleteFromModal = (productId: string) => {
    onDeleteProduct(productId);
    setSelectedProduct(null); 
  };

  const getUserActivity = (user: User) => {
    const listings = allProducts.filter(p => p.sellerName === user.name);
    const purchases = allProducts.filter(p => p.buyerEmail === user.email);
    return { listings, purchases };
  };

  const getStatusBadgeClass = (product: Product) => {
      if (product.isSold) return 'bg-red-100 text-red-800';
      switch (product.status) {
          case 'approved': return 'bg-green-100 text-green-800';
          case 'rejected': return 'bg-red-50 text-red-400';
          case 'offer_accepted': return 'bg-purple-100 text-purple-800';
          case 'pending': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-slate-100 text-slate-800';
      }
  };

  const getStatusLabel = (product: Product) => {
      if (product.isSold) return 'Sold';
      if (product.status === 'offer_accepted') return 'Offer Accepted';
      return product.status.charAt(0).toUpperCase() + product.status.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <LucideShieldCheck className="mr-3 text-primary-600" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-2">Manage listings, view offers, users, and transaction history.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-slate-200 overflow-x-auto">
        <button onClick={() => setActiveTab('pending')} className={`pb-3 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'pending' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}>
          Pending <span className="ml-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{pendingProducts.length}</span>
        </button>
        <button onClick={() => setActiveTab('products')} className={`pb-3 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'products' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}>
          Listings
        </button>
        <button onClick={() => setActiveTab('offers')} className={`pb-3 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'offers' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}>
          Offers <span className="ml-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{productsWithOffers.reduce((acc, p) => acc + (p.offers?.length || 0), 0)}</span>
        </button>
        <button onClick={() => setActiveTab('sold')} className={`pb-3 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'sold' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}>
          Sold
        </button>
        <button onClick={() => setActiveTab('users')} className={`pb-3 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'users' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}>
          Users
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'pending' && (
          <>
            {pendingProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="mx-auto bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <LucideCheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
                <p className="text-slate-500">There are no pending listings to review at the moment.</p>
              </div>
            ) : (
              pendingProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-64 h-64 md:h-auto bg-slate-100 flex-shrink-0 relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover"/>
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center">
                      <LucideAlertCircle size={12} className="mr-1" /> PENDING REVIEW
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full mb-2 inline-block">{product.category}</span>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{product.title}</h3>
                          <p className="text-sm text-slate-400 mb-4">Posted by {product.sellerName}</p>
                        </div>
                        <div className="text-xl font-bold text-slate-900">{product.currency} {product.price.toLocaleString()}</div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-2">{product.description}</p>
                      <button onClick={() => setSelectedProduct(product)} className="text-primary-600 text-xs font-medium hover:underline">View Full Details</button>
                    </div>
                    <div className="flex space-x-3 pt-4 border-t border-slate-100 mt-4">
                      <button onClick={() => handleApprove(product.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">Approve</button>
                      <button onClick={() => setSelectedProduct(product)} className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium">Reject</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Seller</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 flex items-center">
                                        <img src={product.imageUrl} className="w-10 h-10 rounded mr-3 object-cover" />
                                        <div className="max-w-xs truncate font-medium text-slate-900">{product.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{product.sellerName}</td>
                                    <td className="px-6 py-4 font-medium">{product.currency} {product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusBadgeClass(product)}`}>
                                            {getStatusLabel(product)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => onEditProduct(product)} className="text-primary-600 hover:text-primary-800 font-medium text-xs border border-primary-200 rounded px-2 py-1">Edit</button>
                                        <button onClick={() => onDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 font-medium text-xs border border-red-200 rounded px-2 py-1">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'sold' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Sold Items History</h3></div>
                <div className="divide-y divide-slate-100">
                    {soldProducts.length === 0 ? <div className="p-6 text-center text-slate-400">No sold items yet.</div> : soldProducts.map(product => (
                        <div key={product.id} className="p-4 hover:bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center">
                                <img src={product.imageUrl} className="w-12 h-12 rounded object-cover mr-4" />
                                <div>
                                    <div className="font-bold text-slate-900">{product.title}</div>
                                    <div className="text-xs text-slate-500">Sold to: {product.buyerName} ({product.buyerEmail})</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-600">{product.currency} {product.price.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">QC Pending</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'offers' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Active Offers</h3></div>
                <div className="divide-y divide-slate-100">
                    {productsWithOffers.length === 0 ? <div className="p-6 text-center text-slate-400">No active offers.</div> : productsWithOffers.map(product => (
                        <div key={product.id} className="p-4 hover:bg-slate-50">
                            <div className="flex items-center mb-3">
                                <img src={product.imageUrl} className="w-8 h-8 rounded mr-2" />
                                <span className="font-medium text-slate-900 text-sm">{product.title}</span>
                                <span className="ml-auto text-xs text-slate-500">Asking: {product.currency} {product.price}</span>
                            </div>
                            <div className="bg-slate-50 rounded p-2 space-y-2">
                                {product.offers?.map(offer => (
                                    <div key={offer.id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <span className="font-bold text-slate-700">{offer.bidderName}</span>
                                            <span className="text-slate-400 text-xs ml-2">({offer.bidderEmail})</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-bold text-primary-600 mr-3">{product.currency} {offer.amount}</span>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${offer.status === 'accepted' ? 'bg-green-100 text-green-700' : offer.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{offer.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'users' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Registered Users</h3></div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Admin</span>
                                        ) : (
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{user.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        )}
      </div>

      {/* Product Review Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div><h3 className="text-lg font-bold text-slate-900">Review Listing</h3></div>
                    <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600"><LucideX size={24} /></button>
                </div>
                <div className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <img src={selectedProduct.imageUrl} className="w-full rounded-xl mb-4" />
                           <div className="grid grid-cols-4 gap-2">
                              {selectedProduct.additionalImages.map((img, idx) => (
                                <img key={idx} src={img} className="w-full h-16 object-cover rounded-lg border border-slate-200"/>
                              ))}
                           </div>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full mb-3 inline-block">{selectedProduct.category}</span>
                            <h2 className="text-2xl font-bold mb-2">{selectedProduct.title}</h2>
                            <p className="text-slate-600 mb-6">{selectedProduct.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                                <div><span className="block text-slate-400 text-xs font-bold uppercase">Price</span><span className="font-bold text-slate-900">{selectedProduct.currency} {selectedProduct.price}</span></div>
                                <div><span className="block text-slate-400 text-xs font-bold uppercase">Condition</span><span className="font-medium text-slate-900">{selectedProduct.condition}</span></div>
                                <div><span className="block text-slate-400 text-xs font-bold uppercase">Location</span><span className="font-medium text-slate-900">{selectedProduct.location}</span></div>
                                <div><span className="block text-slate-400 text-xs font-bold uppercase">Seller</span><span className="font-medium text-slate-900">{selectedProduct.sellerName}</span></div>
                                
                                {selectedProduct.details?.brand && (
                                   <div><span className="block text-slate-400 text-xs font-bold uppercase">Brand</span><span className="font-medium text-slate-900">{selectedProduct.details.brand}</span></div>
                                )}
                                {selectedProduct.details?.purchaseYear && (
                                   <div><span className="block text-slate-400 text-xs font-bold uppercase">Year</span><span className="font-medium text-slate-900">{selectedProduct.details.purchaseYear}</span></div>
                                )}
                                {selectedProduct.details?.dimensions && (
                                   <div className="col-span-2"><span className="block text-slate-400 text-xs font-bold uppercase">Dimensions</span><span className="font-medium text-slate-900">{selectedProduct.details.dimensions}</span></div>
                                )}
                                {selectedProduct.details?.specifications && (
                                   <div className="col-span-2"><span className="block text-slate-400 text-xs font-bold uppercase">Specs</span><span className="font-medium text-slate-900">{selectedProduct.details.specifications}</span></div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                               {selectedProduct.tags.map(tag => (
                                 <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded">#{tag}</span>
                               ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-4 justify-end">
                    {showRejectInput ? (
                        <div className="flex-1 flex gap-2">
                             <input type="text" placeholder="Reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="flex-1 border px-4 py-2 rounded-lg" autoFocus />
                             <button onClick={() => confirmReject(selectedProduct.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Confirm</button>
                             <button onClick={cancelReject} className="bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => handleDeleteFromModal(selectedProduct.id)} className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg mr-auto">Delete</button>
                            <button onClick={() => onEditProduct(selectedProduct)} className="border border-blue-200 text-blue-600 px-6 py-2 rounded-lg">Edit</button>
                            <button onClick={handleRejectClick} className="border border-red-200 text-red-600 px-6 py-2 rounded-lg">Reject</button>
                            <button onClick={() => handleApprove(selectedProduct.id)} className="bg-green-600 text-white px-6 py-2 rounded-lg">Approve</button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
