import { Task } from "../../core/entities/task.entity";
import { TaskNotFoundException } from "../../core/exceptions/task.exception";
import { ITaskRepository } from "../../core/interfaces/repository.interface";
import {
  CreateTaskDTO,
  ITask,
  TaskFilters,
  TaskPriority,
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

    const newTask = new Task(
      nextId,
      taskData.description,
      "todo", // default status
      new Date(),
      new Date(),
      taskData.deadline ? new Date(taskData.deadline) : undefined,
      taskData.priority || "medium",
      taskData.tags || []
    );

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

    const task = tasks[index] as Task;

    if (taskData.description !== undefined) {
      task.updateDescription(taskData.description);
    }

    if (taskData.status) {
      task.updateStatus(taskData.status);
    }

    if (taskData.priority !== undefined) {
      task.updatePriority(taskData.priority);
    }

    if (taskData.deadline !== undefined) {
      task.setDeadline(
        taskData.deadline ? new Date(taskData.deadline) : undefined
      );
    }

    if (taskData.tags !== undefined) {
      task.tags = taskData.tags;
      task.updatedAt = new Date();
    }

    await this.fileHandler.write(tasks.map((t) => this.mapToObject(t)));
    return task;
  }

  async delete(id: number): Promise<boolean> {
    const tasks = await this.findAll();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === initialLength) {
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

  async findByPriority(priority: TaskPriority): Promise<ITask[]> {
    const tasks = await this.findAll();
    return tasks.filter((task) => task.priority === priority);
  }

  async findByTag(tag: string): Promise<ITask[]> {
    const tasks = await this.findAll();
    return tasks.filter((task) => task.tags.includes(tag));
  }

  async findOverdue(): Promise<ITask[]> {
    const tasks = await this.findAll();
    return tasks.filter((task) => {
      if (!task.deadline || task.status === "done") return false;
      return new Date() > new Date(task.deadline);
    });
  }

  async findDueToday(): Promise<ITask[]> {
    const tasks = await this.findAll();
    const today = new Date();

    return tasks.filter((task) => {
      if (!task.deadline) return false;
      const deadline = new Date(task.deadline);

      return (
        deadline.getDate() === today.getDate() &&
        deadline.getMonth() === today.getMonth() &&
        deadline.getFullYear() === today.getFullYear()
      );
    });
  }

  async findByFilters(filters: TaskFilters): Promise<ITask[]> {
    let tasks = await this.findAll();

    if (filters.status) {
      tasks = tasks.filter((task: ITask) => task.status === filters.status);
    }

    if (filters.priority) {
      tasks = tasks.filter((task: ITask) => task.priority === filters.priority);
    }

    if (filters.tag) {
      tasks = tasks.filter((task: ITask) => task.tags.includes(filters.tag!));
    }

    if (filters.overdue) {
      tasks = tasks.filter((task: ITask) => {
        if (!task.deadline || task.status === "done") return false;
        return new Date() > new Date(task.deadline);
      });
    }

    if (filters.dueToday) {
      const today = new Date();
      tasks = tasks.filter((task: ITask) => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);

        return (
          deadline.getDate() === today.getDate() &&
          deadline.getMonth() === today.getMonth() &&
          deadline.getFullYear() === today.getFullYear()
        );
      });
    }

    return tasks;
  }

  private mapToEntity(data: any): Task {
    return new Task(
      data.id,
      data.description,
      data.status,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.deadline ? new Date(data.deadline) : undefined,
      data.priority || "medium",
      data.tags || []
    );
  }

  private mapToObject(task: ITask): any {
    return {
      id: task.id,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      deadline: task.deadline ? task.deadline.toISOString() : null,
      priority: task.priority,
      tags: task.tags,
    };
  }
}
