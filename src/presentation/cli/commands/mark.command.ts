import { MarkTaskUseCase } from "../../../application/use-cases/mark-task.use-case";
import { ConsoleLogger } from "../../../infrastructure/logger/console.logger";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class MarkCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const markTaskUseCase = new MarkTaskUseCase(repository);

      const task = await markTaskUseCase.execute(args.id, args.status);

      const statusMessage = args.status === "done" ? "done" : "in progress";
      ConsoleLogger.success(`Task marked as ${statusMessage} (ID: ${task.id})`);
    } catch (error: any) {
      ConsoleLogger.error(error.message);
    }
  }

  help(): string {
    return "Usage: task-cli mark-in-progress <id> OR task-cli mark-done <id>\nMarks a task as in-progress or done";
  }
}
