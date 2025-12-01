import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { TaskStatus } from "../../core/interfaces/task.interface";

export class MarkTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number, status: TaskStatus) {
    if (!id || id <= 0) {
      throw new Error("Invalid task ID");
    }

    const task = await this.taskRepository.update(id, {
      id, // اینجا id را اضافه کردیم
      status,
    });

    return task;
  }
}
