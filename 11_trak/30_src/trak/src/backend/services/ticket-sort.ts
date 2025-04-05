import fs from 'fs/promises';
import path from 'path';
import { getTrakDataPath } from './config';

export interface TicketSortData {
  [key: string]: number;  // ticketId: order
}

export interface BatchUpdateData {
  orders: { ticketId: string, order: number }[];
}

/**
 * ソートデータを保存するファイルのパスを取得
 */
const getSortFilePath = () => {
  return path.join(getTrakDataPath(), 'meta', 'ticket-sort.json');
};

/**
 * ファイルがない場合は作成
 */
const initializeSortFile = async () => {
  const sortFilePath = getSortFilePath();
  try {
    await fs.access(sortFilePath);
  } catch {
    await fs.mkdir(path.dirname(sortFilePath), { recursive: true });
    await fs.writeFile(sortFilePath, JSON.stringify({}));
  }
};

/**
 * sortデータを読み込む
 */
export const loadSortData = async (): Promise<TicketSortData> => {
  await initializeSortFile();
  const data = await fs.readFile(getSortFilePath(), 'utf8');
  return JSON.parse(data);
};

/**
 * 単一チケットのソート順を更新
 */
export const updateTicketOrder = async (ticketId: string, order: number): Promise<void> => {
  const sortData = await loadSortData();
  sortData[ticketId] = order;
  await fs.writeFile(getSortFilePath(), JSON.stringify(sortData, null, 2));
};

/**
 * 複数チケットのソート順を一括更新
 */
export const batchUpdateOrders = async (updateData: BatchUpdateData): Promise<void> => {
  const sortData = await loadSortData();
  updateData.orders.forEach(({ ticketId, order }) => {
    sortData[ticketId] = order;
  });
  await fs.writeFile(getSortFilePath(), JSON.stringify(sortData, null, 2));
};
