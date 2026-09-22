import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      type: 'urgent',
      icon: 'crisis_alert',
      title: 'แจ้งเตือนวัตถุดิบวิกฤต (Critical Low)',
      message: 'เมล็ดกาแฟ House Blend เหลือ 3.5 กก. และนมโอ๊ตเหลือ 8 กล่อง ใกล้จุดสั่งซื้อซ้ำ',
      time: '5 นาทีที่แล้ว',
      actionTab: 'inventory-stock',
      actionText: 'ดูคลังสต็อก',
    },
    {
      id: 'notif-2',
      type: 'delivery',
      icon: 'two_wheeler',
      title: 'ไรเดอร์ GrabFood มาถึงแล้ว (#GF-9921)',
      message: 'ออเดอร์ #A-078 (Thai Tea 4 แก้ว) คนขับ สุทธิชัย ร. รอรับหน้าร้าน',
      time: '8 นาทีที่แล้ว',
      actionTab: 'kds-display',
      actionText: 'ดูหน้าจอบาร์',
    },
    {
      id: 'notif-3',
      type: 'info',
      icon: 'schedule',
      title: 'ช่วงเวลาเร่งด่วน Morning Rush สำเร็จ',
      message: 'ยอดขายช่วง 08:00 - 09:30 รวม 128 แก้ว เร็วกว่าค่าเฉลี่ย 18 วินาที',
      time: '1 ชั่วโมงที่แล้ว',
      actionTab: 'sales-analytics',
      actionText: 'ดูรายงานยอดขาย',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-space-md shadow-2xl flex flex-col gap-space-sm border border-surface-container-high mt-14">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">การแจ้งเตือนสด</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto no-scrollbar">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                item.type === 'urgent'
                  ? 'bg-error-container/20 border-error/30'
                  : item.type === 'delivery'
                  ? 'bg-secondary-fixed/20 border-secondary/30'
                  : 'bg-surface-container-low border-surface-container'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-label-sm text-label-sm font-bold flex items-center gap-1 ${
                    item.type === 'urgent'
                      ? 'text-error'
                      : item.type === 'delivery'
                      ? 'text-secondary'
                      : 'text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  {item.title}
                </span>
                <span className="text-[10px] text-on-surface-variant">{item.time}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-tight">{item.message}</p>
              {onNavigateToTab && item.actionTab && (
                <button
                  onClick={() => {
                    onNavigateToTab(item.actionTab);
                    onClose();
                  }}
                  className="mt-1 text-xs text-primary font-semibold hover:underline text-left inline-flex items-center gap-0.5"
                  type="button"
                >
                  <span>{item.actionText}</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
