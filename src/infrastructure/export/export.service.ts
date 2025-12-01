import * as fs from "fs/promises";
import * as path from "path";
import { ExportOptions } from "../../core/interfaces/export.interface";
import { ITask } from "../../core/interfaces/task.interface";

export class ExportService {
  async exportToJSON(tasks: ITask[], options: ExportOptions): Promise<string> {
    const data = JSON.stringify(tasks, null, 2);

    if (options.outputPath) {
      await this.ensureDirectory(options.outputPath);
      await fs.writeFile(options.outputPath, data, "utf-8");
    }

    return data;
  }

  async exportToCSV(tasks: ITask[], options: ExportOptions): Promise<string> {
    const headers = [
      "ID",
      "Description",
      "Status",
      "Priority",
      "Deadline",
      "Tags",
      "Created",
      "Updated",
    ];
    const rows = tasks.map((task) => {
      return [
        task.id.toString(),
        `"${task.description.replace(/"/g, '""')}"`,
        task.status,
        task.priority,
        task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "",
        task.tags.join(";"),
        new Date(task.createdAt).toISOString(),
        new Date(task.updatedAt).toISOString(),
      ].join(",");
    });

    let csv = "";
    if (options.includeHeader !== false) {
      csv = headers.join(",") + "\n";
    }
    csv += rows.join("\n");

    if (options.outputPath) {
      await this.ensureDirectory(options.outputPath);
      await fs.writeFile(options.outputPath, csv, "utf-8");
    }

    return csv;
  }

  async exportToMarkdown(
    tasks: ITask[],
    options: ExportOptions
  ): Promise<string> {
    let markdown = `# Task Report\n\n`;
    markdown += `Generated: ${new Date().toLocaleString()}\n`;
    markdown += `Total Tasks: ${tasks.length}\n\n`;

    // Group by status
    const byStatus = this.groupByStatus(tasks);

    for (const [status, statusTasks] of Object.entries(byStatus)) {
      markdown += `## ${status.toUpperCase()} (${statusTasks.length})\n\n`;

      if (statusTasks.length === 0) {
        markdown += `No tasks\n\n`;
        continue;
      }

      markdown += `| ID | Description | Priority | Deadline | Tags |\n`;
      markdown += `|----|-------------|----------|----------|------|\n`;

      statusTasks.forEach((task) => {
        const deadline = task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "-";
        const tags = task.tags.length > 0 ? task.tags.join(", ") : "-";

        markdown += `| ${task.id} | ${task.description} | ${task.priority} | ${deadline} | ${tags} |\n`;
      });

      markdown += "\n";
    }

    if (options.outputPath) {
      await this.ensureDirectory(options.outputPath);
      await fs.writeFile(options.outputPath, markdown, "utf-8");
    }

    return markdown;
  }

  printTable(tasks: ITask[]): void {
    console.log("\n📊 Task Export Table");
    console.log("═".repeat(100));

    const headers = ["ID", "Description", "Status", "Priority", "Deadline"];
    console.log(headers.map((h) => h.padEnd(20)).join(" │ "));
    console.log("─".repeat(100));

    tasks.forEach((task) => {
      const deadline = task.deadline
        ? new Date(task.deadline).toLocaleDateString()
        : "No deadline";

      const row = [
        task.id.toString().padEnd(20),
        this.truncateText(task.description, 18).padEnd(20),
        task.status.padEnd(20),
        task.priority.padEnd(20),
        deadline.padEnd(20),
      ].join(" │ ");

      console.log(row);
    });

    console.log("═".repeat(100));
    console.log(`Total: ${tasks.length} tasks`);
  }

  private groupByStatus(tasks: ITask[]): Record<string, ITask[]> {
    return tasks.reduce((groups, task) => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups[task.status].push(task);
      return groups;
    }, {} as Record<string, ITask[]>);
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  private async ensureDirectory(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}
