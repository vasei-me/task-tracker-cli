import * as fs from "fs/promises";
import * as path from "path";
import { ListTasksUseCase } from "../../../application/use-cases/list-tasks.use-case";
import { ReportService } from "../../../infrastructure/report/report.service";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class ReportCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const listUseCase = new ListTasksUseCase(repository);
      const reportService = new ReportService();

      const tasks = await listUseCase.execute();

      if (tasks.length === 0) {
        console.log("❌ No tasks available for reporting");
        return;
      }

      let report: string;

      switch (args.type) {
        case "weekly":
          report = reportService.generateWeeklyReport(tasks, args);
          break;

        case "productivity":
          report = reportService.generateProductivityReport(tasks);
          break;

        case "burn-down":
          reportService.printBurnDownChart(tasks);
          return;

        default:
          throw new Error(`Unsupported report type: ${args.type}`);
      }

      if (args.output === "file") {
        const fileName = `task-report-${args.type}-${
          new Date().toISOString().split("T")[0]
        }.md`;
        const filePath = path.join(process.cwd(), fileName);

        await this.ensureDirectory(filePath);
        await fs.writeFile(filePath, report, "utf-8");

        console.log(`✅ Report saved to: ${filePath}`);
      } else {
        console.log(report);
      }
    } catch (error: any) {
      console.error(`❌ Report generation failed: ${error.message}`);
    }
  }

  private async ensureDirectory(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  help(): string {
    return (
      "Usage: task-cli report [options]\n" +
      "Generates various reports\n" +
      "Options:\n" +
      "  -t, --type <type>        Report type: weekly, productivity, burn-down (default: weekly)\n" +
      "  -o, --output <type>      Output type: console, file (default: console)\n" +
      "\nExamples:\n" +
      "  task-cli report --type weekly\n" +
      "  task-cli report --type productivity --output file\n" +
      "  task-cli report --type burn-down"
    );
  }
}
