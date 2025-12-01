import chalk from "chalk";
import { GetStatsUseCase } from "../../../application/use-cases/get-stats.use-case";
import { JsonTaskRepository } from "../../../infrastructure/repositories/json-task.repository";
import { BaseCommand } from "./base.command";

export class StatsCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const getStatsUseCase = new GetStatsUseCase(repository);

      const stats = await getStatsUseCase.execute();
      this.displayStats(stats);
    } catch (error: any) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  private displayStats(stats: any): void {
    console.log("\n" + chalk.cyan.bold("📊 Task Statistics"));
    console.log(chalk.gray("═".repeat(50)));

    // Totals
    console.log(chalk.white.bold("📈 Totals:"));
    console.log(`  📝 Total Tasks: ${chalk.yellow(stats.total)}`);

    if (stats.total === 0) {
      console.log(
        chalk.yellow("\n  No tasks found. Add some tasks to see statistics!")
      );
      return;
    }

    // Status Breakdown
    console.log(chalk.white.bold("\n📊 Status Breakdown:"));
    console.log(
      `  ✅ Done: ${chalk.green(stats.done)} (${this.getBar(
        stats.done,
        stats.total,
        20
      )})`
    );
    console.log(
      `  ⏳ In Progress: ${chalk.blue(stats.inProgress)} (${this.getBar(
        stats.inProgress,
        stats.total,
        20
      )})`
    );
    console.log(
      `  📝 Todo: ${chalk.yellow(stats.todo)} (${this.getBar(
        stats.todo,
        stats.total,
        20
      )})`
    );

    // Completion Rate
    console.log(chalk.white.bold("\n🎯 Completion Rate:"));
    const rateColor =
      stats.completionRate >= 70
        ? chalk.green
        : stats.completionRate >= 40
        ? chalk.yellow
        : chalk.red;
    console.log(
      `  ${rateColor(`${stats.completionRate}%`)} ${this.getProgressBar(
        stats.completionRate
      )}`
    );

    // Activity
    console.log(chalk.white.bold("\n📅 Recent Activity:"));
    console.log(`  🆕 Recent (7 days): ${chalk.cyan(stats.recentTasks)} tasks`);
    console.log(
      `  🕰️  Old (>30 days): ${
        stats.oldTasks > 0
          ? chalk.red(stats.oldTasks)
          : chalk.green(stats.oldTasks)
      } tasks`
    );

    // Percentages
    console.log(chalk.white.bold("\n📊 Percentages:"));
    console.log(`  ✅ Done: ${this.getPercentage(stats.done, stats.total)}%`);
    console.log(
      `  ⏳ In Progress: ${this.getPercentage(stats.inProgress, stats.total)}%`
    );
    console.log(`  📝 Todo: ${this.getPercentage(stats.todo, stats.total)}%`);

    console.log(chalk.gray("═".repeat(50)));
  }

  private getBar(count: number, total: number, length: number): string {
    if (total === 0) return "─".repeat(length);
    const percentage = (count / total) * 100;
    const filledLength = Math.round((percentage / 100) * length);
    const bar = "█".repeat(filledLength) + "─".repeat(length - filledLength);
    return bar;
  }

  private getProgressBar(percentage: number): string {
    const length = 20;
    const filledLength = Math.round((percentage / 100) * length);
    const bar = "█".repeat(filledLength) + "░".repeat(length - filledLength);
    return bar;
  }

  private getPercentage(count: number, total: number): string {
    if (total === 0) return "0";
    return ((count / total) * 100).toFixed(1);
  }

  help(): string {
    return "Usage: task-cli stats\nDisplays statistics about your tasks";
  }
}
