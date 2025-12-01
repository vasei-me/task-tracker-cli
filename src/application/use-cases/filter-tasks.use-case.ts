import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { TaskFilters } from "../../core/interfaces/task.interface";

export class FilterTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(filters: TaskFilters) {
    return await this.taskRepository.findByFilters(filters);
  }
}
