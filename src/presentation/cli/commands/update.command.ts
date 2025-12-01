import { UpdateTaskUseCase } from "../../../application/use-cases/update-task.use-case";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class UpdateCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const updateTaskUseCase = new UpdateTaskUseCase(repository);

      const updateData: any = {};
      if (args.description) updateData.description = args.description;
      if (args.deadline !== undefined) {
        updateData.deadline =
          args.deadline === "null" ? undefined : args.deadline;
      }
      if (args.priority !== undefined) updateData.priority = args.priority;
      if (args.tags !== undefined) {
        updateData.tags = args.tags
          ? args.tags.split(",").map((t: string) => t.trim())
          : [];
      }

      const task = await updateTaskUseCase.execute(args.id, updateData);
      console.log(`✅ Task updated successfully (ID: ${task.id})`);
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  help(): string {
    return (
      "Usage: task-cli update <id> <description> [options]\n" +
      "Options:\n" +
      '  --deadline <date>    Update deadline (use "null" to remove)\n' +
      "  --priority <level>   Update priority: low, medium, high\n" +
      "  --tags <tags>        Update tags (comma-separated)\n" +
      "\nExamples:\n" +
      '  task-cli update 1 "New description"\n' +
      '  task-cli update 1 "Task" --deadline 2024-12-20\n' +
      '  task-cli update 1 "Task" --priority high --tags "work,important"'
    );
  }
}
