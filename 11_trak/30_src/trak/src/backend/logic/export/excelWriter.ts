import XlsxPopulate, { Workbook, Sheet } from "xlsx-populate";
import path from "path";
import { getTrakDataPath } from "../../services/config";
import { logger } from "../../utils/logger";
import type { Project } from "../../models/project";
import type { TicketData } from "../../models/ticket";
import type { Tag } from "../../models/tag";
import type { Status } from "../../models/status";
import type { User } from "../../models/user";

export class ExcelWriter {
  constructor(private workbook: Workbook, private sheet: Sheet) {}

  /**
   * テンプレートファイルからExcelWriterインスタンスを作成
   */
  static async createFromTemplate(): Promise<ExcelWriter> {
    try {
      const templatePath = path.join(getTrakDataPath(), "trak.xlsx");
      const workbook = await XlsxPopulate.fromFileAsync(templatePath);
      const sheet = workbook.sheet("WBS");

      if (!sheet) {
        throw new Error("WBSシートが見つかりません");
      }

      return new ExcelWriter(workbook, sheet);
    } catch (error) {
      logger.error(
        `Excel template loading failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }

  /**
   * プロジェクト情報を書き込む
   */
  writeProjectInfo(project: Project): void {
    this.sheet.cell("B2").value(project.name);
    this.sheet.cell("B3").value(""); // プロジェクトの説明は不要
  }

  /**
   * チケット情報を書き込む
   */
  writeTickets(
    tickets: TicketData[],
    tags: Tag[],
    statuses: Status[],
    users: User[]
  ): void {
    tickets.forEach((ticket, index) => {
      const rowIndex = index + 4; // データ開始行

      // タグ名の取得
      const tagNames = (ticket.tags || [])
        .map((tagId: string) => tags.find((t) => t.id === tagId)?.name ?? "")
        .filter((name: string) => name !== "");

      // 1つ目のタグ
      const firstTag = tagNames[0] || "";
      // 2つ目以降のタグをセミコロン区切りで結合
      const remainingTagsString = tagNames.slice(1).join(";");


      // ステータス名の取得
      const status = statuses.find((s) => s.id === ticket.status)?.name ?? "";

      // アサイン者名の取得
      const assigneeNames = ticket.assignees
        .map(
          (email: string) => users.find((u) => u.email === email)?.name ?? ""
        )
        .filter((name: string) => name !== "")
        .join(";");

      // 各列にデータを設定
      this.sheet.cell(`A${rowIndex}`).value(ticket.id);
      this.sheet.cell(`B${rowIndex}`).value(firstTag);
      this.sheet.cell(`C${rowIndex}`).value(remainingTagsString);
      this.sheet.cell(`D${rowIndex}`).value(ticket.title);
      this.sheet.cell(`E${rowIndex}`).value(assigneeNames);
      this.sheet
        .cell(`F${rowIndex}`)
        .value(ticket.estimate ? ticket.estimate / 8 : 0); // 時間から人日に変換
      this.sheet.cell(`G${rowIndex}`).value(ticket.progress);
      this.sheet.cell(`H${rowIndex}`).value(status);
      this.sheet.cell(`I${rowIndex}`).value(ticket.startDate);
      this.sheet.cell(`J${rowIndex}`).value(ticket.dueDate);
    });
  }

  /**
   * Excelファイルをバッファとして出力
   */
  async toBuffer(): Promise<Buffer> {
    try {
      const result = (await this.workbook.outputAsync()) as ArrayBuffer;
      return Buffer.from(new Uint8Array(result));
    } catch (error) {
      logger.error(
        `Excel buffer conversion failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }
}
