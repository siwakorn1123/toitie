import React, { useState } from 'react';
import { TabType, KdsOrder } from './types';
import { INITIAL_KDS_ORDERS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ShiftModal } from './components/ShiftModal';
import { NotificationModal } from './components/NotificationModal';
import { PosRegister } from './components/pos/PosRegister';
import { KdsDisplay } from './components/kds/KdsDisplay';
import { InventoryStock } from './components/inventory/InventoryStock';
import { SalesAnalytics } from './components/analytics/SalesAnalytics';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('pos-register');
  const [todaySales, setTodaySales] = useState<number>(18450);
  const [completedDrinks, setCompletedDrinks] = useState<number>(142);
  const [kdsOrders, setKdsOrders] = useState<KdsOrder[]>(INITIAL_KDS_ORDERS);

  // Modals state
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // When a POS order is successfully checked out
  const handleOrderCompleted = (newOrder: KdsOrder, totalAmount: number) => {
    setTodaySales((prev) => prev + Math.round(totalAmount));
    const cupsInOrder = newOrder.items.length;
    setKdsOrders((prev) => [newOrder, ...prev]);
  };

  // KDS Status Transitions
  const handleUpdateOrderStatus = (orderId: string, nextStatus: KdsOrder['status']) => {
    setKdsOrders((prev) =>
      prev
        .map((order) => {
          if (order.id === orderId) {
            if (nextStatus === 'ready') {
              setCompletedDrinks((c) => c + order.items.length);
            }
            if (nextStatus === 'handed-over') {
              // Archive order when handed over
              return null;
            }
            return {
              ...order,
              status: nextStatus,
              isOverdue: false,
              items:
                nextStatus === 'ready'
                  ? order.items.map((it) => ({ ...it, completed: true }))
                  : order.items,
            };
          }
          return order;
        })
        .filter(Boolean) as KdsOrder[]
    );
  };

  // Toggle checklist item within a KDS order
  const handleToggleItemComplete = (orderId: string, itemId: string) => {
    setKdsOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((it) =>
            it.id === itemId ? { ...it, completed: !it.completed } : it
          );
          const allDone = updatedItems.every((it) => it.completed);
          return {
            ...order,
            items: updatedItems,
            status: allDone ? 'ready' : 'in-progress',
          };
        }
        return order;
      })
    );
  };

  const pendingQueueCount = kdsOrders.filter(
    (o) => o.status === 'pending' || o.status === 'in-progress'
  ).length;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary">
      {/* Persistent Left Navigation Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Persistent Top Header */}
      <TopHeader
        todaySales={todaySales}
        completedDrinks={completedDrinks}
        pendingQueue={pendingQueueCount}
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Main Content Area: Offset by sidebar (left 64) and header (top 16) */}
      <main className="ml-64 pt-16 min-h-screen w-[calc(100%-16rem)] overflow-y-auto">
        {currentTab === 'pos-register' && (
          <PosRegister onOrderCompleted={handleOrderCompleted} />
        )}

        {currentTab === 'kds-display' && (
          <KdsDisplay
            orders={kdsOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleItemComplete={handleToggleItemComplete}
          />
        )}

        {currentTab === 'inventory-stock' && <InventoryStock />}

        {currentTab === 'sales-analytics' && <SalesAnalytics />}
      </main>

      {/* Shift Open / Closeout Modal */}
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        todaySales={todaySales}
        completedDrinks={completedDrinks}
      />

      {/* Notifications Drawer / Popover */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
};

export default App;
