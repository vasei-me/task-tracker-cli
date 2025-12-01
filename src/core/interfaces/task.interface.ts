export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask {
  id: number;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  description: string;
}

export interface UpdateTaskDTO {
  id?: number; // این را optional کردیم چون در repository قبلاً id داریم
  description?: string;
  status?: TaskStatus;
}
