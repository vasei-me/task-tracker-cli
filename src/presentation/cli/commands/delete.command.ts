import { DeleteTaskUseCase } from "../../../application/use-cases/delete-task.use-case";
import { ConsoleLogger } from "../../../infrastructure/logger/console.logger";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class DeleteCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const deleteTaskUseCase = new DeleteTaskUseCase(repository);

      await deleteTaskUseCase.execute(args.id);
      ConsoleLogger.success(`Task deleted successfully (ID: ${args.id})`);
    } catch (error: any) {
      ConsoleLogger.error(error.message);
    }
  }

  help(): string {
    return "Usage: task-cli delete <id>\nDeletes a task";
  }
}
