import { InvalidTaskDescriptionException } from "../../core/exceptions/task.exception";
import { ITaskRepository } from "../../core/interfaces/repository.interface";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number, description: string) {
    if (!description || description.trim().length === 0) {
      throw new InvalidTaskDescriptionException();
    }

    if (!id || id <= 0) {
      throw new Error("Invalid task ID");
    }

    const task = await this.taskRepository.update(id, {
      id, // اینجا id را اضافه کردیم
      description: description.trim(),
    });

    return task;
  }
}
