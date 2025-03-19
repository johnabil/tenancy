#!/usr/bin/env node

const {Command} = require("commander");
const program = new Command();
const {spawn} = require("child_process");


program.name("tenancy-db")
  .description("Migration CLI for sql drivers")

//migrating to database
program
  .command("migrate")
  .description("Migrate central or tenants database")
  .action(() => {
    const process = spawn("mycli", ["generate", "report", "-t", "pdf"]);

    process.stdout.on("data", (data) => {
      console.log(`Output: ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    process.on("close", (code) => {
      console.log(`Process exited with code ${code}`);
    });
  });

//migration rollback
program
  .command("rollback-migration")
  .description("Generate a new file")
  .option("-t, --type <type>", "Specify the file type", "txt")
  .action((file, options) => {
    console.log(`Generating ${file}.${options.type}...`);
  });

program.parse();
