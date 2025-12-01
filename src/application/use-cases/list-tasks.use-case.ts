import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { TaskStatus } from "../../core/interfaces/task.interface";

export class ListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(status?: TaskStatus) {
    if (status) {
      return await this.taskRepository.findByStatus(status);
    }
    return await this.taskRepository.findAll();
  }
}
