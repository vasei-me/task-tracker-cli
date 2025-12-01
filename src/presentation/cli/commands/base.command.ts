export abstract class BaseCommand {
  abstract execute(args: any): Promise<void>;
  abstract help(): string;
}
