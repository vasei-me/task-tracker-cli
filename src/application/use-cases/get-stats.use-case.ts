import { ITaskRepository } from "../../core/interfaces/repository.interface";
import { TaskStats } from "../dto/stats.dto";

export class GetStatsUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(): Promise<TaskStats> {
    const allTasks = await this.taskRepository.findAll();

    if (allTasks.length === 0) {
      return this.getEmptyStats();
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: TaskStats = {
      total: allTasks.length,
      todo: allTasks.filter((task) => task.status === "todo").length,
      inProgress: allTasks.filter((task) => task.status === "in-progress")
        .length,
      done: allTasks.filter((task) => task.status === "done").length,
      completionRate: 0,
      recentTasks: allTasks.filter((task) => task.createdAt >= sevenDaysAgo)
        .length,
      oldTasks: allTasks.filter(
        (task) => task.updatedAt <= thirtyDaysAgo && task.status !== "done"
      ).length,
    };

    stats.completionRate = Math.round((stats.done / stats.total) * 100);

    return stats;
  }

  private getEmptyStats(): TaskStats {
    return {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      completionRate: 0,
      recentTasks: 0,
      oldTasks: 0,
    };
  }
}
