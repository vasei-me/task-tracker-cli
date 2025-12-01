import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { TaskStatus } from "../../core/interfaces/task.interface";

export class ListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(status?: string) {
    // Validate status
    let validStatus: TaskStatus | undefined;
    if (status) {
      if (["todo", "in-progress", "done"].includes(status)) {
        validStatus = status as TaskStatus;
      } else {
        // Return all tasks if invalid status
        return await this.taskRepository.findAll();
      }
    }

    if (validStatus) {
      return await this.taskRepository.findByStatus(validStatus);
    }
    return await this.taskRepository.findAll();
  }
}
