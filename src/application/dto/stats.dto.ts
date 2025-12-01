export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionRate: number;
  recentTasks: number; // Tasks created in last 7 days
  oldTasks: number; // Tasks older than 30 days without update
}

export class StatsResponseDTO {
  constructor(public stats: TaskStats, public message: string) {}
}
