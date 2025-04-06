import fs from 'fs/promises';
import path from 'path';
import { getTrakDataPath } from './config';
import { type TicketData, type APIResponse, type GetTicketResponse } from '../models/ticket';

/**
 * ファイルロック用のユーティリティ関数
 */
async function acquireLock(lockPath: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.writeFile(lockPath, '', { flag: 'wx' });
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) return false;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return false;
}

async function releaseLock(lockPath: string) {
  try {
    await fs.unlink(lockPath);
  } catch (error) {
    console.error('ロックファイルの削除に失敗:', error);
  }
}

/**
 * チケットIDを生成
 */
const generateTicketId = (sequenceNumber?: number) => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const baseId = `T${year}${month}${day}-${hours}${minutes}${seconds}`;
  return sequenceNumber !== undefined
    ? `${baseId}-${String(sequenceNumber).padStart(4, '0')}`
    : baseId;
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
export const createTicket = async (
  data: TicketData,
  sequenceNumber?: number
): Promise<APIResponse> => {
  const ticketId = generateTicketId(sequenceNumber);

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
 * チケットを取得
 */
export const getTicket = async (ticketId: string): Promise<GetTicketResponse> => {
  try {
    const trackingPath = path.join(getTrakDataPath(), 'trackings', `${ticketId}.json`);
    const trackingData = await fs.readFile(trackingPath, 'utf-8');
    const tracking: TicketData = JSON.parse(trackingData);

    const ticketPath = path.join(getTrakDataPath(), 'tickets', `${ticketId}.md`);
    const content = await fs.readFile(ticketPath, 'utf-8');

    const ticket: TicketData = {
      ...tracking,
      content
    };

    return { 
      success: true, 
      ticket,
      ticketId
    };
  } catch (error) {
    console.error('チケットの取得に失敗:', error);
    return { 
      success: false,
      ticketId,
      error: 'チケットの取得に失敗しました'
    };
  }
};

/**
 * チケットを更新
 */
export const updateTicket = async (ticketId: string, data: TicketData): Promise<APIResponse> => {
  const lockPath = path.join(getTrakDataPath(), 'trackings', `${ticketId}.lock`);

  try {
    // ロックの取得
    const lockAcquired = await acquireLock(lockPath);
    if (!lockAcquired) {
      return {
        success: false,
        ticketId,
        error: 'ファイルがロックされています'
      };
    }

    const ticketsDir = path.join(getTrakDataPath(), 'tickets');
    const trackingsDir = path.join(getTrakDataPath(), 'trackings');
    const existingTrackingPath = path.join(trackingsDir, `${ticketId}.json`);

    // 既存のトラッキングデータを読み込み
    const existingTracking = JSON.parse(
      await fs.readFile(existingTrackingPath, 'utf-8')
    );

    // チケットの内容を更新
    if (data.content) {
      await fs.writeFile(
        path.join(ticketsDir, `${ticketId}.md`),
        data.content
      );
    }

    // トラッキング情報を更新
    const updatedTracking: TicketData = {
      ...existingTracking,
      ...data,
      id: ticketId,
      updatedAt: new Date().toISOString(),
      createdAt: existingTracking.createdAt // 作成日は既存のものを維持
    };

    await fs.writeFile(
      existingTrackingPath,
      JSON.stringify(updatedTracking, null, 2)
    );

    await releaseLock(lockPath);
    return { success: true, ticketId };
  } catch (error) {
    await releaseLock(lockPath);
    console.error('チケットの更新に失敗:', error);
    return { 
      success: false, 
      ticketId,
      error: 'チケットの更新に失敗しました'
    };
  }
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
