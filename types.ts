
export enum View {
  MARKETPLACE = 'MARKETPLACE',
  SELL = 'SELL',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  ADMIN = 'ADMIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  CONTACT = 'CONTACT',
  FAQ = 'FAQ',
  EDIT_ITEM = 'EDIT_ITEM'
}

export enum Category {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  HOME_APPLIANCES = 'Home Appliances',
  FASHION = 'Fashion',
  WATCHES = 'Watches',
  TOYS = 'Toys',
  ACCESSORIES = 'Accessories',
  OTHERS = 'Others'
}

export enum Currency {
  AED = 'AED'
}

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'offer_accepted';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  isSeller: boolean;
  isAdmin?: boolean; 
  password?: string; 
  savedProductIds?: string[];
}

export interface ProductDetails {
  brand?: string;
  purchaseYear?: string;
  dimensions?: string;
  specifications?: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Offer {
  id: string;
  bidderName: string;
  bidderEmail: string;
  amount: number;
  date: string;
  status: OfferStatus;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  category: Category;
  imageUrl: string; 
  additionalImages: string[]; 
  location: string;
  sellerName: string;
  buyerName?: string;
  buyerEmail?: string;
  postedDate: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  tags: string[];
  isSold?: boolean;
  status: ProductStatus;
  rejectionReason?: string;
  details?: ProductDetails;
  offers?: Offer[];
  reservedForEmail?: string;
  offerAcceptedAt?: string;
}

export interface AIListingResponse {
  title: string;
  description: string;
  category: string;
  suggestedPrice: number;
  currency: string;
  condition: string;
  tags: string[];
}
