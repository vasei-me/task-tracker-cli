import chalk from "chalk";
import { TaskResponseDTO } from "../../../application/dto/task.dto";
import {
  SearchCriteria,
  SearchTasksUseCase,
} from "../../../application/use-cases/search-tasks.use-case";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class SearchCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const searchUseCase = new SearchTasksUseCase(repository);

      const criteria: SearchCriteria = {
        keyword: args.keyword,
        status: args.status,
      };

      const tasks = await searchUseCase.execute(criteria);
      this.displayResults(tasks, criteria);
    } catch (error: any) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  private displayResults(tasks: any[], criteria: SearchCriteria): void {
    console.log("\n" + chalk.cyan.bold("🔍 Search Results"));
    console.log(chalk.gray("═".repeat(80)));

    if (tasks.length === 0) {
      console.log(chalk.yellow("No tasks found matching your criteria"));

      if (criteria.keyword) {
        console.log(chalk.gray(`Keyword: "${criteria.keyword}"`));
      }
      if (criteria.status) {
        console.log(chalk.gray(`Status: ${criteria.status}`));
      }

      return;
    }

    // Display search criteria
    console.log(chalk.white.bold("Search Criteria:"));
    const criteriaText = [];
    if (criteria.keyword) criteriaText.push(`Keyword: "${criteria.keyword}"`);
    if (criteria.status) criteriaText.push(`Status: ${criteria.status}`);

    if (criteriaText.length > 0) {
      console.log(`  ${criteriaText.join(" | ")}`);
    }
    console.log(chalk.gray("─".repeat(80)));

    // Display tasks
    console.log(chalk.white.bold(`Found ${tasks.length} task(s):\n`));

    tasks.forEach((task) => {
      const taskDto = TaskResponseDTO.fromTask(task);
      const statusIcon = this.getStatusIcon(taskDto.status);
      const statusColor = this.getStatusColor(taskDto.status);

      console.log(`${statusIcon} ${chalk.bold(`ID: ${taskDto.id}`)}`);
      console.log(
        `  ${chalk.white("Description:")} ${this.highlightText(
          taskDto.description,
          criteria.keyword
        )}`
      );
      console.log(`  ${chalk.white("Status:")} ${statusColor(taskDto.status)}`);
      console.log(
        `  ${chalk.white("Created:")} ${chalk.gray(
          new Date(taskDto.createdAt).toLocaleString()
        )}`
      );
      console.log(
        `  ${chalk.white("Updated:")} ${chalk.gray(
          new Date(taskDto.updatedAt).toLocaleString()
        )}`
      );
      console.log(chalk.gray("─".repeat(80)));
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

  private getStatusColor(status: string): (text: string) => string {
    switch (status) {
      case "todo":
        return chalk.yellow;
      case "in-progress":
        return chalk.blue;
      case "done":
        return chalk.green;
      default:
        return chalk.white;
    }
  }

  private highlightText(text: string, keyword?: string): string {
    if (!keyword) return text;

    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const index = lowerText.indexOf(lowerKeyword);

    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + keyword.length);
    const after = text.substring(index + keyword.length);

    return before + chalk.bgYellow.black(match) + after;
  }

  help(): string {
    return (
      "Usage: task-cli search <keyword> [options]\n" +
      "Options:\n" +
      "  --status <status>  Filter by status (todo, in-progress, done)\n" +
      "\nExamples:\n" +
      '  task-cli search "report"\n' +
      '  task-cli search "meeting" --status done'
    );
  }
}
