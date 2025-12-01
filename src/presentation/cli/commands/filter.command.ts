import { FilterTasksUseCase } from "../../../application/use-cases/filter-tasks.use-case";
import {
  TaskPriority,
  TaskStatus,
} from "../../../core/interfaces/task.interface";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class FilterCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const filterUseCase = new FilterTasksUseCase(repository);

      const filters: any = {};
      if (args.status) filters.status = args.status as TaskStatus;
      if (args.priority) filters.priority = args.priority as TaskPriority;
      if (args.tag) filters.tag = args.tag;
      if (args.overdue) filters.overdue = true;
      if (args.dueToday) filters.dueToday = true;

      const tasks = await filterUseCase.execute(filters);
      this.displayResults(tasks, filters);
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  private displayResults(tasks: any[], filters: any): void {
    console.log("\n🔍 Filter Results");
    console.log("═".repeat(80));

    // Display filter criteria
    const criteriaText = [];
    if (filters.status) criteriaText.push(`Status: ${filters.status}`);
    if (filters.priority) criteriaText.push(`Priority: ${filters.priority}`);
    if (filters.tag) criteriaText.push(`Tag: ${filters.tag}`);
    if (filters.overdue) criteriaText.push(`Overdue: true`);
    if (filters.dueToday) criteriaText.push(`Due Today: true`);

    if (criteriaText.length > 0) {
      console.log("Filters:");
      console.log(`  ${criteriaText.join(" | ")}`);
      console.log("─".repeat(80));
    }

    if (tasks.length === 0) {
      console.log("No tasks found matching your filters");
      return;
    }

    console.log(`Found ${tasks.length} task(s):\n`);

    tasks.forEach((task: any) => {
      const statusIcon = this.getStatusIcon(task.status);
      const priorityIcon = this.getPriorityIcon(task.priority);

      console.log(`${statusIcon} ${priorityIcon} ID: ${task.id}`);
      console.log(`  Description: ${task.description}`);
      console.log(`  Status: ${task.status}`);
      console.log(`  Priority: ${task.priority}`);

      if (task.deadline) {
        const deadline = new Date(task.deadline);
        const now = new Date();
        const diffDays = Math.ceil(
          (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        let deadlineText = deadline.toLocaleDateString();
        if (diffDays < 0) {
          deadlineText += ` (Overdue by ${Math.abs(diffDays)} days)`;
        } else if (diffDays === 0) {
          deadlineText += " (Due today!)";
        } else if (diffDays <= 3) {
          deadlineText += ` (Due in ${diffDays} days)`;
        }

        console.log(`  Deadline: ${deadlineText}`);
      }

      if (task.tags && task.tags.length > 0) {
        console.log(`  Tags: ${task.tags.join(", ")}`);
      }

      console.log(`  Updated: ${new Date(task.updatedAt).toLocaleString()}`);
      console.log("─".repeat(80));
    });
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

  private getPriorityIcon(priority: string): string {
    switch (priority) {
      case "low":
        return "⬇️";
      case "medium":
        return "➡️";
      case "high":
        return "⬆️";
      default:
        return "🔸";
    }
  }

  help(): string {
    return (
      "Usage: task-cli filter [options]\n" +
      "Filters tasks by multiple criteria\n" +
      "Options:\n" +
      "  --status <status>      Filter by status\n" +
      "  --priority <priority>  Filter by priority\n" +
      "  --tag <tag>            Filter by tag\n" +
      "  --overdue              Show only overdue tasks\n" +
      "  --due-today            Show only tasks due today\n" +
      "\nExamples:\n" +
      "  task-cli filter --priority high\n" +
      "  task-cli filter --tag work --status todo\n" +
      "  task-cli filter --overdue\n" +
      "  task-cli filter --due-today"
    );
  }
}
