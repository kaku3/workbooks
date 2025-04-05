import fs from 'fs/promises';
import path from 'path';
import { getTrakDataPath } from './config';

export interface TicketData {
  id?: string;
  title: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignees: string[];
  status: string;
  startDate: string;
  dueDate: string;
  estimate: number;
  content: string;
  templateId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIResponse {
  success: boolean;
  ticketId: string;
  error?: string;
}

/**
 * チケットIDを生成
 */
const generateTicketId = () => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `T${year}${month}${day}-${hours}${minutes}${seconds}`;
};

/**
 * チケット一覧を取得
 */
export const loadTickets = async (): Promise<{ tickets: TicketData[] }> => {
  const trackingsDir = path.join(getTrakDataPath(), 'trackings');
  await fs.mkdir(trackingsDir, { recursive: true });

  const files = await fs.readdir(trackingsDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const tickets = await Promise.all(
    jsonFiles.map(async (file) => {
      const tracking = JSON.parse(
        await fs.readFile(path.join(trackingsDir, file), 'utf-8')
      );
      return tracking;
    })
  );

  // チケットを作成日時の降順でソート
  tickets.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return { tickets };
};

/**
 * 新規チケットを作成
 */
export const createTicket = async (data: TicketData): Promise<APIResponse> => {
  const ticketId = generateTicketId();

  // チケットの内容をMarkdownファイルとして保存
  const ticketsDir = path.join(getTrakDataPath(), 'tickets');
  await fs.mkdir(ticketsDir, { recursive: true });
  await fs.writeFile(
    path.join(ticketsDir, `${ticketId}.md`),
    data.content
  );

  // トラッキング情報をJSONとして保存
  const trackingsDir = path.join(getTrakDataPath(), 'trackings');
  await fs.mkdir(trackingsDir, { recursive: true });
  
  const tracking: TicketData = {
    ...data,
    id: ticketId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await fs.writeFile(
    path.join(trackingsDir, `${ticketId}.json`),
    JSON.stringify(tracking, null, 2)
  );

  return { success: true, ticketId };
};

/**
 * チケットを更新
 */
export const updateTicket = async (ticketId: string, data: TicketData): Promise<APIResponse> => {
  // チケットの内容を更新
  const ticketsDir = path.join(getTrakDataPath(), 'tickets');
  await fs.writeFile(
    path.join(ticketsDir, `${ticketId}.md`),
    data.content
  );

  // トラッキング情報を更新
  const trackingsDir = path.join(getTrakDataPath(), 'trackings');
  const tracking: TicketData = {
    ...data,
    id: ticketId,
    updatedAt: new Date().toISOString()
  };

  const existingTrackingPath = path.join(trackingsDir, `${ticketId}.json`);
  const existingTracking = JSON.parse(
    await fs.readFile(existingTrackingPath, 'utf-8')
  );

  await fs.writeFile(
    existingTrackingPath,
    JSON.stringify({ 
      ...existingTracking, 
      ...tracking,
      createdAt: existingTracking.createdAt // 作成日は既存のものを維持
    }, null, 2)
  );

  return { success: true, ticketId };
};

/**
 * チケットを削除
 */
export const deleteTicket = async (ticketId: string): Promise<APIResponse> => {
  const ticketsDir = path.join(getTrakDataPath(), 'tickets');
  const trackingsDir = path.join(getTrakDataPath(), 'trackings');

  // チケットファイルとトラッキングファイルの両方を削除
  await Promise.all([
    fs.unlink(path.join(ticketsDir, `${ticketId}.md`)),
    fs.unlink(path.join(trackingsDir, `${ticketId}.json`))
  ]);

  return { success: true, ticketId };
};
