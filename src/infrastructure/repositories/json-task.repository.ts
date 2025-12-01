import { Task } from "../../core/entities/task.entity";
import { TaskNotFoundException } from "../../core/exceptions/task.exception";
import { ITaskRepository } from "../../core/interfaces/repository.interface";
import {
  CreateTaskDTO,
  ITask,
  TaskStatus,
  UpdateTaskDTO,
} from "../../core/interfaces/task.interface";
import { JSONFileHandler } from "../file-system/json-file.handler";

export class JsonTaskRepository implements ITaskRepository {
  private readonly fileHandler: JSONFileHandler;
  private readonly filePath = "./tasks.json";

  constructor() {
    this.fileHandler = new JSONFileHandler(this.filePath);
  }

  async findAll(): Promise<ITask[]> {
    const data = await this.fileHandler.read();
    return data.map((item: any) => this.mapToEntity(item));
  }

  async findById(id: number): Promise<ITask | null> {
    const tasks = await this.findAll();
    return tasks.find((task) => task.id === id) || null;
  }

  async findByStatus(status: TaskStatus): Promise<ITask[]> {
    const tasks = await this.findAll();
    return tasks.filter((task) => task.status === status);
  }

  async create(taskData: CreateTaskDTO): Promise<ITask> {
    const tasks = await this.findAll();
    const nextId = await this.getNextId();

    const newTask = new Task(nextId, taskData.description);

    tasks.push(newTask);
    await this.fileHandler.write(tasks.map((task) => this.mapToObject(task)));

    return newTask;
  }

  async update(id: number, taskData: UpdateTaskDTO): Promise<ITask> {
    const tasks = await this.findAll();
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new TaskNotFoundException(id);
    }

    const task = tasks[index] as Task; // Type assertion برای دسترسی به متدها

    if (taskData.description) {
      task.updateDescription(taskData.description);
    }

    if (taskData.status) {
      task.updateStatus(taskData.status);
    }

    await this.fileHandler.write(tasks.map((t) => this.mapToObject(t)));
    return task;
  }

  async delete(id: number): Promise<boolean> {
    const tasks = await this.findAll();
    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === tasks.length) {
      return false;
    }

    await this.fileHandler.write(
      filteredTasks.map((task) => this.mapToObject(task))
    );
    return true;
  }

  async getNextId(): Promise<number> {
    const tasks = await this.findAll();
    if (tasks.length === 0) return 1;

    const maxId = Math.max(...tasks.map((task) => task.id));
    return maxId + 1;
  }

  private mapToEntity(data: any): Task {
    return new Task(
      data.id,
      data.description,
      data.status,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  private mapToObject(task: ITask): any {
    return {
      id: task.id,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
