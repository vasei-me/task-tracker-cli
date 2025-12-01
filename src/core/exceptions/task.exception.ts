export class TaskException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskException";
  }
}

export class TaskNotFoundException extends TaskException {
  constructor(taskId: number) {
    super(`Task with ID ${taskId} not found`);
    this.name = "TaskNotFoundException";
  }
}

export class InvalidTaskDescriptionException extends TaskException {
  constructor() {
    super("Task description cannot be empty");
    this.name = "InvalidTaskDescriptionException";
  }
}

export class InvalidTaskIdException extends TaskException {
  constructor() {
    super("Invalid task ID");
    this.name = "InvalidTaskIdException";
  }
}
