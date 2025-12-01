#!/usr/bin/env node

import { Command } from "commander";
import { AddCommand } from "./presentation/cli/commands/add.command";
import { DeadlineCommand } from "./presentation/cli/commands/deadline.command";
import { DeleteCommand } from "./presentation/cli/commands/delete.command";
import { FilterCommand } from "./presentation/cli/commands/filter.command";
import { ListCommand } from "./presentation/cli/commands/list.command";
import { MarkCommand } from "./presentation/cli/commands/mark.command";
import { PrintCommand } from "./presentation/cli/commands/print.command";
import { PriorityCommand } from "./presentation/cli/commands/priority.command";
import { SearchCommand } from "./presentation/cli/commands/search.command";
import { StatsCommand } from "./presentation/cli/commands/stats.command";
import { TagCommand } from "./presentation/cli/commands/tag.command";
import { UpdateCommand } from "./presentation/cli/commands/update.command";
const program = new Command();

program
  .name("task-cli")
  .description("A CLI task tracker application built with SOLID principles")
  .version("1.0.0");

// Add command
program
  .command("add")
  .description("Add a new task")
  .argument("<description>", "Task description")
  .option("-d, --deadline <date>", "Deadline (YYYY-MM-DD or ISO format)")
  .option("-p, --priority <level>", "Priority: low, medium, high", "medium")
  .option("-t, --tags <tags>", "Comma-separated tags")
  .action(async (description, options) => {
    const command = new AddCommand();
    await command.execute({
      description,
      deadline: options.deadline,
      priority: options.priority,
      tags: options.tags,
    });
  });

// List command
program
  .command("list")
  .description("List tasks with detailed view")
  .argument("[status]", "Filter by status (todo, in-progress, done)")
  .action(async (status) => {
    const command = new ListCommand();
    await command.execute({ status });
  });

// Print command (table view)
program
  .command("print")
  .description("Print tasks in table format")
  .argument("[status]", "Filter by status (todo, in-progress, done)")
  .action(async (status) => {
    const command = new PrintCommand();
    await command.execute({ status });
  });

// Update command
program
  .command("update")
  .description("Update a task")
  .argument("<id>", "Task ID", parseInt)
  .argument("<description>", "New task description")
  .option("-d, --deadline <date>", 'Update deadline (use "null" to remove)')
  .option("-p, --priority <level>", "Update priority")
  .option("-t, --tags <tags>", "Update tags (comma-separated)")
  .action(async (id, description, options) => {
    const command = new UpdateCommand();
    await command.execute({
      id,
      description,
      deadline: options.deadline,
      priority: options.priority,
      tags: options.tags,
    });
  });

// Delete command
program
  .command("delete")
  .description("Delete a task")
  .argument("<id>", "Task ID", parseInt)
  .action(async (id) => {
    const command = new DeleteCommand();
    await command.execute({ id });
  });

// Mark as in-progress
program
  .command("mark-in-progress")
  .description("Mark a task as in progress")
  .argument("<id>", "Task ID", parseInt)
  .action(async (id) => {
    const command = new MarkCommand();
    await command.execute({ id, status: "in-progress" });
  });

// Mark as done
program
  .command("mark-done")
  .description("Mark a task as done")
  .argument("<id>", "Task ID", parseInt)
  .action(async (id) => {
    const command = new MarkCommand();
    await command.execute({ id, status: "done" });
  });

// Priority command
program
  .command("set-priority")
  .description("Set task priority")
  .argument("<id>", "Task ID", parseInt)
  .argument("<priority>", "Priority: low, medium, high")
  .action(async (id, priority) => {
    const command = new PriorityCommand();
    await command.execute({ id, priority });
  });

// Tag command
program
  .command("tag")
  .description("Manage task tags")
  .argument("<action>", "Action: add or remove")
  .argument("<id>", "Task ID", parseInt)
  .argument("<tag>", "Tag name")
  .action(async (action, id, tag) => {
    const command = new TagCommand();
    await command.execute({ action, id, tag });
  });

// Deadline command
program
  .command("deadline")
  .description("Set or clear task deadline")
  .argument("<id>", "Task ID", parseInt)
  .argument("<date>", 'Deadline date or "clear" to remove')
  .action(async (id, date) => {
    const command = new DeadlineCommand();
    await command.execute({ id, deadline: date });
  });

// Filter command
program
  .command("filter")
  .description("Filter tasks by multiple criteria")
  .option("-s, --status <status>", "Filter by status")
  .option("-p, --priority <priority>", "Filter by priority")
  .option("-t, --tag <tag>", "Filter by tag")
  .option("-o, --overdue", "Show only overdue tasks")
  .option("-d, --due-today", "Show only tasks due today")
  .action(async (options) => {
    const command = new FilterCommand();
    await command.execute(options);
  });

// Stats command
program
  .command("stats")
  .description("Display task statistics and insights")
  .action(async () => {
    const command = new StatsCommand();
    await command.execute({});
  });

// Search command
program
  .command("search")
  .description("Search tasks by keyword")
  .argument("<keyword>", "Search keyword")
  .option("-s, --status <status>", "Filter by status (todo, in-progress, done)")
  .option("-l, --limit <number>", "Limit number of results", "10")
  .action(async (keyword, options) => {
    const command = new SearchCommand();
    await command.execute({
      keyword,
      status: options.status,
      limit: parseInt(options.limit),
    });
  });

// Help command for individual commands
program
  .command("help")
  .description("Display help for a specific command")
  .argument("[command]", "Command name")
  .action((commandName) => {
    if (commandName) {
      const command = program.commands.find(
        (cmd) => cmd.name() === commandName
      );
      if (command) {
        command.help();
      } else {
        console.error(`Command '${commandName}' not found.`);
      }
    } else {
      program.help();
    }
  });

// Handle unknown commands
program.on("command:*", () => {
  console.error(
    "❌ Invalid command: %s\nSee 'task-cli --help' for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

// Show help if no arguments
if (!process.argv.slice(2).length) {
  console.log("🤖 Welcome to Task Tracker CLI!");
  console.log("================================\n");
  program.outputHelp();
  console.log("\n✨ Quick Start:");
  console.log('  task-cli add "My first task"');
  console.log("  task-cli list");
  console.log("  task-cli stats");
  console.log("\n🚀 Advanced Features:");
  console.log(
    '  task-cli add "Task" --deadline 2024-12-20 --priority high --tags "work,urgent"'
  );
  console.log("  task-cli filter --priority high --overdue");
  console.log("  task-cli set-priority 1 high");
}

program.parse(process.argv);
