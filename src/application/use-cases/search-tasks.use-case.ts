import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { TaskStatus } from "../../core/interfaces/task.interface";

export interface SearchCriteria {
  keyword?: string;
  status?: TaskStatus;
  limit?: number;
}

export class SearchTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(criteria: SearchCriteria): Promise<any[]> {
    const allTasks = await this.taskRepository.findAll();

    // If no keyword, return all tasks (or filtered by status)
    if (!criteria.keyword || criteria.keyword.trim() === "") {
      let result = allTasks;

      // Filter by status if provided
      if (criteria.status) {
        result = result.filter((task) => task.status === criteria.status);
      }

      // Sort and limit
      result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      if (criteria.limit && result.length > criteria.limit) {
        result = result.slice(0, criteria.limit);
      }

      return result;
    }

    // Normalize keyword
    const normalizedKeyword = criteria.keyword.toLowerCase().trim();

    let filteredTasks = allTasks.filter((task) => {
      // Case-insensitive keyword search
      const normalizedDescription = task.description.toLowerCase();

      if (!normalizedDescription.includes(normalizedKeyword)) {
        return false;
      }

      // Status filter
      if (criteria.status && task.status !== criteria.status) {
        return false;
      }

      return true;
    });

    // Sort by updated date (newest first)
    filteredTasks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    // Apply limit
    if (criteria.limit && filteredTasks.length > criteria.limit) {
      filteredTasks = filteredTasks.slice(0, criteria.limit);
    }

    return filteredTasks;
  }
}
