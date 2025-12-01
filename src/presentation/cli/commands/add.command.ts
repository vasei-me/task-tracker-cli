import { CreateTaskUseCase } from "../../../application/use-cases/create-task.use-case";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class AddCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const createTaskUseCase = new CreateTaskUseCase(repository);

      const task = await createTaskUseCase.execute({
        description: args.description,
        deadline: args.deadline,
        priority: args.priority,
        tags: args.tags
          ? args.tags.split(",").map((t: string) => t.trim())
          : [],
      });

      console.log(`✅ Task added successfully (ID: ${task.id})`);

      // Show additional info if provided
      if (args.deadline) {
        console.log(
          `   Deadline: ${new Date(args.deadline).toLocaleDateString()}`
        );
      }
      if (args.priority) {
        console.log(`   Priority: ${args.priority}`);
      }
      if (args.tags) {
        console.log(`   Tags: ${args.tags}`);
      }
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  help(): string {
    return (
      "Usage: task-cli add <description> [options]\n" +
      "Options:\n" +
      "  --deadline <date>    Deadline (YYYY-MM-DD or ISO format)\n" +
      "  --priority <level>   Priority: low, medium, high (default: medium)\n" +
      '  --tags <tags>        Comma-separated tags (e.g., "work,urgent")\n' +
      "\nExamples:\n" +
      '  task-cli add "Finish report"\n' +
      '  task-cli add "Meeting" --deadline 2024-12-15 --priority high\n' +
      '  task-cli add "Buy groceries" --tags "home,shopping"'
    );
  }
}
