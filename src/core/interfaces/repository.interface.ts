import {
  CreateTaskDTO,
  ITask,
  TaskStatus,
  UpdateTaskDTO,
} from "./task.interface";

export interface ITaskRepository {
  findAll(): Promise<ITask[]>;
  findById(id: number): Promise<ITask | null>;
  findByStatus(status: TaskStatus): Promise<ITask[]>;
  create(taskData: CreateTaskDTO): Promise<ITask>;
  update(id: number, taskData: UpdateTaskDTO): Promise<ITask>;
  delete(id: number): Promise<boolean>;
  getNextId(): Promise<number>;
}
