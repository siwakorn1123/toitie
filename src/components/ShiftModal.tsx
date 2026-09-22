import React, { useState } from 'react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  todaySales: number;
  completedDrinks: number;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({
  isOpen,
  onClose,
  todaySales,
  completedDrinks,
}) => {
  const [openingCash, setOpeningCash] = useState<number>(3000);
  const [closingCash, setClosingCash] = useState<string>('8411');
  const [shiftClosed, setShiftClosed] = useState<boolean>(false);

  if (!isOpen) return null;

  const cashSales = 5411; // Cash sales for the day
  const promptPaySales = 23963;
  const cardSales = 9276;
  const expectedTotalCashInDrawer = openingCash + cashSales;
  const actualCash = parseFloat(closingCash) || 0;
  const cashDifference = actualCash - expectedTotalCashInDrawer;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">point_of_sale</span>
            <span className="font-headline-md text-headline-md text-on-surface">
              สรุปยอดกะแคชเชียร์ (Shift Closeout)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {shiftClosed ? (
          <div className="p-space-md bg-secondary/10 rounded-xl text-center space-y-2">
            <span className="material-symbols-outlined text-secondary text-[40px]">check_circle</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">ปิดยอดกะประจำวันเรียบร้อย</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              ระบบส่งรายงานสรุปยอดไปยังอีเมลผู้จัดการร้านและซิงค์คลาวด์แล้ว
            </p>
            <button
              onClick={() => {
                setShiftClosed(false);
                onClose();
              }}
              className="mt-3 px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm"
              type="button"
            >
              ตกลง
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-space-md">
            {/* Shift Overview */}
            <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-sm rounded-xl">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">เวลาเริ่มกะ</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">07:30 น.</p>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">ผู้รับผิดชอบ</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">คุณนิรันดร์ (Manager)</p>
              </div>
            </div>

            {/* Sales Summary Table */}
            <div className="flex flex-col gap-1.5 font-body-sm text-body-sm border border-surface-container rounded-xl p-space-sm">
              <div className="flex justify-between py-1 border-b border-surface-container/60 text-on-surface">
                <span>เงินสดตั้งต้น (Cash Float)</span>
                <span className="font-mono">฿{openingCash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-on-surface">
                <span>ยอดขายเงินสด (Cash Sales)</span>
                <span className="font-mono text-tertiary-container font-semibold">+฿{cashSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-on-surface">
                <span>สแกน PromptPay QR</span>
                <span className="font-mono text-primary">+฿{promptPaySales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-on-surface">
                <span>บัตรเครดิต / EDC</span>
                <span className="font-mono text-secondary">+฿{cardSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-t border-surface-container-high font-semibold text-on-surface text-base">
                <span>ยอดขายรวมสุทธิ</span>
                <span className="text-primary font-mono">฿{todaySales.toLocaleString()}</span>
              </div>
            </div>

            {/* Cash Drawer Reconciliation */}
            <div className="flex flex-col gap-2 bg-surface-container-lowest p-space-sm rounded-xl border border-primary/20">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
                <span>เงินสดที่นับได้จริงในลิ้นชัก (Actual Cash):</span>
                <span className="text-xs text-on-surface-variant">
                  ควรมี: ฿{expectedTotalCashInDrawer.toLocaleString()}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">฿</span>
                <input
                  type="number"
                  value={closingCash}
                  onChange={(e) => setClosingCash(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-surface-container-low rounded-lg font-headline-sm text-headline-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-on-surface-variant">ส่วนต่างเงินสด (Variance):</span>
                <span
                  className={`font-bold ${
                    cashDifference === 0
                      ? 'text-secondary'
                      : cashDifference > 0
                      ? 'text-primary'
                      : 'text-error'
                  }`}
                >
                  {cashDifference === 0
                    ? 'ตรงตามระบบ (฿0)'
                    : cashDifference > 0
                    ? `เกิน +฿${cashDifference.toLocaleString()}`
                    : `ขาด ฿${cashDifference.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => setShiftClosed(true)}
                className="px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all"
              >
                ยืนยันปิดกะและพิมพ์สรุป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
