import { ITaskRepository } from "../../core/interfaces/repository.interface";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: number) {
    if (!id || id <= 0) {
      throw new Error("Invalid task ID");
    }

    const success = await this.taskRepository.delete(id);

    if (!success) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return success;
  }
}
