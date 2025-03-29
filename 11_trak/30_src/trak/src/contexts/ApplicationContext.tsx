'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { TicketStore, useTicketStore } from './features/ticketStore';
import { TicketSortStore, useTicketSortStore } from './features/ticketSortStore';

import { SlidePanelStore, useSlidePanel } from './ui/slidePanel';
import { PreferencesStore, usePreferencesStore } from './features/preferencesStore';

// コンテキストの型定義
interface ApplicationContextType {
  ticketStore: TicketStore;
  ticketSortStore: TicketSortStore;
  slidePanelStore: SlidePanelStore;
  preferencesStore: PreferencesStore;
}
const ApplicationContext = createContext<ApplicationContextType | null>(null);

interface ApplicationProviderProps {
  children: ReactNode;
  initialTicketId?: string;
}

// プロバイダーコンポーネント
export const ApplicationProvider = ({ children, initialTicketId }: ApplicationProviderProps) => {
  // チケット機能を使用
  const ticketStore = useTicketStore();
  const ticketSortStore = useTicketSortStore();
  const slidePanelStore = useSlidePanel(initialTicketId);
  const preferencesStore = usePreferencesStore();

  // アプリ起動時にチケットを取得
  useEffect(() => {
    preferencesStore.fetchPreferences();
    ticketStore.fetchTickets();
    ticketSortStore.fetchSortOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    ticketStore,        // チケット関連
    ticketSortStore,    // チケットソート関連
    slidePanelStore,    // スライドパネル関連
    preferencesStore, // ユーザー設定関連
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
};

// カスタムフック
export const useApplication = () => {
  const context = useContext(ApplicationContext);
  
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  
  return context;
};
