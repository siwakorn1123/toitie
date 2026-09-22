export type TabType = 'pos-register' | 'kds-display' | 'inventory-stock' | 'sales-analytics';

export interface MenuItem {
  id: string;
  name: string;
  thName: string;
  category: 'coffee' | 'tea' | 'soda' | 'signature' | 'bakery' | 'smoothie';
  price: number;
  image: string;
  badge?: string;
  subBadge?: string;
  statusText?: string;
  statusColor?: string;
  description: string;
  roastLevel?: string;
  stockCount?: number;
}

export interface CartItemModifier {
  sweetness: string;
  ice: string;
  milk: string;
  toppings: string[];
  note?: string;
  extraPrice: number;
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers: CartItemModifier;
  unitTotalPrice: number;
}

export interface KdsItem {
  id: string;
  name: string;
  note: string;
  completed: boolean;
  statusTag?: string;
  tagColor?: string;
  icon?: string;
}

export type OrderStatus = 'pending' | 'in-progress' | 'ready' | 'handed-over';

export interface KdsOrder {
  id: string;
  orderNumber: string;
  type: 'Takeaway' | 'Dine-in' | 'GrabFood' | 'LINEMAN';
  tableOrChannel?: string;
  elapsedSeconds: number;
  targetSeconds: number;
  status: OrderStatus;
  baristaName?: string;
  station: 'espresso' | 'slowbar' | 'blender';
  items: KdsItem[];
  urgentNote?: string;
  isOverdue?: boolean;
  riderInfo?: {
    code: string;
    name: string;
    status: string;
  };
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'beans' | 'dairy' | 'tea' | 'syrup' | 'packaging';
  categoryLabel: string;
  supplier: string;
  currentStock: number;
  maxParStock: number;
  unit: string;
  unitCost: number;
  usedToday: number;
  parPercentage: number;
  status: 'low' | 'normal' | 'out';
  bomFormula: string;
}

export interface BomIngredient {
  id: string;
  name: string;
  amount: string;
  cost: number;
  icon: string;
  iconColor: string;
}
