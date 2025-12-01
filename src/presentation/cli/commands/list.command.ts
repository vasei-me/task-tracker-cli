import { TaskResponseDTO } from "../../../application/dto/task.dto";
import { ListTasksUseCase } from "../../../application/use-cases/list-tasks.use-case";
import { ConsoleLogger } from "../../../infrastructure/logger/console.logger";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class ListCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const listTasksUseCase = new ListTasksUseCase(repository);

      const tasks = await listTasksUseCase.execute(args.status);

      if (tasks.length === 0) {
        const statusText = args.status ? ` ${args.status}` : "";
        ConsoleLogger.info(`No${statusText} tasks found`);
        return;
      }

      console.log("\n📋 Tasks List:");
      console.log("─".repeat(80));

      tasks.forEach((task) => {
        const taskDto = TaskResponseDTO.fromTask(task);
        const statusIcon = this.getStatusIcon(taskDto.status);
        console.log(`${statusIcon} ID: ${taskDto.id}`);
        console.log(`  Description: ${taskDto.description}`);
        console.log(`  Status: ${taskDto.status}`);
        console.log(
          `  Created: ${new Date(taskDto.createdAt).toLocaleString()}`
        );
        console.log(
          `  Updated: ${new Date(taskDto.updatedAt).toLocaleString()}`
        );
        console.log("─".repeat(80));
      });

      ConsoleLogger.info(`Total tasks: ${tasks.length}`);
    } catch (error: any) {
      ConsoleLogger.error(error.message);
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case "todo":
        return "📝";
      case "in-progress":
        return "⏳";
      case "done":
        return "✅";
      default:
        return "📌";
    }
  }

  help(): string {
    return "Usage: task-cli list [todo|in-progress|done]\nLists all tasks or tasks by status";
  }
}
