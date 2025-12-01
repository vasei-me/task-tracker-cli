import { BaseCommand } from './base.command';
import { JsonTaskRepository } from '../../../infrastructure/repositories/json-task.repository';
import { UpdateTaskUseCase } from '../../../application/use-cases/update-task.use-case';

export class DeadlineCommand extends BaseCommand {
  async execute(args: any): Promise<void> {
    try {
      const repository = new JsonTaskRepository();
      const updateTaskUseCase = new UpdateTaskUseCase(repository);
      
      // Convert "clear" to undefined
      const deadline = args.deadline === 'clear' ? undefined : args.deadline;
      
      const task = await updateTaskUseCase.execute(args.id, { deadline });
      
      if (args.deadline === 'clear') {
        console.log(`✅ Deadline cleared for task (ID: ${task.id})`);
      } else {
        const deadlineDate = new Date(args.deadline);
        const now = new Date();
        const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        console.log(`✅ Deadline set for task (ID: ${task.id})`);
        console.log(`   Date: ${deadlineDate.toLocaleDateString()}`);
        console.log(`   Days remaining: ${diffDays}`);
        
        if (diffDays < 0) {
          console.log(`   ⚠️  This task is overdue by ${Math.abs(diffDays)} days!`);
        } else if (diffDays === 0) {
          console.log(`   ⚠️  This task is due today!`);
        } else if (diffDays <= 3) {
          console.log(`   ⚠️  This task is due in ${diffDays} days`);
        }
      }
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  help(): string {
    return 'Usage: task-cli deadline <id> <date|clear>\n' +
           'Sets or clears task deadline\n' +
           'Date format: YYYY-MM-DD or ISO format\n' +
           'Use "clear" to remove deadline\n' +
           '\nExamples:\n' +
           '  task-cli deadline 1 2024-12-15\n' +
           '  task-cli deadline 1 clear';
  }
}
