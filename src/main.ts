#!/usr/bin/env node

import { Command } from "commander";
import { AddCommand } from "./presentation/cli/commands/add.command";
import { DeleteCommand } from "./presentation/cli/commands/delete.command";
import { ListCommand } from "./presentation/cli/commands/list.command";
import { MarkCommand } from "./presentation/cli/commands/mark.command";
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
  .description("List tasks")
  .argument("[status]", "Filter by status (todo, in-progress, done)")
  .action(async (status) => {
    const command = new ListCommand();
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

// Handle unknown commands
program.on("command:*", () => {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
