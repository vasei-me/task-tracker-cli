import { ITask, TaskStatus } from "../interfaces/task.interface";

export class Task implements ITask {
  constructor(
    public id: number,
    public description: string,
    public status: TaskStatus = "todo",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  markInProgress(): void {
    this.status = "in-progress";
    this.updatedAt = new Date();
  }

  markDone(): void {
    this.status = "done";
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updateStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }
}
