import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import SellItem from './pages/SellItem';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import RegisterSeller from './pages/RegisterSeller';
import Login from './pages/Login';
import HowItWorks from './pages/HowItWorks';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import UserProfileModal from './components/UserProfileModal';
import { View, Product, Category, Currency, User, Offer, OfferStatus } from './types';

// Initial Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Apple MacBook Pro M1 2020',
    description: 'Pristine condition MacBook Pro M1. 8GB RAM, 256GB SSD. Battery health 98%. Comes with original box and charger. Used for light office work only.',
    price: 3200,
    currency: Currency.AED,
    category: Category.ELECTRONICS,
    imageUrl: 'https://picsum.photos/seed/macbook/800/600',
    additionalImages: ['https://picsum.photos/seed/macbook2/800/600'],
    location: 'Dubai Marina, Dubai',
    sellerName: 'Ahmed Al-Farsi',
    postedDate: '2 hours ago',
    condition: 'Like New',
    tags: ['apple', 'laptop', 'macbook'],
    isSold: false,
    status: 'approved',
    details: {
      brand: 'Apple',
      purchaseYear: '2020',
      specifications: '8GB RAM, 256GB SSD'
    },
    offers: []
  },
  {
    id: '2',
    title: 'Rolex Submariner Date',
    description: 'Authentic Rolex Submariner. Excellent condition with box and papers. 2021 Model. Barely worn.',
    price: 45000,
    currency: Currency.AED,
    category: Category.WATCHES,
    imageUrl: 'https://picsum.photos/seed/rolex/800/600',
    additionalImages: [],
    location: 'Downtown Dubai, UAE',
    sellerName: 'Sarah Smith',
    postedDate: '1 day ago',
    condition: 'Like New',
    tags: ['rolex', 'watch', 'luxury'],
    isSold: false,
    status: 'approved',
    details: {
      brand: 'Rolex',
      purchaseYear: '2021'
    },
    offers: [
      {
        id: 'o1',
        bidderName: 'Demo User',
        bidderEmail: 'user@glokart.ae',
        amount: 42000,
        date: '10 mins ago',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    title: 'Vintage Persian Rug',
    description: 'Authentic handmade Persian rug. 2x3 meters. Deep reds and blues. Family heirloom, selling due to moving.',
    price: 1200,
    currency: Currency.AED,
    category: Category.FURNITURE,
    imageUrl: 'https://picsum.photos/seed/rug/800/600',
    additionalImages: [],
    location: 'Al Khalidiya, Abu Dhabi',
    sellerName: 'Khalid Bin S.',
    postedDate: '3 days ago',
    condition: 'Good',
    tags: ['rug', 'decor', 'vintage'],
    isSold: false,
    status: 'approved',
    details: {
      dimensions: '200cm x 300cm'
    },
    offers: []
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Demo User',
    email: 'user@glokart.ae',
    address: 'Downtown Dubai',
    phoneNumber: '0501234567',
    isSeller: true,
    savedProductIds: []
  },
  {
    id: 'admin_1',
    name: 'System Admin',
    email: 'admin@glokart.ae',
    password: 'admin', 
    address: 'GloKart HQ',
    phoneNumber: '0000000000',
    isSeller: false,
    isAdmin: true
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.MARKETPLACE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [nextView, setNextView] = useState<View | null>(null);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('glokart_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('glokart_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('glokart_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('glokart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('glokart_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('glokart_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('glokart_currentUser');
    }
  }, [currentUser]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(View.PRODUCT_DETAIL);
  };

  const handleBackToMarket = () => {
    setSelectedProduct(null);
    setCurrentView(View.MARKETPLACE);
  };

  const handleItemSubmit = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    alert("Listing submitted! It is now pending admin approval.");
    setCurrentView(View.MARKETPLACE);
  };

  const handleEditProductRequest = (product: Product) => {
    setSelectedProduct(product);
    setShowProfileModal(false);
    setCurrentView(View.EDIT_ITEM);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    alert("Listing updated successfully!");
    if (currentUser?.isAdmin) {
         setCurrentView(View.ADMIN);
    } else {
         setCurrentView(View.MARKETPLACE);
    }
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
    }
  };

  const handleBuyItem = (productToBuy: Product) => {
    if (!currentUser) return;

    const updatedProducts = products.map(p => 
      p.id === productToBuy.id ? { 
        ...p, 
        isSold: true, 
        buyerName: currentUser.name,
        buyerEmail: currentUser.email
      } : p
    );
    setProducts(updatedProducts);
    
    if (selectedProduct && selectedProduct.id === productToBuy.id) {
      setSelectedProduct({ 
        ...selectedProduct, 
        isSold: true,
        buyerName: currentUser.name,
        buyerEmail: currentUser.email 
      });
    }

    alert("Order Placed! An email confirmation has been sent to you.");
  };

  const handleMakeOffer = (productToOffer: Product, amount: number) => {
    if (!currentUser) return;

    const newOffer: Offer = {
        id: Math.random().toString(36).substr(2, 9),
        bidderName: currentUser.name,
        bidderEmail: currentUser.email,
        amount: amount,
        date: 'Just now',
        status: 'pending'
    };

    const updatedProducts = products.map(p => {
        if (p.id === productToOffer.id) {
            return {
                ...p,
                offers: [...(p.offers || []), newOffer]
            };
        }
        return p;
    });

    setProducts(updatedProducts);
    alert("Offer Sent! The seller has been notified via email.");
  };

  const handleOfferAction = (productId: string, offerId: string, action: 'accept' | 'reject') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const offer = product.offers?.find(o => o.id === offerId);
    if (!offer) return;

    const updatedProducts: Product[] = products.map(p => {
        if (p.id === productId && p.offers) {
            const updatedOffers: Offer[] = p.offers.map(o => 
               o.id === offerId ? { ...o, status: (action === 'accept' ? 'accepted' : 'rejected') as OfferStatus } : o
            );

            let updatedProduct: Product = {
                ...p,
                offers: updatedOffers
            };

            if (action === 'accept') {
                updatedProduct = {
                    ...updatedProduct,
                    status: 'offer_accepted',
                    price: offer.amount,
                    reservedForEmail: offer.bidderEmail,
                    offerAcceptedAt: new Date().toISOString()
                };
            }
            return updatedProduct;
        }
        return p;
    });
    setProducts(updatedProducts);
    
    if (action === 'accept') {
      alert("Offer Accepted. The buyer has been notified via email.");
    }
  };

  const handleApproveProduct = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: 'approved' } : p
    ));
    alert("Listing approved!");
  };

  const handleRejectProduct = (id: string, reason: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: 'rejected', rejectionReason: reason } : p
    ));
    alert("Listing rejected.");
  };

  const handleRegisterUser = (user: User) => {
    setRegisteredUsers([...registeredUsers, user]);
    setCurrentUser(user);
    alert(`Welcome, ${user.name}! Account created successfully.`);
    
    if (nextView) {
        setCurrentView(nextView);
        setNextView(null);
    } else {
        if (selectedProduct && currentView === View.REGISTER) {
             setCurrentView(View.PRODUCT_DETAIL);
        } else {
             setCurrentView(View.MARKETPLACE);
        }
    }
  };

  const handleLogin = (identifier: string, password?: string) => {
    if (password) {
        if (identifier === 'admin' && password === 'admin123') {
            const adminUser = registeredUsers.find(u => u.isAdmin);
            if (adminUser) setCurrentUser(adminUser);
            setCurrentView(View.ADMIN);
            return;
        } else {
            alert("Invalid admin username or password.");
            return;
        }
    }

    const user = registeredUsers.find(u => u.email.toLowerCase() === identifier.toLowerCase() && !u.isAdmin);
    if (user) {
      setCurrentUser(user);
      alert(`Welcome back, ${user.name}!`);
      if (nextView) {
        setCurrentView(nextView);
        setNextView(null);
      } else {
        setCurrentView(View.MARKETPLACE);
      }
    } else {
      alert("No account found with this email. Please register first.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowProfileModal(false);
    setCurrentView(View.MARKETPLACE);
    setNextView(null);
    setSearchQuery('');
  };

  const handleToggleSave = (productId: string) => {
    if (!currentUser) {
        alert("Please log in to save items.");
        setNextView(View.PRODUCT_DETAIL);
        setCurrentView(View.LOGIN);
        return;
    }
    const savedIds = currentUser.savedProductIds || [];
    const isSaved = savedIds.includes(productId);
    
    let newSavedIds;
    if (isSaved) {
        newSavedIds = savedIds.filter(id => id !== productId);
    } else {
        newSavedIds = [...savedIds, productId];
    }
    const updatedUser = { ...currentUser, savedProductIds: newSavedIds };
    setCurrentUser(updatedUser);
    setRegisteredUsers(registeredUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handleNavbarSellClick = () => {
    if (currentUser) {
        setCurrentView(View.SELL);
    } else {
        setNextView(View.SELL);
        setCurrentView(View.LOGIN); 
    }
  };

  const handleNavbarLoginClick = () => {
    setNextView(View.MARKETPLACE);
    setCurrentView(View.LOGIN);
  };

  const handleProductDetailRegisterRequest = () => {
    setNextView(View.PRODUCT_DETAIL);
    setCurrentView(View.LOGIN);
  };

  const marketplaceProducts = products.filter(p => p.status === 'approved' || p.status === 'offer_accepted');
  const pendingProducts = products.filter(p => p.status === 'pending');
  const soldProducts = products.filter(p => p.isSold);
  const productsWithOffers = products.filter(p => p.offers && p.offers.length > 0 && !p.isSold);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar 
        currentView={currentView} 
        onChangeView={(view) => setCurrentView(view)}
        user={currentUser}
        onSellClick={handleNavbarSellClick}
        onLoginClick={handleNavbarLoginClick}
        onProfileClick={() => setShowProfileModal(true)}
        onDashboardClick={() => setCurrentView(View.ADMIN)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <main className="flex-grow pb-12">
        {currentView === View.MARKETPLACE && (
          <Marketplace 
            products={marketplaceProducts} 
            onProductClick={handleProductClick} 
            onViewChange={setCurrentView}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        )}

        {currentView === View.REGISTER && (
          <RegisterSeller 
            onRegister={handleRegisterUser}
            onCancel={() => setCurrentView(View.MARKETPLACE)}
            existingEmails={registeredUsers.map(u => u.email)}
          />
        )}

        {currentView === View.LOGIN && (
          <Login 
            onLogin={handleLogin}
            onRegisterClick={() => setCurrentView(View.REGISTER)}
            initialAdminMode={false}
          />
        )}

        {currentView === View.ADMIN_LOGIN && (
          <Login 
            onLogin={handleLogin}
            onRegisterClick={() => setCurrentView(View.REGISTER)}
            initialAdminMode={true}
          />
        )}

        {currentView === View.SELL && currentUser && (
          <SellItem 
            onCancel={() => setCurrentView(View.MARKETPLACE)} 
            onSubmit={handleItemSubmit}
            user={currentUser}
          />
        )}

        {currentView === View.EDIT_ITEM && currentUser && selectedProduct && (
          <SellItem 
            onCancel={() => { 
                setSelectedProduct(null); 
                setCurrentView(currentUser.isAdmin ? View.ADMIN : View.MARKETPLACE);
            }} 
            onSubmit={handleUpdateProduct}
            user={currentUser}
            initialData={selectedProduct}
          />
        )}

        {currentView === View.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            user={currentUser}
            onBack={handleBackToMarket} 
            onBuy={handleBuyItem}
            onMakeOffer={handleMakeOffer}
            onRegister={handleProductDetailRegisterRequest}
            isSaved={currentUser?.savedProductIds?.includes(selectedProduct.id) || false}
            onToggleSave={() => handleToggleSave(selectedProduct.id)}
          />
        )}

        {currentView === View.ADMIN && currentUser?.isAdmin && (
          <AdminDashboard 
            allProducts={products}
            pendingProducts={pendingProducts}
            soldProducts={soldProducts}
            productsWithOffers={productsWithOffers}
            users={registeredUsers}
            onApprove={handleApproveProduct}
            onReject={handleRejectProduct}
            onEditProduct={handleEditProductRequest}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {currentView === View.HOW_IT_WORKS && (
           <HowItWorks onBack={() => setCurrentView(View.MARKETPLACE)} />
        )}
        {currentView === View.CONTACT && (
           <ContactUs onCancel={() => setCurrentView(View.MARKETPLACE)} />
        )}
        {currentView === View.FAQ && (
           <FAQ onBack={() => setCurrentView(View.MARKETPLACE)} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-2">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 mb-4 inline-block">
                        GloKart
                    </span>
                    <p className="text-slate-500 text-sm max-w-xs">
                        UAE's smartest C2C marketplace. Buy, sell, and discover pre-loved items with AI-powered simplicity.
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 mb-4">Discover</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><button onClick={() => setCurrentView(View.MARKETPLACE)} className="hover:text-primary-600">Browse Items</button></li>
                        <li><button onClick={() => setCurrentView(View.HOW_IT_WORKS)} className="hover:text-primary-600">How it Works</button></li>
                        <li><button onClick={() => setCurrentView(View.SELL)} className="hover:text-primary-600">Sell Now</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 mb-4">Support</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><button onClick={() => setCurrentView(View.FAQ)} className="hover:text-primary-600">FAQ</button></li>
                        <li><button onClick={() => setCurrentView(View.CONTACT)} className="hover:text-primary-600">Contact Us</button></li>
                        <li>
                            {currentUser?.isAdmin ? (
                                <button 
                                onClick={() => setCurrentView(View.ADMIN)}
                                className="font-semibold text-primary-600 hover:text-primary-800"
                                >
                                Back to Dashboard
                                </button>
                            ) : (
                                <button 
                                onClick={() => setCurrentView(View.ADMIN_LOGIN)}
                                className="hover:text-primary-600"
                                >
                                Admin Login
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-100 pt-8 text-center">
                <p className="text-slate-400 text-sm">© 2024 GloKart UAE. All rights reserved.</p>
            </div>
        </div>
      </footer>

      {showProfileModal && currentUser && (
        <UserProfileModal 
            user={currentUser}
            allProducts={products}
            onClose={() => setShowProfileModal(false)}
            onLogout={handleLogout}
            onOfferAction={handleOfferAction}
            onEditProduct={handleEditProductRequest}
            onDeleteProduct={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default App;