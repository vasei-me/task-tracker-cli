import { AddTaskUseCase } from "../../../application/use-cases/add-task.use-case";
import { ConsoleLogger } from "../../../infrastructure/logger/console.logger";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class AddCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const addTaskUseCase = new AddTaskUseCase(repository);

      const task = await addTaskUseCase.execute(args.description);
      ConsoleLogger.success(`Task added successfully (ID: ${task.id})`);
    } catch (error: any) {
      ConsoleLogger.error(error.message);
    }
  }

  help(): string {
    return 'Usage: task-cli add "Task description"\nAdds a new task';
  }
}
