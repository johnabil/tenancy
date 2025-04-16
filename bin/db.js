#!/usr/bin/env node
require('dotenv').config();

const path = require('path');
const {Command} = require("commander");
const {spawn} = require("child_process");
const {QueryTypes} = require('sequelize');
const DatabaseDriver = require("../src/utils/db");
const program = new Command();
const default_migrations_path = path.resolve('migrations', 'tenants');
const connection = DatabaseDriver.resolveCentralConnection();

program.name("tenancy-db")
  .description("Migration CLI for sql drivers");

//migrating to database
program
  .command("migrate")
  .description("Apply migrations to tenants")
  .option('--path <path>', 'provide custom migration path (default migrations/tenants)')
  .option('-t, --tenants <array>', 'tenants array ids')
  .action((options) => {
    try {
      let tenants;
      const migrations_path = options.path ? path.resolve(options.path) : default_migrations_path;

      if (options?.tenants?.length > 0) {
        options.tenants = options.tenants.split(/\s*,\s*/);

        tenants = connection.query('select * from tenants where id in (:tenant_ids)', {
          replacements: {tenant_ids: options.tenants},
          type: QueryTypes.SELECT
        });
      } else {
        tenants = connection.query('select * from tenants', {
          type: QueryTypes.SELECT
        });
      }

      tenants.then(tenants => {
        tenants.forEach(tenant => {
          const db_url = `${tenant.db_connection}${tenant.db_name}`
          const args = [`db:migrate`, `--url`, `'${db_url}'`, `--migrations-path`, `'${migrations_path}'`];
          const command = spawn("sequelize", args);

          command.stdout.on("data", (data) => {
            console.log(`${data}`);
          });

          command.stderr.on("data", (data) => {
            console.error(`${data}`);
            process.exit(1);
          });

          command.on('close', (code) => {
            if (code === 0) {
              process.exit(0);
            } else {
              process.exit(code);
            }
          });
        });
      });

    } catch (error) {
      throw error;
    }
  });

//rollback migration
program
  .command("migrate:rollback")
  .description("Rollback latest migration")
  .option('--path <path>', 'provide custom migration path (default migrations/tenants)')
  .option('-t, --tenants <array>', 'tenants array ids')
  .action((options) => {
    try {
      let tenants;
      const migrations_path = options.path ? path.resolve(options.path) : default_migrations_path;

      if (options?.tenants?.length > 0) {
        options.tenants = options.tenants.split(/\s*,\s*/);

        tenants = connection.query('select * from tenants where id in (:tenant_ids)', {
          replacements: {tenant_ids: options.tenants},
          type: QueryTypes.SELECT
        });
      } else {
        tenants = connection.query('select * from tenants', {
          type: QueryTypes.SELECT
        });
      }

      tenants.then(tenants => {
        tenants.forEach(tenant => {
          const db_url = `${tenant.db_connection}${tenant.db_name}`
          const args = [`db:migrate:undo`, `--url`, `'${db_url}'`, `--migrations-path`, `'${migrations_path}'`];
          const command = spawn("sequelize", args);

          command.stdout.on("data", (data) => {
            console.log(`${data}`);
          });

          command.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
            process.exit(1);
          });

          command.on('close', (code) => {
            if (code === 0) {
              process.exit(0);
            } else {
              process.exit(code);
            }
          });
        });
      });

    } catch (error) {
      throw error;
    }
  });

//rollback all migrations
program
  .command("migrate:fresh")
  .description("Rollback all migrations")
  .option('--path <path>', 'provide custom migration path (default migrations/tenants)')
  .option('-t, --tenants <array>', 'tenants array ids')
  .action((options) => {
    try {
      let tenants;
      const migrations_path = options.path ? path.resolve(options.path) : default_migrations_path;

      if (options?.tenants?.length > 0) {
        options.tenants = options.tenants.split(/\s*,\s*/);

        tenants = connection.query('select * from tenants where id in (:tenant_ids)', {
          replacements: {tenant_ids: options.tenants},
          type: QueryTypes.SELECT
        });
      } else {
        tenants = connection.query('select * from tenants', {
          type: QueryTypes.SELECT
        });
      }

      tenants.then(tenants => {
        tenants.forEach(tenant => {
          const db_url = `${tenant.db_connection}${tenant.db_name}`
          const args = [`db:migrate:undo:all`, `--url`, `'${db_url}'`, `--migrations-path`, `'${migrations_path}'`];
          const command = spawn("sequelize", args);

          command.stdout.on("data", (data) => {
            console.log(`${data}`);
          });

          command.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
            process.exit(1);
          });

          command.on('close', (code) => {
            if (code === 0) {
              process.exit(0);
            } else {
              process.exit(code);
            }
          });
        });
      });

    } catch (error) {
      throw error;
    }
  });

program.parse();
