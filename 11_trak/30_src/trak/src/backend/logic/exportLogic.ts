import { Status } from "../models/status";
import { Tag } from "../models/tag";
import { User } from "../models/user";
import { Project } from "../models/project";
import type { TicketData } from "../models/ticket";
import { logger } from "../utils/logger";
import { ExcelWriter } from "./export/excelWriter";

export class ExportLogic {
  constructor(
    private currentProject: Project,
    private tags: Tag[],
    private statuses: Status[],
    private users: User[],
    private tickets: TicketData[]
  ) {}

  async exportToExcel(): Promise<Buffer> {
    try {
      logger.debug("Starting Excel export process");

      const writer = await ExcelWriter.createFromTemplate();

      writer.writeProjectInfo(this.currentProject);
      writer.writeTickets(this.tickets, this.tags, this.statuses, this.users);

      const buffer = await writer.toBuffer();

      logger.info("Excel export completed successfully");
      return buffer;
    } catch (error) {
      logger.error(
        `Excel export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }
}
