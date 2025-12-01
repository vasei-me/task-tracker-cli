import { InvalidTaskDescriptionException } from "../../core/exceptions/task.exception";
import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { CreateTaskDTO } from "../../core/interfaces/task.interface";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(data: CreateTaskDTO) {
    if (!data.description || data.description.trim().length === 0) {
      throw new InvalidTaskDescriptionException();
    }

    // Validate priority
    if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
      throw new Error("Invalid priority. Must be: low, medium, or high");
    }

    // Validate deadline format if provided
    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error(
          "Invalid deadline format. Use YYYY-MM-DD or ISO format"
        );
      }
    }

    // Validate tags
    if (data.tags) {
      if (!Array.isArray(data.tags)) {
        throw new Error("Tags must be an array");
      }
      data.tags = data.tags
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }

    return await this.taskRepository.create({
      description: data.description.trim(),
      deadline: data.deadline,
      priority: data.priority,
      tags: data.tags,
    });
  }
}
