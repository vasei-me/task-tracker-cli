import { ReportOptions } from "../../core/interfaces/export.interface";
import { ITask } from "../../core/interfaces/task.interface";

export class ReportService {
  generateWeeklyReport(tasks: ITask[], options: ReportOptions): string {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentTasks = tasks.filter(
      (task) => new Date(task.createdAt) >= oneWeekAgo
    );

    const completedTasks = tasks.filter(
      (task) => task.status === "done" && new Date(task.updatedAt) >= oneWeekAgo
    );

    const inProgressTasks = tasks.filter(
      (task) => task.status === "in-progress"
    );

    let report = `# Weekly Report\n\n`;
    report += `Period: ${oneWeekAgo.toLocaleDateString()} to ${now.toLocaleDateString()}\n`;
    report += `Generated: ${now.toLocaleString()}\n\n`;

    report += `## 📊 Summary\n\n`;
    report += `- Total Tasks: ${tasks.length}\n`;
    report += `- New This Week: ${recentTasks.length}\n`;
    report += `- Completed This Week: ${completedTasks.length}\n`;
    report += `- In Progress: ${inProgressTasks.length}\n`;
    report += `- Completion Rate: ${this.calculateCompletionRate(tasks)}%\n\n`;

    report += `## 🎯 Tasks by Priority\n\n`;
    report += this.generatePriorityStats(tasks);

    report += `## 📅 Overdue Tasks\n\n`;
    const overdueTasks = tasks.filter((task) => this.isOverdue(task));
    if (overdueTasks.length > 0) {
      overdueTasks.forEach((task) => {
        const overdueDays = this.getOverdueDays(task);
        report += `- ⚠️  **${task.description}** (ID: ${task.id}) - Overdue by ${overdueDays} days\n`;
      });
    } else {
      report += `No overdue tasks 🎉\n`;
    }

    report += `\n## 🏆 Top Priorities for Next Week\n\n`;
    const highPriorityTasks = tasks
      .filter((task) => task.priority === "high" && task.status !== "done")
      .slice(0, 5);

    if (highPriorityTasks.length > 0) {
      highPriorityTasks.forEach((task) => {
        report += `- ⭐ **${task.description}** (ID: ${task.id})\n`;
      });
    } else {
      report += `No high priority tasks remaining 🎉\n`;
    }

    return report;
  }

  generateProductivityReport(tasks: ITask[]): string {
    const completedTasks = tasks.filter((task) => task.status === "done");
    const completionTimes = completedTasks.map((task) => {
      const createdAt = new Date(task.createdAt);
      const completedAt = new Date(task.updatedAt);
      return (
        (completedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ); // days
    });

    const avgCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;

    let report = `# Productivity Report\n\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    report += `## 📈 Performance Metrics\n\n`;
    report += `- Total Tasks: ${tasks.length}\n`;
    report += `- Completed Tasks: ${completedTasks.length}\n`;
    report += `- Completion Rate: ${this.calculateCompletionRate(tasks)}%\n`;
    report += `- Avg. Completion Time: ${avgCompletionTime.toFixed(
      1
    )} days\n\n`;

    report += `## 🏅 Most Productive Period\n\n`;
    report += this.analyzeProductivityPatterns(tasks);

    report += `## 📊 Priority Distribution\n\n`;
    report += this.generatePriorityStats(tasks);

    return report;
  }

  printBurnDownChart(tasks: ITask[]): void {
    console.log("\n📉 Burn Down Chart");
    console.log("═".repeat(60));

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const remainingTasks = totalTasks - completedTasks;

    const progress = Math.round((completedTasks / totalTasks) * 100);
    const barLength = 40;
    const filledLength = Math.round((progress / 100) * barLength);

    console.log(`Total Tasks: ${totalTasks}`);
    console.log(`Completed: ${completedTasks}`);
    console.log(`Remaining: ${remainingTasks}`);
    console.log(`Progress: ${progress}%\n`);

    console.log(
      "[" +
        "█".repeat(filledLength) +
        "░".repeat(barLength - filledLength) +
        "]"
    );

    // Weekly breakdown (last 4 weeks)
    console.log("\n📅 Last 4 Weeks:");
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

      const weekTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });

      const weekCompleted = weekTasks.filter((t) => t.status === "done").length;
      const weekProgress =
        weekTasks.length > 0
          ? Math.round((weekCompleted / weekTasks.length) * 100)
          : 0;

      console.log(
        `  Week ${4 - i}: ${
          weekTasks.length
        } tasks, ${weekCompleted} completed (${weekProgress}%)`
      );
    }
  }

  private calculateCompletionRate(tasks: ITask[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === "done").length;
    return Math.round((completed / tasks.length) * 100);
  }

  private generatePriorityStats(tasks: ITask[]): string {
    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let stats = "";
    const priorities = ["high", "medium", "low"] as const;

    priorities.forEach((priority) => {
      const count = byPriority[priority] || 0;
      const percentage =
        tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
      const barLength = 20;
      const filledLength = Math.round((percentage / 100) * barLength);

      const icon =
        priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢";
      stats += `${icon} ${priority.toUpperCase()}: ${count} tasks (${percentage}%) `;
      stats +=
        "[" +
        "█".repeat(filledLength) +
        "░".repeat(barLength - filledLength) +
        "]\n";
    });

    return stats + "\n";
  }

  private isOverdue(task: ITask): boolean {
    if (!task.deadline || task.status === "done") return false;
    return new Date() > new Date(task.deadline);
  }

  private getOverdueDays(task: ITask): number {
    if (!task.deadline) return 0;
    const now = new Date();
    const deadline = new Date(task.deadline);
    return Math.floor(
      (now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private analyzeProductivityPatterns(tasks: ITask[]): string {
    const completedTasks = tasks.filter((t) => t.status === "done");

    if (completedTasks.length === 0) {
      return "No completed tasks to analyze\n\n";
    }

    // Group by day of week
    const byDay: Record<string, number> = {};
    completedTasks.forEach((task) => {
      const day = new Date(task.updatedAt).toLocaleDateString("en-US", {
        weekday: "long",
      });
      byDay[day] = (byDay[day] || 0) + 1;
    });

    // Find most productive day
    const mostProductiveDay = Object.entries(byDay).sort(
      (a, b) => b[1] - a[1]
    )[0];

    let analysis = `- Most productive day: **${mostProductiveDay[0]}** (${mostProductiveDay[1]} tasks)\n`;
    analysis += `- Average tasks per day: ${(completedTasks.length / 7).toFixed(
      1
    )}\n\n`;

    return analysis;
  }
}
