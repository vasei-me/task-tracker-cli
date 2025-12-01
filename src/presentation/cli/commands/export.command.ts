import { ListTasksUseCase } from "../../../application/use-cases/list-tasks.use-case";
import { ExportService } from "../../../infrastructure/export/export.service";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class ExportCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const listUseCase = new ListTasksUseCase(repository);
      const exportService = new ExportService();

      // Get tasks (filtered by status if provided)
      const tasks = await listUseCase.execute(args.status);

      if (tasks.length === 0) {
        console.log("❌ No tasks to export");
        return;
      }

      const options = {
        format: args.format,
        outputPath: args.output,
        includeHeader: args.header !== "false",
      };

      let result: string;

      switch (args.format) {
        case "json":
          result = await exportService.exportToJSON(tasks, options);
          if (!args.output) {
            console.log(result);
          }
          break;

        case "csv":
          result = await exportService.exportToCSV(tasks, options);
          if (!args.output) {
            console.log(result);
          }
          break;

        case "markdown":
          result = await exportService.exportToMarkdown(tasks, options);
          if (!args.output) {
            console.log(result);
          }
          break;

        case "table":
          exportService.printTable(tasks);
          return;

        default:
          throw new Error(`Unsupported format: ${args.format}`);
      }

      if (args.output) {
        console.log(
          `✅ Exported ${tasks.length} tasks to ${args.output} (${args.format})`
        );
      }
    } catch (error: any) {
      console.error(`❌ Export failed: ${error.message}`);
    }
  }

  help(): string {
    return (
      "Usage: task-cli export [options] [status]\n" +
      "Exports tasks to various formats\n" +
      "Arguments:\n" +
      "  status                  Filter by status (todo, in-progress, done)\n" +
      "Options:\n" +
      "  -f, --format <format>   Export format: json, csv, markdown, table (default: json)\n" +
      "  -o, --output <path>     Output file path (optional, prints to console if not specified)\n" +
      "  --header <true/false>   Include header in CSV (default: true)\n" +
      "\nExamples:\n" +
      "  task-cli export --format csv\n" +
      "  task-cli export todo --format json --output tasks.json\n" +
      "  task-cli export --format markdown --output report.md\n" +
      "  task-cli export --format table"
    );
  }
}
