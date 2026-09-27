export type CategoryType = "MALE" | "FEMALE" | "UNISEX";

export type OrderStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "DISPATCHED"
  | "COMPLETED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethodType = "COD" | "BANK_TRANSFER";

export type PaymentStatusType = "PENDING" | "PAID" | "REFUNDED";

export interface ProductImageItem {
  id?: string;
  productId?: string;
  imageUrl: string;
  r2Key?: string | null;
  altText?: string | null;
  sortOrder?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  category: CategoryType;
  stock: number;
  sku: string;
  size: string;
  fragranceNotes?: string | null;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  featured: boolean;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  images: ProductImageItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock: number;
}

export interface OrderItemData {
  id?: string;
  productId?: string | null;
  productName: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  status: OrderStatusType;
  comment?: string | null;
  createdAt: string | Date;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string | null;
  notes?: string | null;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  status: OrderStatusType;
  trackingNumber?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItemData[];
  statusHistory?: OrderStatusHistoryItem[];
}
