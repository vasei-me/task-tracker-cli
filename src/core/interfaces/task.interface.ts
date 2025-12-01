export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask {
  id: number;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  priority: TaskPriority;
  tags: string[];
}

export interface CreateTaskDTO {
  description: string;
  deadline?: string; // ISO string
  priority?: TaskPriority;
  tags?: string[];
}

export interface UpdateTaskDTO {
  id?: number;
  description?: string;
  status?: TaskStatus;
  deadline?: string | null; // ISO string or null to remove
  priority?: TaskPriority;
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  overdue?: boolean;
  dueToday?: boolean;
}
