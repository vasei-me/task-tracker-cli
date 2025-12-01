import { CreateTaskUseCase } from "../../../application/use-cases/create-task.use-case";
import { ImportService } from "../../../infrastructure/import/import.service";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class ImportCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const importService = new ImportService();
      const createTaskUseCase = new CreateTaskUseCase(repository);

      // Validate file exists
      await this.validateFile(args.file);

      // Import tasks
      let tasks;
      if (args.format === "csv") {
        tasks = await importService.importFromCSV({
          format: "csv",
          filePath: args.file,
          merge: args.merge,
        });
      } else {
        tasks = await importService.importFromJSON({
          format: "json",
          filePath: args.file,
          merge: args.merge,
        });
      }

      if (tasks.length === 0) {
        console.log("❌ No tasks found in import file");
        return;
      }

      console.log(`📥 Importing ${tasks.length} tasks...`);

      let successCount = 0;
      let errorCount = 0;

      for (const taskData of tasks) {
        try {
          await createTaskUseCase.execute(taskData);
          successCount++;
        } catch (error: any) {
          console.error(
            `  ⚠️  Failed to import: ${taskData.description} - ${error.message}`
          );
          errorCount++;
        }
      }

      console.log(`\n✅ Import completed:`);
      console.log(`   Success: ${successCount} tasks`);
      if (errorCount > 0) {
        console.log(`   Failed: ${errorCount} tasks`);
      }
    } catch (error: any) {
      console.error(`❌ Import failed: ${error.message}`);
    }
  }

  private async validateFile(filePath: string): Promise<void> {
    const fs = await import("fs/promises");

    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`File not found: ${filePath}`);
    }

    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${filePath}`);
    }
  }

  help(): string {
    return (
      "Usage: task-cli import [options] <file>\n" +
      "Imports tasks from file\n" +
      "Arguments:\n" +
      "  file                    Path to import file\n" +
      "Options:\n" +
      "  -f, --format <format>   Import format: json, csv (default: json)\n" +
      "  -m, --merge             Merge with existing tasks (default: false)\n" +
      "\nExamples:\n" +
      "  task-cli import tasks.json\n" +
      "  task-cli import --format csv tasks.csv\n" +
      "  task-cli import --format json --merge backup.json"
    );
  }
}
