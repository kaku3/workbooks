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
import { logger } from "../utils/logger";

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
      logger.debug("Starting Excel import process");
      
      // ファイルの基本検証
      logger.debug("Validating import file");
      const validationResult = await validateImportFile(file);
      if (!validationResult.isValid) {
        logger.info(`Import file validation failed: ${validationResult.error}`);
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
      logger.debug("Reading project data from Excel");
      const projectData = await readProjectFromExcel(file);
      logger.debug(`Project data read from Excel: ${JSON.stringify(projectData)}`);
      if (projectData.id !== this.currentProject.id) {
        logger.info(`Project ID mismatch. Expected: ${this.currentProject.id}, Got: ${projectData.id}`);
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
      logger.debug("Reading tickets from Excel");
      const tickets = await readTicketsFromExcel(file);
      logger.info(`Found ${tickets.length} tickets to process`);
      const errors: ImportError[] = [];
      let updatedCount = 0;
      let createdCount = 0;

      // チケット毎の処理
      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        try {
          logger.debug(`Processing ticket ${i + 1}/${tickets.length}`);
          
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
            return user.email;
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
            logger.debug(`Updating existing ticket: ${ticket.id}`);
            await updateTicket(ticket.id, ticketData);
            updatedCount++;
          } else {
            // 新規チケットの作成
            logger.debug("Creating new ticket");
            await createTicket(ticketData, createdCount + 1);
            createdCount++;
          }
        } catch (error) {
          logger.info(`Error processing ticket at row ${i + 5}: ${error instanceof Error ? error.message : "Unknown error"}`);
          errors.push({
            row: i + 5, // ヘッダー行(4)の分を加算
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      logger.info(`Import completed. Created: ${createdCount}, Updated: ${updatedCount}, Errors: ${errors.length}`);
      return {
        success: errors.length === 0,
        updatedCount,
        createdCount,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      logger.info(`Import failed with error: ${error instanceof Error ? error.message : "Unknown error"}`);
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
