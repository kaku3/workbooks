'use client';

import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode, useRef } from 'react';
import type { TicketData } from '@/types';

interface TicketSortData {
  [key: string]: number;
}

interface TableViewPreferences {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  selectedStatuses: string[];
}

interface Preferences {
  tableView?: TableViewPreferences;
}

interface SlidePanelState {
  isOpen: boolean;
  mode: 'new' | 'edit';
  ticketId?: string;
}
interface SlidePanelHook extends SlidePanelState {
  openNewTicket: () => void;
  openEditTicket: (ticketId: string) => void;
  handleClose: () => void;
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
  // チケット関連の状態
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  // チケットソート関連の状態
  const [sortOrders, setSortOrders] = useState<TicketSortData>({});
  const [isLoadingSortOrders, setIsLoadingSortOrders] = useState(true);
  const [sortOrdersError, setSortOrdersError] = useState<string | null>(null);
  
  // スライドパネル関連の状態
  const initialTicketHandled = useRef(false);
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelState>({
    isOpen: false,
    mode: 'new'
  });
  
  // ユーザー設定関連の状態
  const [preferences, setPreferences] = useState<Preferences>({});
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  // チケットの取得
  const fetchTickets = useCallback(async () => {
    console.log('[ApplicationContext] fetchTickets called');
    setIsLoadingTickets(true);
    
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'チケットの取得に失敗しました');
      }

      const newTickets = [...data.tickets];
      console.log('[ApplicationContext] fetchTickets success:', newTickets);
      setTickets(newTickets);
      setTicketsError(null);
    } catch (err) {
      console.error('[ApplicationContext] fetchTickets error:', err);
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setTicketsError(errorMessage);
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  // チケットの更新
  const updateTicket = useCallback(async (updatedTicket: TicketData) => {
    console.log('[ApplicationContext] updateTicket:', updatedTicket);
    try {
      const response = await fetch(`/api/tickets/${updatedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setTickets(prev => prev.map(t => 
        t.id === updatedTicket.id ? updatedTicket : t
      ));
      
      return true;
    } catch (err) {
      console.error('[ApplicationContext] updateTicket error:', err);
      return false;
    }
  }, []);

  // チケットの削除
  const deleteTicket = useCallback(async (ticketId: string) => {
    console.log('[ApplicationContext] deleteTicket:', ticketId);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '削除に失敗しました');
      }

      setTickets(prev => prev.filter(t => t.id !== ticketId));
      return true;
    } catch (err) {
      console.error('[ApplicationContext] deleteTicket error:', err);
      return false;
    }
  }, []);
  
  // ソート順の取得
  const fetchSortOrders = useCallback(async () => {
    setIsLoadingSortOrders(true);
    try {
      const response = await fetch('/api/ticket-sort');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'ソート順の取得に失敗しました');
      }
      
      setSortOrders(data.sortData);
      setSortOrdersError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setSortOrdersError(errorMessage);
    } finally {
      setIsLoadingSortOrders(false);
    }
  }, []);

  // ソート順の更新
  const updateSortOrder = useCallback(async (ticketId: string, order: number) => {
    try {
      const response = await fetch('/api/ticket-sort', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, order }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setSortOrders(prev => ({
        ...prev,
        [ticketId]: order,
      }));
      setSortOrdersError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setSortOrdersError(errorMessage);
      return false;
    }
  }, []);

  // 複数のソート順を一括更新
  const updateBatchOrders = useCallback(async (orders: { ticketId: string, order: number }[]) => {
    try {
      const response = await fetch('/api/ticket-sort', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orders }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setSortOrders(prev => {
        const newOrders = { ...prev };
        orders.forEach(({ ticketId, order }) => {
          newOrders[ticketId] = order;
        });
        return newOrders;
      });
      setSortOrdersError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setSortOrdersError(errorMessage);
      return false;
    }
  }, []);
  
  // 新規チケットパネルを開く
  const openNewTicket = useCallback(() => {
    console.log('[ApplicationContext] openNewTicket');
    setSlidePanelState({
      isOpen: true,
      mode: 'new'
    });
  }, []);

  // チケット編集パネルを開く
  const openEditTicket = useCallback((ticketId: string) => {
    console.log('[ApplicationContext] openEditTicket', ticketId);
    if (slidePanelState.ticketId !== ticketId || !slidePanelState.isOpen) {
      setSlidePanelState({
        isOpen: true,
        mode: 'edit',
        ticketId
      });

      // Update URL without page reload
      window.history.pushState({}, '', `/tickets/${ticketId}`);
    }
  }, [slidePanelState.ticketId, slidePanelState.isOpen]);

  // パネルを閉じる
  const closeSlidePanelTicket = useCallback(() => {
    console.log('[ApplicationContext] closeSlidePanelTicket');
    setSlidePanelState(prev => ({ ...prev, isOpen: false }));

    // Reset the initialTicketHandled when closing
    initialTicketHandled.current = false;

    // Always restore URL to home when closing panel
    if (window.location.pathname.startsWith('/tickets/')) {
      // Push new state to avoid triggering back button
      window.history.pushState({}, '', '/');
    }
  }, []);

  // slidePanel オブジェクトを作成
  const slidePanel: SlidePanelHook = {
    ...slidePanelState,
    openNewTicket,
    openEditTicket,
    handleClose: closeSlidePanelTicket
  };
  
  // 設定を読み込む
  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoadingPreferences(true);
      const response = await fetch('/api/preferences');
      if (!response.ok) {
        throw new Error('Failed to load preferences');
      }
      const data = await response.json();
      setPreferences(data);
      setPreferencesError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setPreferencesError(errorMessage);
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoadingPreferences(false);
    }
  }, []);

  // 設定を保存する
  const savePreferences = useCallback(async (newPreferences: Preferences) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setPreferences(newPreferences);
      setPreferencesError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setPreferencesError(errorMessage);
      console.error('Error saving preferences:', err);
      return false;
    }
  }, []);

  // TableViewの設定を更新する
  const updateTableViewPreferences = useCallback(async (tableViewPrefs: TableViewPreferences) => {
    const newPreferences = {
      ...preferences,
      tableView: tableViewPrefs,
    };
    return await savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // ブラウザのバック/フォワードナビゲーション処理
  useEffect(() => {
    const handlePopState = () => {
      setSlidePanelState(prev => ({ ...prev, isOpen: false }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 初期チケットIDがある場合、編集モードでパネルを開く
  useEffect(() => {
    if (initialTicketId && !initialTicketHandled.current) {
      console.log('[ApplicationContext] Opening initial ticket:', initialTicketId);
      initialTicketHandled.current = true;
      setSlidePanelState({
        isOpen: true,
        mode: 'edit',
        ticketId: initialTicketId,
      });
      // Update URL without page reload
      window.history.pushState({}, '', `/tickets/${initialTicketId}`);
    }
  }, [initialTicketId]);

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
