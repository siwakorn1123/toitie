import React, { useState } from 'react';
import { InventoryItem } from '../../types';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('SKU-CF-' + Math.floor(100 + Math.random() * 900));
  const [category, setCategory] = useState<'beans' | 'dairy' | 'tea' | 'syrup' | 'packaging'>('beans');
  const [supplier, setSupplier] = useState('');
  const [currentStock, setCurrentStock] = useState('10');
  const [maxParStock, setMaxParStock] = useState('20');
  const [unit, setUnit] = useState('กก.');
  const [unitCost, setUnitCost] = useState('450');
  const [bomFormula, setBomFormula] = useState('18g / Double Shot');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stock = parseFloat(currentStock) || 0;
    const par = parseFloat(maxParStock) || 1;
    const parPct = Math.round((stock / par) * 100);

    const categoryLabels: Record<string, string> = {
      beans: 'เมล็ดกาแฟ',
      dairy: 'นม & ทางเลือก',
      tea: 'ชา & ผงชง',
      syrup: 'ไซรัป',
      packaging: 'บรรจุภัณฑ์',
    };

    const newItem: InventoryItem = {
      id: 'inv-' + Date.now(),
      sku,
      name,
      category,
      categoryLabel: categoryLabels[category],
      supplier: supplier || 'Local Distributor',
      currentStock: stock,
      maxParStock: par,
      unit,
      unitCost: parseFloat(unitCost) || 0,
      usedToday: 0,
      parPercentage: parPct,
      status: parPct < 40 ? 'low' : 'normal',
      bomFormula: bomFormula || '1 หน่วย / แก้ว',
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">inventory_2</span>
            <span className="font-headline-md text-headline-md text-on-surface">เพิ่มรายการวัตถุดิบใหม่</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-body-sm text-body-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">ชื่อวัตถุดิบ *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น Single Origin Colombia"
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">รหัส SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">หมวดหมู่วัตถุดิบ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="beans">เมล็ดกาแฟ</option>
                <option value="dairy">นม & ทางเลือกนม</option>
                <option value="tea">ชา & ผงเครื่องดื่ม</option>
                <option value="syrup">ไซรัป & ท็อปปิ้ง</option>
                <option value="packaging">บรรจุภัณฑ์แก้ว/หลอด</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">ผู้จัดจำหน่าย (Supplier)</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="เช่น Pacamara, Meiji"
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">สต็อกปัจจุบัน</label>
              <input
                type="number"
                step="any"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">ระดับ Par สูงสุด</label>
              <input
                type="number"
                step="any"
                value={maxParStock}
                onChange={(e) => setMaxParStock(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">หน่วยนับ</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="กก., กล่อง, ใบ"
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">ราคาต้นทุน/หน่วย (฿)</label>
              <input
                type="number"
                step="any"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface">สูตรตัด BOM</label>
              <input
                type="text"
                value={bomFormula}
                onChange={(e) => setBomFormula(e.target.value)}
                placeholder="เช่น 18g / Double Shot"
                className="w-full mt-1 px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all"
            >
              บันทึกวัตถุดิบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
