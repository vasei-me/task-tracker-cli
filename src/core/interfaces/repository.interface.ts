import {
  CreateTaskDTO,
  ITask,
  TaskFilters,
  TaskPriority,
  TaskStatus,
  UpdateTaskDTO,
} from "./task.interface";

export interface ITaskRepository {
  // Existing methods
  findAll(): Promise<ITask[]>;
  findById(id: number): Promise<ITask | null>;
  findByStatus(status: TaskStatus): Promise<ITask[]>;
  create(taskData: CreateTaskDTO): Promise<ITask>;
  update(id: number, taskData: UpdateTaskDTO): Promise<ITask>;
  delete(id: number): Promise<boolean>;
  getNextId(): Promise<number>;

  // New methods for phase 2
  findByPriority(priority: TaskPriority): Promise<ITask[]>;
  findByTag(tag: string): Promise<ITask[]>;
  findOverdue(): Promise<ITask[]>;
  findDueToday(): Promise<ITask[]>;
  findByFilters(filters: TaskFilters): Promise<ITask[]>;
}
