"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { TicketStore, useTicketStore } from "./features/ticketStore";
import {
  TicketSortStore,
  useTicketSortStore,
} from "./features/ticketSortStore";
import { ProjectStore, useProjectStore } from "./features/projectStore";
import { UserStore, useUserStore } from "./features/userStore";
import { HolidayStore, useHolidayStore } from "./features/holidayStore";

import { SlidePanelStore, useSlidePanel } from "./ui/slidePanel";
import {
  PreferenceStore,
  usePreferenceStore,
} from "./features/preferenceStore";

// コンテキストの型定義
interface ApplicationContextType {
  holidayStore: HolidayStore;
  projectStore: ProjectStore;
  userStore: UserStore;
  preferenceStore: PreferenceStore;
  ticketStore: TicketStore;
  ticketSortStore: TicketSortStore;
  slidePanelStore: SlidePanelStore;
}
const ApplicationContext = createContext<ApplicationContextType | null>(null);

interface ApplicationProviderProps {
  children: ReactNode;
  initialTicketId?: string;
}

// プロバイダーコンポーネント
export const ApplicationProvider = ({
  children,
  initialTicketId,
}: ApplicationProviderProps) => {
  const holidayStore = useHolidayStore();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const preferenceStore = usePreferenceStore();
  const ticketStore = useTicketStore();
  const ticketSortStore = useTicketSortStore();
  const slidePanelStore = useSlidePanel(initialTicketId);

  // アプリ起動時に各種データを取得
  // 休日、プロジェクト、ユーザー、ユーザー設定、チケット、チケットソートの取得
  useEffect(() => {
    holidayStore.fetchHolidays();
    projectStore.fetchProject();
    userStore.fetchUsers();
    preferenceStore.fetchPreference();
    ticketStore.fetchTickets();
    ticketSortStore.fetchSortOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    holidayStore, // 休日関連
    projectStore, // プロジェクト設定関連
    userStore, // ユーザー関連
    preferenceStore, // ユーザー設定関連
    ticketStore, // チケット関連
    ticketSortStore, // チケットソート関連
    slidePanelStore, // スライドパネル関連
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
    throw new Error(
      "useApplication must be used within an ApplicationProvider"
    );
  }

  return context;
};
