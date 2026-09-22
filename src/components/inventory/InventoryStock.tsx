import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { INITIAL_INVENTORY_ITEMS, BOM_MATCHA_INGREDIENTS, ASSETS } from '../../data/mockData';
import { AddInventoryModal } from './AddInventoryModal';

export const InventoryStock: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier =
      selectedSupplier === 'all' ? true : item.supplier === selectedSupplier;
    const matchesStatus =
      selectedStatus === 'all' ? true : item.status === selectedStatus;
    return matchesCategory && matchesSearch && matchesSupplier && matchesStatus;
  });

  const handleAddItem = (newItem: InventoryItem) => {
    setItems((prev) => [newItem, ...prev]);
    showToast(`เพิ่มวัตถุดิบ "${newItem.name}" เรียบร้อยแล้ว`);
  };

  const handleQuickReorder = (item: InventoryItem) => {
    showToast(`ส่งใบขอสั่งซื้อด่วน (PO) สำหรับ ${item.name} ไปยัง ${item.supplier} สำเร็จ`);
  };

  const handleSaveStockAdjustment = () => {
    if (!adjustingItem) return;
    const added = parseFloat(adjustAmount) || 0;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === adjustingItem.id) {
          const nextStock = Math.max(0, it.currentStock + added);
          const nextPct = Math.round((nextStock / it.maxParStock) * 100);
          return {
            ...it,
            currentStock: nextStock,
            parPercentage: nextPct,
            status: nextPct < 40 ? 'low' : 'normal',
          };
        }
        return it;
      })
    );
    showToast(`ปรับปรุงสต็อก ${adjustingItem.name} เพิ่ม +${added} ${adjustingItem.unit} สำเร็จ`);
    setAdjustingItem(null);
    setAdjustAmount('');
  };

  return (
    <div className="flex flex-col w-full p-space-md sm:p-space-lg gap-space-md">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-secondary text-sm animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div>
          <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
            <span>การจัดการร้าน</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-on-surface font-semibold">คลังสต็อกวัตถุดิบ & สูตรชง (BOM)</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
            คลังสต็อกวัตถุดิบ & สูตรชง (BOM)
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ระบบคำนวณและตัดสต็อกอัตโนมัติแบบเรียลไทม์ตามบิลแคชเชียร์และสูตรมาตรฐาน
          </p>
        </div>

        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            type="button"
            onClick={() => showToast('เปิดประวัติการปรับปรุงสต็อกและบันทึกการตรวจนับกะเช้า')}
            className="flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>ประวัติปรับปรุงสต็อก</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('สร้างและดาวน์โหลดไฟล์รายงานคลังสินค้า Excel (XLSX) สำเร็จ')}
            className="flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>ส่งออกรายงาน (Excel)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>เพิ่มรายการวัตถุดิบใหม่</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">มูลค่าสต็อกรวมคงเหลือ</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-headline-lg text-headline-lg text-on-surface">฿148,200</div>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +2.4% จากรอบตรวจนับก่อน
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">วัตถุดิบใกล้หมดสต็อก</span>
            <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-headline-lg text-headline-lg text-error">4 รายการ</div>
            <span className="font-label-sm text-label-sm text-error flex items-center gap-0.5 mt-0.5">
              ต้องสั่งซื้อภายใน 24 ชม.
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">อัตราการสูญเสีย / เททิ้ง</span>
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">recycling</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-headline-lg text-headline-lg text-on-surface">1.2%</div>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              เกณฑ์ดีเยี่ยม (&lt; 2.0%)
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">รอรับเข้าสินค้า (Pending PO)</span>
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-headline-lg text-headline-lg text-primary">2 คำสั่งซื้อ</div>
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5 mt-0.5">
              กำหนดส่งรอบบ่ายวันนี้
            </span>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      <div className="bg-error-container/40 border border-error/30 rounded-xl p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div className="flex items-start gap-space-sm">
          <div className="w-9 h-9 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">notification_important</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-error">
              วิกฤตสต็อกต่ำ (Critical Low) 3 รายการหลัก: House Blend, Oatly Barista, Uji Matcha
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
              คำนวณจากอัตราขายเฉลี่ยช่วงบ่าย วัตถุดิบเหล่านี้จะหมดสต็อกก่อนเวลา 16:30 น. แนะนำให้อนุมัติใบสั่งซื้อด่วนทันที
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          <button
            type="button"
            onClick={() => showToast('ระบบคำนวณอัตราบริโภค: กาแฟเฉลี่ย 480g/ชม., นมโอ๊ต 1.8กล่อง/ชม.')}
            className="px-space-md py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
          >
            ดูการคำนวณวันหมดสต็อก
          </button>
          <button
            type="button"
            onClick={() => showToast('สร้างใบสั่งซื้อด่วน PO-202410-091 ส่งเข้าอีเมล Supplier เรียบร้อยแล้ว')}
            className="px-space-md py-2 rounded-lg bg-error hover:bg-error/90 text-on-error font-label-md text-label-md shadow-xs transition-all active:scale-95"
          >
            สร้างใบสั่งซื้อด่วน (Quick PO)
          </button>
        </div>
      </div>

      {/* Main 2-Zone Matrix: 65% Table & Filter, 35% BOM Recipe Engine */}
      <div className="flex flex-col xl:flex-row gap-space-md items-start">
        {/* Left 65%: Filter Bar & Interactive Inventory Table */}
        <div className="w-full xl:w-[65%] flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs">
          {/* Filter Pill Tabs */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'วัตถุดิบทั้งหมด (48)' },
              { id: 'beans', label: 'เมล็ดกาแฟ (6)' },
              { id: 'dairy', label: 'นม & ทางเลือกนม (8)' },
              { id: 'tea', label: 'ชา & ผงเครื่องดื่ม (12)' },
              { id: 'syrup', label: 'ไซรัป & ท็อปปิ้ง (10)' },
              { id: 'packaging', label: 'บรรจุภัณฑ์แก้ว/หลอด (12)' },
            ].map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Filter Dropdowns Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อวัตถุดิบ หรือ รหัส SKU..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm placeholder:text-outline border border-surface-container focus:outline-none"
              />
            </div>
            <div>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm border border-surface-container focus:outline-none"
              >
                <option value="all">ผู้จัดจำหน่ายทั้งหมด (Suppliers)</option>
                <option value="Pacamara Coffee Roasters">Pacamara Coffee Roasters</option>
                <option value="Oatly Thailand Dist.">Oatly Thailand Dist.</option>
                <option value="Peace Oriental Matcha Supply">Peace Oriental Matcha Supply</option>
                <option value="CP-Meiji">CP-Meiji</option>
                <option value="EcoPack TH">EcoPack TH</option>
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm border border-surface-container focus:outline-none"
              >
                <option value="all">สถานะสต็อกทั้งหมด</option>
                <option value="low">ใกล้หมด / วิกฤต (Low)</option>
                <option value="normal">ปกติ (Normal)</option>
              </select>
            </div>
          </div>

          {/* Interactive Inventory Table */}
          <div className="overflow-x-auto rounded-xl border border-surface-container mt-1">
            <table className="w-full text-left border-collapse font-body-sm text-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface font-label-md text-label-md border-b border-surface-container-high">
                  <th className="py-3 px-3">SKU / ชื่อวัตถุดิบ</th>
                  <th className="py-3 px-3">ระดับคงเหลือ / Par Level</th>
                  <th className="py-3 px-3">สถานะ</th>
                  <th className="py-3 px-3 text-right">ต้นทุน/หน่วย</th>
                  <th className="py-3 px-3 text-right">ตัดขายวันนี้</th>
                  <th className="py-3 px-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
                          <span>{item.sku}</span>
                          <span>•</span>
                          <span>{item.supplier}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 min-w-[150px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className={item.status === 'low' ? 'text-error' : 'text-on-surface'}>
                            {item.currentStock} {item.unit}
                          </span>
                          <span className="text-on-surface-variant">
                            / {item.maxParStock} {item.unit}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === 'low' ? 'bg-error' : 'bg-secondary'
                            }`}
                            style={{ width: `${Math.min(100, item.parPercentage)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {item.status === 'low' ? (
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-bold inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">warning</span>
                          วิกฤตสต็อกต่ำ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          ปกติ
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface">
                      ฿{item.unitCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-primary font-semibold">
                      -{item.usedToday} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAdjustingItem(item);
                            setAdjustAmount('5');
                          }}
                          title="ปรับปรุงสต็อก"
                          className="p-1.5 rounded-lg hover:bg-surface-container text-primary hover:text-primary-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">tune</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickReorder(item)}
                          title="สั่งซื้อซ้ำด่วน"
                          className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-on-secondary-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination Info */}
          <div className="flex items-center justify-between pt-2 text-xs text-on-surface-variant font-label-sm">
            <span>แสดง 1 - {filteredItems.length} จากทั้งหมด {items.length} รายการ</span>
            <div className="flex items-center gap-1">
              <button type="button" className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high">
                ก่อนหน้า
              </button>
              <button type="button" className="px-2.5 py-1 rounded bg-primary text-on-primary">
                1
              </button>
              <button type="button" className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high">
                ถัดไป
              </button>
            </div>
          </div>
        </div>

        {/* Right 35%: BOM & Recipe Engine Card + Delivery Tracker */}
        <div className="w-full xl:w-[35%] flex flex-col gap-space-md">
          {/* Card 1: BOM Recipe Engine Showcase */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">menu_book</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  สูตรชงมาตรฐาน & ตัดสต็อก (BOM)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Active Sync
              </span>
            </div>

            {/* Menu Drink Preview */}
            <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
              <img
                src={ASSETS.drinks.matchaBom}
                alt="Matcha Latte"
                className="w-14 h-14 rounded-lg object-cover ring-1 ring-surface-container-high"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Iced Matcha Latte (16 oz)
                </span>
                <span className="text-xs text-on-surface-variant">
                  หมวด: ชา & มัทฉะ • ราคาขาย: ฿85.00
                </span>
              </div>
            </div>

            {/* Ingredient Deductions Breakdown */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                รายการวัตถุดิบที่จะตัดสต็อกอัตโนมัติต่อ 1 แก้ว:
              </span>

              {BOM_MATCHA_INGREDIENTS.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/60 hover:bg-surface-container transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[18px] ${ing.iconColor}`}>
                      {ing.icon}
                    </span>
                    <span className="font-medium text-on-surface">{ing.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-error font-semibold">{ing.amount}</span>
                    <span className="text-on-surface-variant">฿{ing.cost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Ingredient Cost vs Gross Margin */}
            <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between mt-1">
              <div>
                <span className="text-xs text-on-surface-variant block">ต้นทุนวัตถุดิบรวม (COGS)</span>
                <span className="font-headline-md text-headline-md text-primary font-mono">฿32.40</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant block">อัตรากำไรขั้นต้น (Margin)</span>
                <span className="font-headline-md text-headline-md text-secondary font-mono">61.9%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('เปิดการตั้งค่าตัดยอด Modifier (เช่น เปลี่ยนเป็น Oat Milk ตัด Oatly 180ml)')}
              className="w-full py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">schema</span>
              <span>ปรับแต่งสูตรการตัดยอด & ตัวเลือก Modifier</span>
            </button>
          </div>

          {/* Card 2: Today's Pending PO Deliveries */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  สถานะการจัดส่งรอบบ่าย (PO Deliveries)
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-secondary font-mono">PO-202410-089</span>
                  <span className="text-secondary font-medium">กำลังจัดส่ง (14:30 น.)</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface">
                  Oatly Barista Edition (12 ลัง) • Oatly Thailand
                </p>
                <button
                  type="button"
                  onClick={() => showToast('รับเข้าคลังและปรับยอดสต็อก Oatly +12 ลัง สำเร็จ')}
                  className="mt-1 text-xs text-secondary font-bold hover:underline text-left inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">inventory</span>
                  <span>ตรวจรับเข้าคลัง</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface font-mono">PO-202410-090</span>
                  <span className="text-on-surface-variant font-medium">ยืนยันแล้ว (17:00 น.)</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface">
                  แก้วใส PET 16oz (2,000 ใบ) • EcoPack TH
                </p>
                <button
                  type="button"
                  onClick={() => showToast('เปิดดูเอกสารใบสั่งซื้อ PO-202410-090')}
                  className="mt-1 text-xs text-primary font-bold hover:underline text-left inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">description</span>
                  <span>ดูรายละเอียด</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Inventory Modal */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* Adjust Stock Level Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <span className="font-headline-md text-headline-md text-on-surface">
                ปรับปรุงสต็อก (Stock Count)
              </span>
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="w-7 h-7 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-on-surface">{adjustingItem.name}</p>
              <p className="text-on-surface-variant text-xs mt-0.5">
                สต็อกปัจจุบัน: {adjustingItem.currentStock} {adjustingItem.unit}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                จำนวนที่ต้องการเพิ่ม/ปรับเข้า (+ {adjustingItem.unit}):
              </label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="เช่น 5"
                className="px-3 py-2 bg-surface-container-low rounded-lg border border-surface-container font-headline-sm text-headline-sm text-on-surface focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveStockAdjustment}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-sm"
              >
                บันทึกการปรับปรุง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
