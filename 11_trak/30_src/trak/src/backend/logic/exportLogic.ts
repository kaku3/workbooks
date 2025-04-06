import XlsxPopulate from 'xlsx-populate';
import { Status } from "../models/status";
import { Tag } from "../models/tag";
import { User } from "../models/user";
import { Project } from "../models/project";
import type { TicketData } from "../models/ticket";
import { logger } from "../utils/logger";
import path from 'path';

export class ExportLogic {
  constructor(
    private currentProject: Project,
    private tags: Tag[],
    private statuses: Status[],
    private users: User[],
    private tickets: TicketData[],
  ) {}

  async exportToExcel(): Promise<Buffer> {
    try {
      logger.debug("Starting Excel export process");

      // テンプレートファイルを読み込み
      const templatePath = path.join(process.cwd(), 'trak-data', 'trak.xlsx');
      const workbook = await XlsxPopulate.fromFileAsync(templatePath);
      
      // WBSシートを取得
      const wbsSheet = workbook.sheet("WBS");
      if (!wbsSheet) {
        throw new Error("WBSシートが見つかりません");
      }

      // プロジェクト情報を書き込み（ヘッダー部分）
      wbsSheet.cell("B2").value(this.currentProject.name);
      wbsSheet.cell("B3").value(""); // プロジェクトの説明は不要

      // チケット情報を書き込み
      this.tickets.forEach((ticket, index) => {
        const rowIndex = index + 6; // データ開始行

        // タグ名の取得
        const tagNames = (ticket.tags || [])
          .map((tagId: string) => this.tags.find(t => t.id === tagId)?.name ?? '')
          .filter((name: string) => name !== '')
          .join(',');

        // ステータス名の取得
        const status = this.statuses.find(s => s.id === ticket.status)?.name ?? '';

        // アサイン者名の取得
        const assigneeNames = ticket.assignees
          .map((email: string) => this.users.find(u => u.email === email)?.name ?? '')
          .filter((name: string) => name !== '')
          .join(',');

        // 各列にデータを設定
        wbsSheet.cell(`A${rowIndex}`).value(ticket.id);
        wbsSheet.cell(`B${rowIndex}`).value(tagNames.length > 0 ? tagNames[0] : ""); // タグがない場合は空文字
        wbsSheet.cell(`C${rowIndex}`).value(tagNames.length > 1 ? tagNames[1] : ""); // タグがない場合は空文字
        wbsSheet.cell(`D${rowIndex}`).value(ticket.title);
        wbsSheet.cell(`E${rowIndex}`).value(assigneeNames);
        wbsSheet.cell(`F${rowIndex}`).value(ticket.estimate ? ticket.estimate / 8 : 0); // 時間から人日に変換
        wbsSheet.cell(`G${rowIndex}`).value(ticket.progress);
        wbsSheet.cell(`H${rowIndex}`).value(status);
        wbsSheet.cell(`I${rowIndex}`).value(ticket.startDate);
        wbsSheet.cell(`J${rowIndex}`).value(ticket.dueDate);
      });

      // エクセルファイルをバッファに変換
      const result = await workbook.outputAsync() as ArrayBuffer;
      const buffer = Buffer.from(new Uint8Array(result));

      logger.info("Excel export completed successfully");
      return buffer;
    } catch (error) {
      logger.error(`Excel export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error;
    }
  }
}
