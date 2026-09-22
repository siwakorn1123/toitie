import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'PromptPay QR' | 'Cash' | 'Credit Card / EDC' | null;
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  method,
  totalAmount,
  onPaymentSuccess,
}) => {
  const [tenderedCash, setTenderedCash] = useState<string>('500');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !method) return null;

  const cashReceived = parseFloat(tenderedCash) || 0;
  const changeDue = Math.max(0, cashReceived - totalAmount);

  const handleQuickCash = (amount: number) => {
    setTenderedCash(amount.toString());
  };

  const handleNumpad = (digit: string) => {
    if (digit === 'C') {
      setTenderedCash('');
    } else if (digit === '←') {
      setTenderedCash((prev) => prev.slice(0, -1));
    } else {
      setTenderedCash((prev) => (prev === '0' ? digit : prev + digit));
    }
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">
              {method === 'PromptPay QR'
                ? 'qr_code_scanner'
                : method === 'Cash'
                ? 'payments'
                : 'credit_card'}
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              {method === 'PromptPay QR'
                ? 'สแกนชำระ PromptPay QR'
                : method === 'Cash'
                ? 'รับชำระเงินสด (Cash)'
                : 'เครื่องรูดบัตร EDC / บัตรเครดิต'}
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

        {/* Total Amount Display */}
        <div className="bg-surface-container-low p-space-md rounded-xl text-center flex flex-col items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">ยอดที่ต้องชำระ (Total Due)</span>
          <div className="font-display-lg text-display-lg text-primary mt-0.5">
            ฿{totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Method-Specific Content */}
        {method === 'PromptPay QR' && (
          <div className="flex flex-col items-center gap-space-sm py-2">
            <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-secondary flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                <span>PromptPay</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>BrewCraft POS</span>
              </div>
              {/* Scalable SVG Thai QR Code Mock */}
              <div className="w-48 h-48 bg-gray-900 rounded-lg p-3 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                  <path d="M40,10 h10 v10 h-10 z M50,20 h10 v10 h-10 z M35,40 h20 v10 h-20 z M65,40 h15 v20 h-15 z M40,65 h10 v20 h-10 z M55,80 h25 v10 h-25 z" />
                  <path d="M45,45 h10 v10 h-10 z" fill="#006c4a" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-500 mt-2 font-mono">BKK-PROMPT-084-38039</span>
            </div>
            <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>กำลังรอสัญญาณโอนเงินจากธนาคาร...</span>
            </div>
          </div>
        )}

        {method === 'Cash' && (
          <div className="flex flex-col gap-space-sm">
            {/* Quick cash pills */}
            <div className="grid grid-cols-4 gap-1.5">
              {[Math.ceil(totalAmount), 400, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickCash(val)}
                  className="py-1.5 px-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface font-label-md text-label-md text-center transition-colors"
                >
                  ฿{val}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">฿</span>
              <input
                type="text"
                readOnly
                value={tenderedCash}
                className="w-full pl-8 pr-4 py-2.5 bg-surface-container-low rounded-xl font-headline-lg text-headline-lg text-right text-on-surface focus:outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Change Due Display */}
            <div className="flex justify-between items-center bg-secondary/10 px-space-md py-2 rounded-xl border border-secondary/20">
              <span className="font-label-md text-label-md text-on-surface">เงินทอน (Change Due):</span>
              <span className="font-headline-lg text-headline-lg text-secondary font-mono">
                ฿{changeDue.toFixed(2)}
              </span>
            </div>

            {/* Compact Numeric Pad */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleNumpad(key)}
                  className="h-10 bg-surface-container hover:bg-surface-container-high active:scale-95 rounded-lg text-on-surface font-headline-sm text-headline-sm flex items-center justify-center transition-all shadow-xs"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}

        {method === 'Credit Card / EDC' && (
          <div className="flex flex-col items-center gap-space-md py-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary-fixed/30 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">contactless</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">แตะ หรือ เสียบบัตรที่เครื่อง EDC</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                รองรับ Visa, Mastercard, JCB, Thai QR Credit และ Apple Pay
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-space-sm pt-space-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-label-lg text-label-lg transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={isProcessing || (method === 'Cash' && cashReceived < totalAmount)}
            onClick={handleComplete}
            className="flex-1 py-2.5 bg-secondary hover:bg-on-secondary-container text-on-secondary rounded-xl font-headline-sm text-headline-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>กำลังประมวลผล...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>ยืนยันรับชำระ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
