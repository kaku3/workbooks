import { Status } from "../models/status";
import { Tag } from "../models/tag";
import { User } from "../models/user";
import { Project } from "../models/project";
import { 
  readProjectFromExcel, 
  readTicketsFromExcel,
  validateImportFile
} from "./import/excelReader";
import { createTicket, updateTicket } from "../services/ticket";
import type { TicketData } from "../models/ticket";

export interface ImportResult {
  success: boolean;
  updatedCount: number;
  createdCount: number;
  errors?: ImportError[];
}

export interface ImportError {
  row?: number;
  message: string;
  field?: string;
}

export class ImportLogic {
  constructor(
    private currentProject: Project,
    private tags: Tag[],
    private statuses: Status[],
    private users: User[],
    private currentUser: string,
    private defaultTemplateId: string,
  ) {}

  async importFromExcel(file: ArrayBuffer): Promise<ImportResult> {
    try {
      // ファイルの基本検証
      const validationResult = await validateImportFile(file);
      if (!validationResult.isValid) {
        return {
          success: false,
          updatedCount: 0,
          createdCount: 0,
          errors: [{
            message: validationResult.error || "Invalid file format"
          }]
        };
      }

      // プロジェクト情報の検証
      const projectData = await readProjectFromExcel(file);
      if (projectData.id !== this.currentProject.id) {
        return {
          success: false,
          updatedCount: 0,
          createdCount: 0,
          errors: [{
            message: "Project ID mismatch"
          }]
        };
      }

      // チケット情報の読み込み
      const tickets = await readTicketsFromExcel(file);
      const errors: ImportError[] = [];
      let updatedCount = 0;
      let createdCount = 0;

      // チケット毎の処理
      // チケット毎の処理
      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        try {
          // タグの変換
          const tagIds = ticket.tags.map((tagName: string) => {
            const tag = this.tags.find(t => t.name === tagName);
            if (!tag) throw new Error(`Invalid tag: ${tagName}`);
            return tag.id;
          });

          // ステータスの変換
          const status = this.statuses.find(s => s.name === ticket.status);
          if (!status) throw new Error(`Invalid status: ${ticket.status}`);

          // アサインユーザーの変換
          const assigneeIds = ticket.assignees.map((userName: string) => {
            const user = this.users.find(u => u.name === userName);
            if (!user) throw new Error(`Invalid user: ${userName}`);
            return user.id;
          });

          // 工数の変換（日 → 時間）
          const estimate = ticket.estimate ? ticket.estimate * 8 : undefined;

          const ticketData: TicketData = {
            id: ticket.id,
            title: ticket.title,
            creator: this.currentUser,
            tags: tagIds,
            status: status.id,
            assignees: assigneeIds,
            estimate: estimate ?? 0,
            progress: ticket.progress,
            startDate: ticket.startDate ?? "",
            dueDate: ticket.dueDate ?? "",
            content: ticket.content ?? "",
            templateId: this.defaultTemplateId
          };

          if (ticket.id) {
            // 既存チケットの更新
            await updateTicket(ticket.id, ticketData);
            updatedCount++;
          } else {
            // 新規チケットの作成
            await createTicket(ticketData);
            createdCount++;
          }
        } catch (error) {
          errors.push({
            row: i + 5, // ヘッダー行(4)の分を加算
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return {
        success: errors.length === 0,
        updatedCount,
        createdCount,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        success: false,
        updatedCount: 0,
        createdCount: 0,
        errors: [{
          message: error instanceof Error ? error.message : "Unknown error"
        }]
      };
    }
  }
}
