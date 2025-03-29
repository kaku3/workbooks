'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import type { TicketData } from '@/types';
import { useTicketManagement, useTicketSorting } from './features/ticket';
import { useSlidePanel, type SlidePanelHook } from './ui/slidePanel';
import { usePreferences, type Preferences, type TableViewPreferences } from './features/preferences';

interface TicketSortData {
  [key: string]: number;
}

// コンテキストの型定義
interface ApplicationContextType {
  // チケット関連
  tickets: TicketData[];
  isLoadingTickets: boolean;
  ticketsError: string | null;
  fetchTickets: () => Promise<void>;
  updateTicket: (ticket: TicketData) => Promise<boolean>;
  deleteTicket: (id: string) => Promise<boolean>;
  
  // チケットソート関連
  sortOrders: TicketSortData;
  isLoadingSortOrders: boolean;
  sortOrdersError: string | null;
  fetchSortOrders: () => Promise<void>;
  updateSortOrder: (ticketId: string, order: number) => Promise<boolean>;
  updateBatchOrders: (orders: { ticketId: string, order: number }[]) => Promise<boolean>;
  
  // スライドパネル関連
  slidePanel: SlidePanelHook;
  
  // ユーザー設定関連
  preferences: Preferences;
  isLoadingPreferences: boolean;
  preferencesError: string | null;
  fetchPreferences: () => Promise<void>;
  savePreferences: (newPreferences: Preferences) => Promise<boolean>;
  updateTableViewPreferences: (tableViewPrefs: TableViewPreferences) => Promise<boolean>;
}

// デフォルト値を持つコンテキスト作成
const ApplicationContext = createContext<ApplicationContextType>({
  tickets: [],
  isLoadingTickets: false,
  ticketsError: null,
  fetchTickets: async () => {},
  updateTicket: async () => false,
  deleteTicket: async () => false,
  
  // チケットソート関連のデフォルト
  sortOrders: {},
  isLoadingSortOrders: false,
  sortOrdersError: null,
  fetchSortOrders: async () => {},
  updateSortOrder: async () => false,
  updateBatchOrders: async () => false,
  
  // スライドパネル関連のデフォルト
  slidePanel: {
    isOpen: false,
    mode: 'new',
    openNewTicket: () => {},
    openEditTicket: () => {},
    handleClose: () => {},
  },
  
  // ユーザー設定関連のデフォルト
  preferences: {},
  isLoadingPreferences: false,
  preferencesError: null,
  fetchPreferences: async () => {},
  savePreferences: async () => false,
  updateTableViewPreferences: async () => false,
});

interface ApplicationProviderProps {
  children: ReactNode;
  initialTicketId?: string;
}

// プロバイダーコンポーネント
export const ApplicationProvider = ({ children, initialTicketId }: ApplicationProviderProps) => {
  // チケット機能を使用
  const {
    tickets,
    isLoadingTickets,
    ticketsError,
    fetchTickets,
    updateTicket,
    deleteTicket,
  } = useTicketManagement();
  
  // チケットソート機能を使用
  const {
    sortOrders,
    isLoadingSortOrders,
    sortOrdersError,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders,
  } = useTicketSorting();
  
  // スライドパネル機能を使用
  const slidePanel = useSlidePanel(initialTicketId);
  
  // ユーザー設定機能を使用
  const {
    preferences,
    isLoadingPreferences,
    preferencesError,
    fetchPreferences,
    savePreferences,
    updateTableViewPreferences,
  } = usePreferences();

  // チケットの状態変化を監視
  useEffect(() => {
    console.log('[ApplicationContext] tickets updated:', tickets.length);
  }, [tickets]);

  // アプリ起動時にチケットを取得
  useEffect(() => {
    fetchTickets();
    fetchSortOrders();
    fetchPreferences();
  }, [fetchTickets, fetchSortOrders, fetchPreferences]);

  const contextValue = {
    // チケット関連
    tickets,
    isLoadingTickets,
    ticketsError,
    fetchTickets,
    updateTicket,
    deleteTicket,
    
    // チケットソート関連
    sortOrders,
    isLoadingSortOrders,
    sortOrdersError,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders,
    
    // スライドパネル関連
    slidePanel,
    
    // ユーザー設定関連
    preferences,
    isLoadingPreferences,
    preferencesError,
    fetchPreferences,
    savePreferences,
    updateTableViewPreferences,
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
