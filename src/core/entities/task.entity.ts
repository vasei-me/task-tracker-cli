import { ITask, TaskPriority, TaskStatus } from "../interfaces/task.interface";

export class Task implements ITask {
  constructor(
    public id: number,
    public description: string,
    public status: TaskStatus = "todo",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deadline?: Date,
    public priority: TaskPriority = "medium",
    public tags: string[] = []
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

  updatePriority(priority: TaskPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  setDeadline(deadline: Date | undefined): void {
    this.deadline = deadline;
    this.updatedAt = new Date();
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
    this.updatedAt = new Date();
  }

  isOverdue(): boolean {
    if (!this.deadline || this.status === "done") return false;
    return new Date() > this.deadline;
  }

  isDueToday(): boolean {
    if (!this.deadline) return false;
    const today = new Date();
    const deadline = new Date(this.deadline);

    return (
      deadline.getDate() === today.getDate() &&
      deadline.getMonth() === today.getMonth() &&
      deadline.getFullYear() === today.getFullYear()
    );
  }
}
