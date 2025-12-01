import * as fs from "fs/promises";
import { ImportOptions } from "../../core/interfaces/export.interface";
import {
  CreateTaskDTO,
  TaskPriority,
  TaskStatus,
} from "../../core/interfaces/task.interface";

export class ImportService {
  async importFromJSON(options: ImportOptions): Promise<CreateTaskDTO[]> {
    const content = await fs.readFile(options.filePath, "utf-8");
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      throw new Error("JSON file must contain an array of tasks");
    }

    return data.map((item: any) => this.mapToCreateDTO(item));
  }

  async importFromCSV(options: ImportOptions): Promise<CreateTaskDTO[]> {
    const content = await fs.readFile(options.filePath, "utf-8");
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      throw new Error("CSV file must have at least a header and one data row");
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const dataLines = lines.slice(1);

    const tasks: CreateTaskDTO[] = [];

    for (const line of dataLines) {
      const values = this.parseCSVLine(line);
      const task: any = {};

      headers.forEach((header, index) => {
        if (index < values.length) {
          task[header] = values[index].trim();
        }
      });

      tasks.push(this.mapCSVToCreateDTO(task));
    }

    return tasks;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  private mapToCreateDTO(data: any): CreateTaskDTO {
    return {
      description: data.description || "",
      deadline: data.deadline || undefined,
      priority: this.validatePriority(data.priority),
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  }

  private mapCSVToCreateDTO(data: any): CreateTaskDTO {
    return {
      description: data.description || data.describe || "",
      deadline: data.deadline || data.due || undefined,
      priority: this.validatePriority(data.priority || data.importance),
      tags: data.tags
        ? data.tags
            .split(";")
            .map((t: string) => t.trim())
            .filter((t: string) => t)
        : [],
    };
  }

  private validatePriority(priority: string): TaskPriority {
    const validPriorities: TaskPriority[] = ["low", "medium", "high"];
    const normalized = (priority || "medium").toLowerCase() as TaskPriority;

    return validPriorities.includes(normalized) ? normalized : "medium";
  }

  private validateStatus(status: string): TaskStatus {
    const validStatuses: TaskStatus[] = ["todo", "in-progress", "done"];
    const normalized = (status || "todo").toLowerCase() as TaskStatus;

    return validStatuses.includes(normalized) ? normalized : "todo";
  }
}
