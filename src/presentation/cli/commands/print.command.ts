import chalk from "chalk";
import { ListTasksUseCase } from "../../../application/use-cases/list-tasks.use-case";
import { TaskStatus } from "../../../core/interfaces/task.interface";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class PrintCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const listUseCase = new ListTasksUseCase(repository);

      const tasks = await listUseCase.execute(args.status);
      this.displayTable(tasks, args.status);
    } catch (error: any) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  private displayTable(tasks: any[], status?: TaskStatus): void {
    if (tasks.length === 0) {
      const statusText = status ? ` ${status}` : "";
      console.log(chalk.yellow(`No${statusText} tasks found`));
      return;
    }

    // محاسبه عرض ستون‌ها با مقادیر واقعی
    const idWidth = Math.max(
      4,
      Math.max(...tasks.map((t) => t.id.toString().length)) + 1
    );
    const statusWidth = 14; // برای ایموجی + متن
    const dateWidth = 10;

    // محدود کردن عرض توضیحات بین 20 تا 40 کاراکتر
    const maxDescLength = Math.max(...tasks.map((t) => t.description.length));
    const descWidth = Math.max(20, Math.min(40, maxDescLength));

    const totalWidth = idWidth + statusWidth + dateWidth + descWidth + 13; // Borders and padding

    // هدر
    console.log("\n" + chalk.cyan.bold("📋 Task List"));
    console.log(chalk.gray("╔" + "═".repeat(totalWidth - 2) + "╗"));

    // هدر ستون‌ها
    const header = [
      chalk.bold(" ID ".padEnd(idWidth - 1)),
      chalk.bold(" Status ".padEnd(statusWidth - 1)),
      chalk.bold(" Description ".padEnd(descWidth - 1)),
      chalk.bold(" Updated ".padEnd(dateWidth - 1)),
    ].join(chalk.gray("│"));

    console.log(chalk.gray("║") + header + chalk.gray("║"));
    console.log(chalk.gray("╟" + "─".repeat(totalWidth - 2) + "╢"));

    // ردیف‌ها
    tasks.forEach((task) => {
      const id = chalk.yellow(` ${task.id}`.padEnd(idWidth - 1));
      const status = this.formatStatus(task.status).padEnd(statusWidth - 1);
      const desc = this.truncateText(task.description, descWidth).padEnd(
        descWidth - 1
      );
      const updated = this.formatDate(task.updatedAt).padEnd(dateWidth - 1);

      const row = [id, status, desc, updated].join(chalk.gray("│"));
      console.log(chalk.gray("║") + row + chalk.gray("║"));
    });

    // فوتر
    console.log(chalk.gray("╚" + "═".repeat(totalWidth - 2) + "╝"));

    // خلاصه
    const statusSummary = status ? ` (${status})` : "";
    console.log(
      chalk.gray(`📊 Total: ${tasks.length} task(s)${statusSummary}`)
    );
  }

  private formatStatus(status: string): string {
    switch (status) {
      case "todo":
        return chalk.yellow(" 📝 TODO");
      case "in-progress":
        return chalk.blue(" ⏳ IN-PROG");
      case "done":
        return chalk.green(" ✅ DONE");
      default:
        return chalk.gray(` ${status}`);
    }
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const taskDate = new Date(date);
    const diffHours = Math.floor(
      (now.getTime() - taskDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 24) {
      // امروز
      return taskDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffHours < 48) {
      // دیروز
      return "Yesterday";
    } else if (diffHours < 168) {
      // 7 روز
      return taskDate.toLocaleDateString([], { weekday: "short" });
    } else {
      // بیش از یک هفته
      return taskDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return ` ${text}`;
    return ` ${text.substring(0, maxLength - 4)}...`;
  }

  help(): string {
    return (
      "Usage: task-cli print [status]\n" +
      "Displays tasks in a beautiful table format\n" +
      "Optional: task-cli print <todo|in-progress|done>\n\n" +
      "Examples:\n" +
      "  task-cli print           # Print all tasks\n" +
      "  task-cli print todo      # Print only todo tasks\n" +
      "  task-cli print done      # Print only done tasks"
    );
  }
}
