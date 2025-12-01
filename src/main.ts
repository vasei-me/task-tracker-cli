#!/usr/bin/env node

import { Command } from "commander";
import { AddCommand } from "./presentation/cli/commands/add.command";
import { DeleteCommand } from "./presentation/cli/commands/delete.command";
import { ListCommand } from "./presentation/cli/commands/list.command";
import { MarkCommand } from "./presentation/cli/commands/mark.command";
import { PrintCommand } from "./presentation/cli/commands/print.command";
import { SearchCommand } from "./presentation/cli/commands/search.command";
import { StatsCommand } from "./presentation/cli/commands/stats.command";
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
  .action(async (description) => {
    const command = new AddCommand();
    await command.execute({ description });
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
  .action(async (id, description) => {
    const command = new UpdateCommand();
    await command.execute({ id, description });
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
}

program.parse(process.argv);
