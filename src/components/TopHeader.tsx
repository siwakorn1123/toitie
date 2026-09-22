import React, { useState } from 'react';

interface TopHeaderProps {
  todaySales: number;
  completedDrinks: number;
  pendingQueue: number;
  onOpenShiftModal: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  todaySales,
  completedDrinks,
  pendingQueue,
  onOpenShiftModal,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      {/* Live Stats Strip */}
      <div className="flex items-center gap-space-md overflow-x-auto py-1 no-scrollbar">
        <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low shadow-xs shrink-0">
          <span className="font-label-sm text-label-sm text-on-surface-variant">ยอดขายวันนี้:</span>
          <span className="font-headline-sm text-headline-sm text-primary">
            ฿{todaySales.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low shadow-xs shrink-0">
          <span className="font-label-sm text-label-sm text-on-surface-variant">ออเดอร์สำเร็จ:</span>
          <span className="font-label-lg text-label-lg text-secondary">
            {completedDrinks} แก้ว
          </span>
        </div>
        <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low shadow-xs shrink-0">
          <span className="font-label-sm text-label-sm text-on-surface-variant">รอดำเนินการ:</span>
          <span className="font-label-lg text-label-lg text-tertiary-container">
            {pendingQueue} คิว
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md shrink-0">
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          type="button"
          title="การแจ้งเตือน"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
          )}
        </button>

        <button
          onClick={onOpenShiftModal}
          className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">schedule</span>
          <span className="font-label-md text-label-md whitespace-nowrap">
            เปิดกะ / ปิดยอด
          </span>
        </button>
      </div>
    </header>
  );
};
