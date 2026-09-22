import React from 'react';
import { TabType } from '../types';
import { ASSETS } from '../data/mockData';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'pos-register', label: 'จุดขายแคชเชียร์', icon: 'point_of_sale' },
    { id: 'kds-display', label: 'หน้าจอบาร์ & คิว', icon: 'coffee' },
    { id: 'inventory-stock', label: 'คลังวัตถุดิบ & สูตรชง', icon: 'inventory_2' },
    { id: 'sales-analytics', label: 'รายงานยอดขาย', icon: 'analytics' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-inverse-surface text-inverse-on-surface z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-lowest/5 border-b border-surface-container-lowest/10">
          <img
            alt="BrewCraft POS Logo"
            className="h-8 w-auto object-contain"
            src={ASSETS.logo}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-surface-container-lowest tracking-tight truncate">
              BrewCraft POS
            </span>
            <span className="font-label-sm text-label-sm text-surface-variant/70 truncate">
              สาขาสยามสแควร์
            </span>
          </div>
        </div>

        {/* Active Shift Badge */}
        <div className="px-space-md py-space-sm">
          <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-secondary/20 text-secondary-fixed border border-secondary/30">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
            <span className="font-label-sm text-label-sm tracking-wide">
              เปิดกะ: 07:30 - ปัจจุบัน
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5 px-space-sm mt-space-xs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-space-sm px-space-md py-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-headline-sm shadow-sm'
                    : 'text-surface-container-high/80 hover:bg-surface-container-lowest/10 hover:text-surface-container-lowest'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px] shrink-0">
                  {item.icon}
                </span>
                <span className="font-label-lg text-label-lg whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Sync Status */}
      <div className="p-space-md bg-surface-container-lowest/5 flex flex-col gap-space-sm border-t border-surface-container-lowest/10">
        <div className="flex items-center gap-space-sm">
          <img
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-container shrink-0"
            src={ASSETS.profile}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-surface-container-lowest truncate">
              คุณนิรันดร์
            </span>
            <span className="font-label-sm text-label-sm text-surface-variant/70 truncate">
              Store Manager
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-surface-variant/60 font-label-sm text-label-sm pt-space-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-secondary-fixed">wifi</span>
            <span>ออนไลน์ คลาวด์ซิงค์</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping"></span>
        </div>
      </div>
    </aside>
  );
};
