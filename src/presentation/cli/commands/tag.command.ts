import { UpdateTaskUseCase } from "../../../application/use-cases/update-task.use-case";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class TagCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const updateTaskUseCase = new UpdateTaskUseCase(repository);

      // First get current task
      const task = await repository.findById(args.id);

      if (!task) {
        throw new Error(`Task with ID ${args.id} not found`);
      }

      // Get current tags or empty array
      const currentTags = task.tags || [];
      let newTags = [...currentTags];

      if (args.action === "add") {
        if (!newTags.includes(args.tag)) {
          newTags.push(args.tag);
        }
      } else if (args.action === "remove") {
        newTags = newTags.filter((t) => t !== args.tag);
      } else {
        throw new Error('Invalid action. Use "add" or "remove"');
      }

      // Update task with new tags
      await updateTaskUseCase.execute(args.id, { tags: newTags });

      const actionText = args.action === "add" ? "added to" : "removed from";
      console.log(`✅ Tag "${args.tag}" ${actionText} task (ID: ${args.id})`);
      console.log(`   Current tags: ${newTags.join(", ") || "none"}`);
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  help(): string {
    return (
      "Usage: task-cli tag <action> <id> <tag>\n" +
      "Manages task tags\n" +
      "Actions: add, remove\n" +
      "\nExamples:\n" +
      "  task-cli tag add 1 work\n" +
      "  task-cli tag remove 1 work"
    );
  }
}
