import { UpdateTaskUseCase } from "../../../application/use-cases/update-task.use-case";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class PriorityCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const updateTaskUseCase = new UpdateTaskUseCase(repository);

      const task = await updateTaskUseCase.execute(args.id, {
        priority: args.priority,
      });

      console.log(`✅ Task priority set to ${args.priority} (ID: ${task.id})`);
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  help(): string {
    return (
      "Usage: task-cli set-priority <id> <priority>\n" +
      "Sets task priority\n" +
      "Priority: low, medium, high\n" +
      "\nExamples:\n" +
      "  task-cli set-priority 1 high\n" +
      "  task-cli set-priority 2 low"
    );
  }
}
