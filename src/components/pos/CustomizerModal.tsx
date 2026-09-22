import React, { useState } from 'react';
import { MenuItem, CartItemModifier } from '../../types';

interface CustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: MenuItem, modifier: CartItemModifier) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [sweetness, setSweetness] = useState('25% (หวานน้อย)');
  const [ice, setIce] = useState('น้ำแข็งปกติ');
  const [milk, setMilk] = useState('นมสดพรีเมียม (+฿0)');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [note, setNote] = useState('');

  if (!isOpen || !item) return null;

  const toppingPrices: Record<string, number> = {
    'เพิ่มไข่มุกทองเคี่ยว': 15,
    'เพิ่มเอสเปรสโซ่ 1 ช็อต': 20,
    'ฟองนมนุ่มพิเศษ': 10,
    'น้ำผึ้งแท้ดอกลำไย': 15,
  };

  const milkPrices: Record<string, number> = {
    'นมสดพรีเมียม (+฿0)': 0,
    'Oat Milk (+฿20)': 20,
    'Almond Milk (+฿25)': 25,
  };

  const calculatedExtra =
    (milkPrices[milk] || 0) +
    selectedToppings.reduce((acc, top) => acc + (toppingPrices[top] || 0), 0);

  const totalPrice = item.price + calculatedExtra;

  const handleToggleTopping = (topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const handleConfirm = () => {
    onConfirm(item, {
      sweetness,
      ice,
      milk,
      toppings: selectedToppings,
      note,
      extraPrice: calculatedExtra,
    });
    // Reset defaults
    setSelectedToppings([]);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-surface-container-high">
        {/* Modal Header */}
        <div className="p-space-md bg-surface-container flex items-center justify-between border-b border-surface-container-high">
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {item.name} ({item.thName})
            </h2>
            <span className="font-body-sm text-body-sm text-outline">
              เลือกระดับความหวาน ชนิดนม และท็อปปิ้งเพิ่มเติม
            </span>
          </div>
          <button
            className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body Options */}
        <div className="p-space-md flex flex-col gap-space-md max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Sweetness Level */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold">
              ระดับความหวาน (Sweetness)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['0% (ไม่หวาน)', '25% (หวานน้อย)', '50% (ปานกลาง)', '100% (ปกติ)'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSweetness(opt)}
                  className={`px-3 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                    sweetness === opt
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold">
              ระดับน้ำแข็ง (Ice Level)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['ไม่ใส่น้ำแข็ง', 'น้ำแข็งปกติ', 'แยกน้ำแข็ง'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIce(opt)}
                  className={`px-3 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                    ice === opt
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Milk Options */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold">
              ชนิดนม (Milk Substitute)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['นมสดพรีเมียม (+฿0)', 'Oat Milk (+฿20)', 'Almond Milk (+฿25)'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMilk(opt)}
                  className={`px-3 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                    milk === opt
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons / Toppings */}
          <div className="flex flex-col gap-2">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold">
              ท็อปปิ้งและช็อตพิเศษ (Toppings & Extras)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(toppingPrices).map(([name, price]) => {
                const isSelected = selectedToppings.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleToggleTopping(name)}
                    className={`p-3 rounded-xl font-label-md text-label-md text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{name}</span>
                    <span className={isSelected ? 'text-on-primary font-bold' : 'text-primary font-bold'}>
                      +฿{price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kitchen Note */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-outline">
              ข้อความกำกับบาริสต้า (Kitchen Notes)
            </label>
            <input
              className="w-full px-3 py-2.5 bg-surface-container-low rounded-lg text-on-surface font-body-sm placeholder:text-outline focus:outline-none focus:bg-surface-container border border-surface-container"
              placeholder="เช่น แก้วลูกค้านำมาเอง (ลด ฿5), ขอนมร้อนแยกแก้ว..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type="text"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-space-md bg-surface-container-low flex items-center justify-between border-t border-surface-container-high">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline">ราคาคำนวณสุทธิ</span>
            <span className="font-headline-lg text-headline-lg text-primary">฿{totalPrice}</span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              className="px-space-md py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg rounded-xl transition-colors active:scale-95"
              onClick={onClose}
              type="button"
            >
              ยกเลิก
            </button>
            <button
              className="px-space-lg py-2.5 bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
              onClick={handleConfirm}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              เพิ่มลงบิล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
