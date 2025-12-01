import { UpdateTaskUseCase } from "../../../application/use-cases/update-task.use-case";
import { ConsoleLogger } from "../../../infrastructure/logger/console.logger";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class UpdateCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const updateTaskUseCase = new UpdateTaskUseCase(repository);

      const task = await updateTaskUseCase.execute(args.id, args.description);
      ConsoleLogger.success(`Task updated successfully (ID: ${task.id})`);
    } catch (error: any) {
      ConsoleLogger.error(error.message);
    }
  }

  help(): string {
    return 'Usage: task-cli update <id> "New description"\nUpdates a task';
  }
}
