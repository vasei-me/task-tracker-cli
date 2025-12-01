import { InvalidTaskDescriptionException } from "../../core/exceptions/task.exception";
import { ITaskRepository } from "../../core/interfaces/repository.interface";

export class AddTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(description: string) {
    if (!description || description.trim().length === 0) {
      throw new InvalidTaskDescriptionException();
    }

    const task = await this.taskRepository.create({
      description: description.trim(),
    });

    return task;
  }
}
