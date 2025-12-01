export class TaskResponseDTO {
  constructor(
    public id: number,
    public description: string,
    public status: string,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static fromTask(task: any): TaskResponseDTO {
    return new TaskResponseDTO(
      task.id,
      task.description,
      task.status,
      task.createdAt.toISOString(),
      task.updatedAt.toISOString()
    );
  }
}
