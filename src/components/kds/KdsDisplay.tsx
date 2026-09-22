import React, { useState, useEffect } from 'react';
import { KdsOrder } from '../../types';

interface KdsDisplayProps {
  orders: KdsOrder[];
  onUpdateOrderStatus: (orderId: string, nextStatus: KdsOrder['status']) => void;
  onToggleItemComplete: (orderId: string, itemId: string) => void;
  onRecallLastOrder?: () => void;
}

export const KdsDisplay: React.FC<KdsDisplayProps> = ({
  orders,
  onUpdateOrderStatus,
  onToggleItemComplete,
  onRecallLastOrder,
}) => {
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showRecallModal, setShowRecallModal] = useState<boolean>(false);
  const [recalledOrders, setRecalledOrders] = useState<string[]>([
    '#A-077 (Iced Espresso x2 • สำเร็จ 07:42)',
    '#A-076 (Dirty Coffee x1 • สำเร็จ 07:38)',
    '#A-075 (Matcha Latte x3 • สำเร็จ 07:35)',
  ]);

  // Audio chime using Web Audio API
  const playChime = () => {
    if (audioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio context may require gesture or fail in test environment
    }
  };

  const toggleAudio = () => {
    setAudioMuted((prev) => {
      const next = !prev;
      if (!next) playChime();
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStation === 'all') return true;
    return order.station === selectedStation;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const inProgressCount = orders.filter((o) => o.status === 'in-progress').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="flex flex-col w-full px-space-lg py-space-md space-y-space-md">
      {/* Sub-Header: Station Filter & KDS Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-xl shadow-xs border border-surface-container">
        {/* Queue KPI Metrics */}
        <div className="flex items-center flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest shadow-xs border border-surface-container/60">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-ping"></span>
            <span className="font-label-md text-label-md text-on-surface-variant">รอชง (Pending):</span>
            <span className="font-headline-sm text-headline-sm text-tertiary">{pendingCount} บิล</span>
          </div>

          <div className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest shadow-xs border border-surface-container/60">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
            <span className="font-label-md text-label-md text-on-surface-variant">กำลังชง (In Progress):</span>
            <span className="font-headline-sm text-headline-sm text-primary">{inProgressCount} บิล</span>
          </div>

          <div className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest shadow-xs border border-surface-container/60">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-md text-label-md text-on-surface-variant">พร้อมเสิร์ฟ (Ready):</span>
            <span className="font-headline-sm text-headline-sm text-secondary">{readyCount} บิล</span>
          </div>

          <div className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-highest/60 border border-surface-container">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">pace</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">เวลารอเฉลี่ย:</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">4.2 น.</span>
          </div>
        </div>

        {/* Station Controls & Quick Tools */}
        <div className="flex items-center gap-space-sm">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface shadow-xs hover:bg-surface-container-high transition-colors border border-surface-container/60"
            type="button"
          >
            <span className={`material-symbols-outlined text-[20px] ${audioMuted ? 'text-error' : 'text-secondary'}`}>
              {audioMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span className="font-label-md text-label-md whitespace-nowrap">
              เสียงแจ้งเตือน: {audioMuted ? 'ปิด' : 'เปิด'}
            </span>
          </button>

          {/* Order Recall History */}
          <button
            onClick={() => setShowRecallModal(true)}
            className="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface shadow-xs hover:bg-surface-container-high transition-colors border border-surface-container/60"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">history</span>
            <span className="font-label-md text-label-md whitespace-nowrap">เรียกคืนบิลล่าสุด</span>
          </button>

          {/* Density/Zoom View */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center p-2 rounded-lg bg-surface-container-lowest text-on-surface shadow-xs hover:bg-surface-container-high transition-colors border border-surface-container/60"
            title="ขยายมุมมองตั๋ว"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {/* Station Filter Pill Tabs */}
      <div className="flex items-center justify-between gap-space-md pb-1 border-none">
        <div className="flex items-center gap-space-xs overflow-x-auto py-1 no-scrollbar">
          {[
            { id: 'all', label: 'ทั้งหมด (All Stations)', count: orders.length },
            { id: 'espresso', label: 'เอสเปรสโซบาร์ (Espresso)', icon: 'coffee_maker', count: 7, color: 'text-primary' },
            { id: 'slowbar', label: 'สโลว์บาร์ & ชา (Slowbar/Tea)', icon: 'emoji_food_beverage', count: 3, color: 'text-secondary' },
            { id: 'blender', label: 'สมูทตี้ & ขนม (Blender & Bakery)', icon: 'bakery_dining', count: 2, color: 'text-tertiary' },
          ].map((tab) => {
            const isSelected = selectedStation === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStation(tab.id)}
                className={`px-space-md py-2 rounded-full font-label-lg text-label-lg transition-colors flex items-center gap-1.5 shadow-xs ${
                  isSelected
                    ? 'bg-inverse-surface text-inverse-on-surface'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
                type="button"
              >
                {tab.icon && (
                  <span className={`material-symbols-outlined text-[18px] ${tab.color}`}>
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] ${
                    isSelected ? 'bg-surface-container-highest/30 text-surface-bright' : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
          <span>เกิน 5 นาทีเตือนสีแดง</span>
        </div>
      </div>

      {/* KDS Multi-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md items-start">
        {filteredOrders.map((order) => {
          const isUrgent = order.isOverdue || order.elapsedSeconds > 300;
          const completedCount = order.items.filter((it) => it.completed).length;
          const progressPercent = Math.round((completedCount / (order.items.length || 1)) * 100);

          return (
            <div
              key={order.id}
              className={`flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl border ${
                isUrgent ? 'border-error/40 ring-1 ring-error/20' : 'border-surface-container'
              }`}
            >
              {/* Header based on status / urgency */}
              {isUrgent ? (
                /* Card 1: Urgent Overdue Header */
                <div className="bg-error-container text-on-error-container px-space-md py-3 flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-error animate-bounce">warning</span>
                    <span className="font-headline-sm text-headline-sm text-error">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-error text-on-error">
                      {order.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-label-lg text-label-lg text-error font-mono font-bold">
                    <span className="material-symbols-outlined text-[18px]">timer</span>
                    <span>{formatTimer(order.elapsedSeconds)}</span>
                  </div>
                </div>
              ) : order.status === 'in-progress' ? (
                /* Card 2: Brewing / In Progress Header */
                <div className="bg-primary text-on-primary px-space-md py-3 flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-primary">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-on-primary/20 text-on-primary">
                      {order.type} {order.tableOrChannel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-label-lg text-label-lg text-on-primary font-mono">
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>{formatTimer(order.elapsedSeconds)}</span>
                  </div>
                </div>
              ) : order.status === 'ready' ? (
                /* Card 4: Ready Header */
                <div className="bg-secondary text-on-secondary px-space-md py-3 flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-secondary">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-on-secondary text-secondary font-bold">
                      {order.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-label-lg text-label-lg text-secondary-fixed">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>เสร็จแล้ว</span>
                  </div>
                </div>
              ) : (
                /* Card 3: New Order Header */
                <div className="bg-surface-container-highest text-on-surface px-space-md py-3 flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-surface-container-low text-on-surface-variant">
                      {order.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-label-lg text-label-lg text-secondary font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                    <span>{formatTimer(order.elapsedSeconds)}</span>
                  </div>
                </div>
              )}

              {/* Subbar metadata */}
              {isUrgent && order.urgentNote && (
                <div className="px-space-md py-2 bg-surface-container-low flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">phone_in_talk</span> โทรสั่งล่วงหน้า (รับด่วน)
                  </span>
                  <span className="font-label-sm text-label-sm text-error font-bold">เกินกำหนด 3 นาที</span>
                </div>
              )}

              {order.status === 'in-progress' && (
                <>
                  <div className="px-space-md py-2 bg-surface-container-low flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      กำลังปรุง: {order.baristaName || 'บาริสต้าตูน'}
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold text-primary">
                      ความคืบหน้า {completedCount}/{order.items.length}
                    </span>
                  </div>
                  {/* Linear Micro Progress Indicator */}
                  <div className="w-full bg-surface-container-high h-1.5">
                    <div
                      className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </>
              )}

              {order.status === 'pending' && !isUrgent && (
                <div className="px-space-md py-2 bg-surface-container-low flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {order.tableOrChannel || 'เคาน์เตอร์ POS #01'}
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold text-secondary">
                    ออเดอร์ใหม่
                  </span>
                </div>
              )}

              {order.riderInfo && (
                <div className="px-space-md py-2.5 bg-secondary-fixed text-on-secondary-fixed flex items-center gap-space-xs font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                  <span className="font-bold">{order.riderInfo.status}</span>
                </div>
              )}

              {/* Order Items List / Interactive Checklist */}
              <div className="p-space-md space-y-space-sm flex-1">
                {order.items.map((item) => {
                  return (
                    <label
                      key={item.id}
                      onClick={() => onToggleItemComplete(order.id, item.id)}
                      className={`flex items-start gap-space-sm p-space-sm rounded-lg cursor-pointer select-none transition-colors border ${
                        item.completed
                          ? 'bg-secondary/10 border-secondary/20'
                          : isUrgent
                          ? 'bg-error-container/20 border-error/20'
                          : 'bg-surface-container-low border-surface-container/60 hover:bg-surface-container'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="mt-1 w-5 h-5 rounded accent-secondary cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-space-xs">
                          <span
                            className={`font-headline-sm text-headline-sm ${
                              item.completed
                                ? 'line-through text-on-surface-variant'
                                : 'text-on-surface'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.statusTag && (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${item.tagColor || 'bg-error text-on-error'}`}>
                              {item.statusTag}
                            </span>
                          )}
                        </div>
                        <p
                          className={`font-label-sm text-label-sm mt-0.5 ${
                            item.completed
                              ? 'text-on-surface-variant/80'
                              : isUrgent
                              ? 'text-error font-semibold'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {item.note}
                        </p>
                      </div>
                      {item.completed ? (
                        <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      ) : item.icon === 'hourglass_top' || item.name.includes('Croissant') ? (
                        <span className="material-symbols-outlined text-tertiary text-[20px] animate-pulse">hourglass_top</span>
                      ) : null}
                    </label>
                  );
                })}

                {/* Additional Rider delivery summary card if applicable */}
                {order.riderInfo && (
                  <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                    <span>รหัส Grab: {order.riderInfo.code}</span>
                    <span>คนขับ: {order.riderInfo.name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons at bottom of card */}
              <div className="p-space-md bg-surface-container-low/50 border-t border-surface-container">
                {isUrgent ? (
                  <div className="grid grid-cols-2 gap-space-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(order.id, 'in-progress')}
                      className="h-12 flex items-center justify-center gap-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                      <span>เริ่มชงบิลนี้</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                      className="h-12 flex items-center justify-center gap-1 rounded-lg bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md shadow-xs active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      <span>เสร็จสิ้น (Ready)</span>
                    </button>
                  </div>
                ) : order.status === 'in-progress' ? (
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>เสร็จสิ้นทั้งหมด (Complete)</span>
                  </button>
                ) : order.status === 'ready' ? (
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(order.id, 'handed-over')}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-secondary hover:bg-on-secondary-container text-on-secondary font-headline-sm text-headline-sm shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[22px]">delivery_dining</span>
                    <span>ส่งมอบสำเร็จ (Handed Over)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(order.id, 'in-progress')}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-inverse-surface hover:bg-on-background text-inverse-on-surface font-headline-sm text-headline-sm shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                    <span>รับออเดอร์เข้าบาร์</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Recall History Modal */}
      {showRecallModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md border border-surface-container-high">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">history</span>
                <span className="font-headline-md text-headline-md text-on-surface">ประวัติบิลที่ทำเสร็จแล้ว</span>
              </div>
              <button
                onClick={() => setShowRecallModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {recalledOrders.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors"
                >
                  <span className="font-label-md text-label-md text-on-surface">{rec}</span>
                  <button
                    onClick={() => {
                      alert(`ดึงบิล ${rec} กลับมายังหน้าจอบาร์เรียบร้อย`);
                      setShowRecallModal(false);
                    }}
                    className="text-xs text-primary font-semibold hover:underline"
                    type="button"
                  >
                    ดึงกลับมา
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
