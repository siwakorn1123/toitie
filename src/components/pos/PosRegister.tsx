import React, { useState } from 'react';
import { MenuItem, CartItem, CartItemModifier, KdsOrder } from '../../types';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';
import { CustomizerModal } from './CustomizerModal';
import { PaymentModal } from './PaymentModal';

interface PosRegisterProps {
  onOrderCompleted: (newOrder: KdsOrder, totalAmount: number) => void;
}

export const PosRegister: React.FC<PosRegisterProps> = ({ onOrderCompleted }) => {
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [diningMode, setDiningMode] = useState<'dine-in' | 'takeaway'>('dine-in');

  // Active customize item
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Active payment method modal
  const [paymentMethod, setPaymentMethod] = useState<'PromptPay QR' | 'Cash' | 'Credit Card / EDC' | null>(null);

  // Initial cart seeded matching screenshot:
  // Item 1: Iced Americano (฿75)
  // Item 2: Uji Matcha Latte x2 (หวาน 25% • Oat Milk +฿20) = ฿105 x 2 = ฿210
  // Item 3: Yuzu Sparkling Americano (฿110)
  // Total items: 4 cups. Subtotal: ฿395.00. Discount 10%: -฿39.50. VAT 7%: ฿24.89. Net: ฿380.39
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartId: 'c-1',
      menuItem: INITIAL_MENU_ITEMS[0], // Iced Americano
      quantity: 1,
      modifiers: {
        sweetness: '0% (ไม่หวาน)',
        ice: 'น้ำแข็งปกติ',
        milk: 'นมสดพรีเมียม (+฿0)',
        toppings: [],
        note: 'หวาน 0% (ไม่หวาน) • คั่วกลาง House Blend',
        extraPrice: 0,
      },
      unitTotalPrice: 75,
    },
    {
      cartId: 'c-2',
      menuItem: INITIAL_MENU_ITEMS[2], // Uji Matcha Latte
      quantity: 2,
      modifiers: {
        sweetness: '25% (หวานน้อย)',
        ice: 'น้ำแข็งปกติ',
        milk: 'Oat Milk (+฿20)',
        toppings: [],
        note: 'หวาน 25% • Oat Milk (+฿20)',
        extraPrice: 20,
      },
      unitTotalPrice: 105,
    },
    {
      cartId: 'c-3',
      menuItem: INITIAL_MENU_ITEMS[4], // Yuzu Sparkling
      quantity: 1,
      modifiers: {
        sweetness: '100% (ปกติ)',
        ice: 'แยกน้ำแข็ง',
        milk: 'นมสดพรีเมียม (+฿0)',
        toppings: [],
        note: 'สูตรมาตรฐาน (ปกติ) • แยกน้ำแข็ง',
        extraPrice: 0,
      },
      unitTotalPrice: 110,
    },
  ]);

  const [appliedDiscountRate, setAppliedDiscountRate] = useState<number>(0.10); // Gold Tier 10%
  const [billNumber, setBillNumber] = useState<string>('บิล #A-084');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.thName.includes(searchQuery) ||
      item.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Calculate cart financials
  const totalCups = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitTotalPrice * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscountRate;
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = taxableAmount * 0.07;
  const netTotal = taxableAmount + vatAmount;

  // Add Item to cart with customized modifiers
  const handleConfirmCustomization = (item: MenuItem, modifier: CartItemModifier) => {
    const unitPrice = item.price + modifier.extraPrice;
    const newCartItem: CartItem = {
      cartId: 'cart-' + Date.now(),
      menuItem: item,
      quantity: 1,
      modifiers: modifier,
      unitTotalPrice: unitPrice,
    };
    setCart((prev) => [newCartItem, ...prev]);
    showToast(`เพิ่ม "${item.name}" ลงในบิลแล้ว`);
  };

  const adjustQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleHoldBill = () => {
    if (cart.length === 0) return;
    showToast(`พักบิล ${billNumber} เรียบร้อยแล้ว (สามารถเรียกคืนได้)`);
    setCart([]);
    setBillNumber(`บิล #A-${Math.floor(85 + Math.random() * 20)}`);
  };

  const handleCancelBill = () => {
    if (cart.length === 0) return;
    if (window.confirm(`ยืนยันยกเลิกรายการทั้งหมดใน ${billNumber} หรือไม่?`)) {
      setCart([]);
      showToast(`ยกเลิกบิลเรียบร้อยแล้ว`);
    }
  };

  const handlePaymentSuccess = () => {
    // Generate new KDS ticket from this order
    const nextOrderNum = `#A-0${Math.floor(84 + Math.random() * 15)}`;
    const newKdsOrder: KdsOrder = {
      id: 'kds-' + Date.now(),
      orderNumber: nextOrderNum,
      type: diningMode === 'dine-in' ? 'Dine-in' : 'Takeaway',
      tableOrChannel: diningMode === 'dine-in' ? 'โต๊ะ 04' : 'เคาน์เตอร์ POS #01',
      elapsedSeconds: 0,
      targetSeconds: 300,
      status: 'pending',
      station: 'espresso',
      items: cart.map((ci) => ({
        id: 'it-' + Math.random(),
        name: `${ci.quantity}x ${ci.menuItem.name}`,
        note: ci.modifiers.note || `${ci.modifiers.sweetness} • ${ci.modifiers.milk}`,
        completed: false,
      })),
    };

    onOrderCompleted(newKdsOrder, netTotal);
    setPaymentMethod(null);
    setCart([]);
    setBillNumber(`บิล #A-0${Math.floor(85 + Math.random() * 15)}`);
    showToast(`ชำระเงินสำเร็จ ฿${netTotal.toFixed(2)} บิลส่งเข้าหน้าจอบาร์ KDS เรียบร้อยแล้ว`);
  };

  return (
    <div className="flex flex-col w-full p-space-md gap-space-md">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-secondary text-sm animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Layout Wrapper: 63% Catalog Grid, 37% Checkout Register Slip */}
      <div className="flex flex-col xl:flex-row gap-space-lg w-full items-start">
        {/* LEFT PANEL: Catalog, Category Chips, Product Matrix */}
        <div className="w-full xl:w-[63%] flex flex-col gap-space-md">
          {/* Top Action Strip: Search, Barcode Scan Trigger, Status Metadata */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container">
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[22px] pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low text-on-surface rounded-lg font-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors"
                placeholder="ค้นหาเมนู (ชื่อ, รหัส, วัตถุดิบ เช่น Americano, มัทฉะ)..."
                type="text"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="material-symbols-outlined absolute right-3 text-outline text-[20px] hover:text-on-surface"
                >
                  close
                </button>
              ) : (
                <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] cursor-pointer hover:text-on-surface">
                  mic
                </span>
              )}
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => showToast('เปิดกล้องจำลองพร้อมสแกนบาร์โค้ดสินค้า')}
                className="flex items-center gap-1.5 px-space-md py-2.5 bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95 shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
                <span className="font-label-md text-label-md whitespace-nowrap">สแกนโค้ด</span>
              </button>
              <button
                onClick={() => showToast('โปรโมชันปัจจุบัน: ลูกค้า Gold ลด 10%, แก้วลูกค้านำมาเองลด ฿5')}
                className="flex items-center gap-1.5 px-space-md py-2.5 bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all active:scale-95 shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">loyalty</span>
                <span className="font-label-md text-label-md whitespace-nowrap">โปรโมชัน (3)</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Category Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 select-none no-scrollbar">
            {[
              { id: 'all', label: 'ทั้งหมด (All)', icon: 'apps' },
              { id: 'coffee', label: 'กาแฟสด (Coffee)', icon: 'local_cafe', iconColor: 'text-tertiary' },
              { id: 'tea', label: 'ชา & มัทฉะ (Tea & Matcha)', icon: 'emoji_food_beverage', iconColor: 'text-secondary' },
              { id: 'soda', label: 'สมูทตี้ & โซดา (Soda)', icon: 'local_bar', iconColor: 'text-primary' },
              { id: 'signature', label: 'ซิกเนเจอร์ (Signature)', icon: 'stars', iconColor: 'text-tertiary-container' },
              { id: 'bakery', label: 'เบเกอรี่ (Bakery)', icon: 'bakery_dining', iconColor: 'text-outline' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1.5 shadow-xs ${
                    isSelected
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-on-primary' : cat.iconColor || ''}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Product Grid (Tactile Touch Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-sm sm:gap-space-md">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setCustomizingItem(item)}
                className="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer active:scale-[0.98] flex flex-col justify-between border border-surface-container/60"
              >
                {/* Thumbnail Header */}
                <div className="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  {item.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                      {item.badge}
                    </span>
                  )}
                  {item.subBadge && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-inverse-surface/80 backdrop-blur-xs text-inverse-on-surface font-label-sm text-label-sm">
                      {item.subBadge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-space-sm flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
                    <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {item.statusText || 'พร้อมเสิร์ฟ'}
                    </span>
                    <span className="font-headline-md text-headline-md text-primary">
                      ฿{item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Fast Action Bar at Bottom of Menu */}
          <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-space-sm flex-wrap">
              <button
                onClick={() => showToast('เรียกคืนบิลล่าสุด #A-083 (Iced Latte x2) เรียบร้อย')}
                className="px-space-md py-2 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>รายการก่อนหน้า</span>
              </button>
              <button
                onClick={() => {
                  setAppliedDiscountRate((prev) => (prev > 0 ? 0 : 0.1));
                  showToast(appliedDiscountRate > 0 ? 'ยกเลิกส่วนลด' : 'ใช้ส่วนลดพนักงาน/สมาชิก 10%');
                }}
                className="px-space-md py-2 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">percent</span>
                <span>ส่วนลดพิเศษ {appliedDiscountRate > 0 ? '(ใช้งานอยู่)' : ''}</span>
              </button>
              <button
                onClick={() => showToast('ส่งคำสั่งพิมพ์ใบกำกับภาษีเต็มรูปไปยังเครื่องพิมพ์ใบเสร็จ')}
                className="px-space-md py-2 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>พิมพ์ใบกำกับ</span>
              </button>
            </div>
            <span className="font-label-sm text-label-sm text-outline hidden sm:block">
              Terminal ID: BKK-REG-01
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Current Order Ticket / Cart Slip */}
        <div className="w-full xl:w-[37%] bg-surface-container-lowest rounded-2xl shadow-md flex flex-col sticky top-20 overflow-hidden border border-surface-container">
          {/* Order Header */}
          <div className="p-space-md bg-surface-container flex flex-col gap-space-sm border-b border-surface-container-high">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  {billNumber}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                  กำลังสั่ง
                </span>
              </div>
              {/* Dine-In / Takeaway Toggle Buttons */}
              <div className="flex items-center bg-surface-container-highest p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDiningMode('dine-in')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1 ${
                    diningMode === 'dine-in'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">table_restaurant</span>
                  <span>ทานที่ร้าน (T-04)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiningMode('takeaway')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1 ${
                    diningMode === 'takeaway'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                  <span>สั่งกลับบ้าน</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1 border-t border-surface-container-high/60">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                <span>ลูกค้า: คุณอรทัย (Gold Member)</span>
              </div>
              <span className="text-secondary font-semibold">แต้มสะสม: 340 pts</span>
            </div>
          </div>

          {/* Order Item List (Scrollable Area) */}
          <div className="p-space-md flex flex-col gap-space-sm max-h-[360px] overflow-y-auto no-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-outline font-label-md text-label-md flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-surface-container-high">
                  shopping_cart
                </span>
                <span>ยังไม่มีรายการในบิลนี้ แตะเลือกเมนูเพื่อเพิ่ม</span>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-start justify-between p-space-sm rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container border border-surface-container/60"
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                      {item.menuItem.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      {item.modifiers.note || `${item.modifiers.sweetness} • ${item.modifiers.milk}`}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                      {item.quantity > 1 ? (
                        <>฿{item.unitTotalPrice} x {item.quantity} = ฿{item.unitTotalPrice * item.quantity}</>
                      ) : (
                        <>฿{item.unitTotalPrice}</>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => adjustQty(item.cartId, -1)}
                      className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-xs hover:bg-surface-container-high active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-headline-sm text-headline-sm text-on-surface w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustQty(item.cartId, 1)}
                      className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-xs hover:bg-surface-container-high active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.cartId)}
                      className="w-8 h-8 rounded-lg text-outline hover:text-error flex items-center justify-center active:scale-90 transition-colors ml-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculation Breakdown */}
          <div className="p-space-md bg-surface-container-low flex flex-col gap-1.5 border-t border-surface-container-high">
            <div className="flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
              <span>ยอดรวมรายการ ({totalCups} แก้ว)</span>
              <span className="font-medium text-on-surface font-mono">฿{subtotal.toFixed(2)}</span>
            </div>
            {appliedDiscountRate > 0 && (
              <div className="flex justify-between items-center text-secondary font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  <span>สมาชิกลด 10% (Gold Tier)</span>
                </span>
                <span className="font-mono">-฿{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
              <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
              <span className="font-mono">฿{vatAmount.toFixed(2)}</span>
            </div>

            {/* Total Highlight Display */}
            <div className="flex justify-between items-end pt-3 bg-surface-container-lowest p-space-sm rounded-xl mt-1 shadow-xs border border-surface-container">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  ยอดสุทธิรวมทั้งสิ้น
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Net Amount Due
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-sm text-headline-sm text-primary">฿</span>
                <span className="font-display-lg text-display-lg text-primary tracking-tight font-mono">
                  {netTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Payment Action Keys */}
          <div className="p-space-md bg-surface-container-lowest flex flex-col gap-space-sm border-t border-surface-container-high">
            {/* Primary Express Checkout Button (PromptPay QR) */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setPaymentMethod('PromptPay QR')}
              className="w-full h-[54px] bg-secondary hover:bg-on-secondary-container text-on-secondary rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[26px]">qr_code_scanner</span>
              <span>ชำระเงินด่วน (PromptPay QR)</span>
            </button>

            {/* Secondary Payment Keys Grid */}
            <div className="grid grid-cols-2 gap-space-xs">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setPaymentMethod('Cash')}
                className="h-12 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-xs active:translate-y-0.5 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">payments</span>
                <span>เงินสด (Cash)</span>
              </button>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setPaymentMethod('Credit Card / EDC')}
                className="h-12 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-xs active:translate-y-0.5 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">credit_card</span>
                <span>บัตรเครดิต / EDC</span>
              </button>
            </div>

            {/* Utility Bottom Actions */}
            <div className="grid grid-cols-2 gap-space-xs pt-1">
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleHoldBill}
                className="py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                <span>พักบิล (Hold)</span>
              </button>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleCancelBill}
                className="py-2.5 bg-error-container/40 hover:bg-error-container text-error rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                <span>ยกเลิกบิล</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Slide-over Modal */}
      <CustomizerModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onConfirm={handleConfirmCustomization}
      />

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={!!paymentMethod}
        method={paymentMethod}
        totalAmount={netTotal}
        onClose={() => setPaymentMethod(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
