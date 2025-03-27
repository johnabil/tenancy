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
  .option('--path', 'provide custom migration path (default /app/migrations/tenants)')
  .option('-t, --tenants <array>', 'tenants array ids')
  .action((options) => {
    try {
      let tenants;
      const migrations_path = options.path ? path.resolve(options.path) : default_migrations_path;

      if (options.tenants.length > 0) {
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
          console.log(`Migrating Tenant -- ${tenant.id} \n`);

          const db_url = `${tenant.db_connection}${tenant.db_name}`
          const process = spawn("sequelize db:migrate", [`--url ${db_url}`, `--migrations-path ${migrations_path}`]);

          process.stdout.on("data", (data) => {
            console.log(`Output: ${data}`);
          });

          process.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
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
  .option('--path', 'provide custom migration path (default /app/migrations/tenants)')
  .option('-t, --tenants <array>', 'tenants array ids')
  .action((options) => {
    try {
      let tenants;
      const migrations_path = options.path ? path.resolve(options.path) : default_migrations_path;

      if (options.tenants.length > 0) {
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
          console.log(`Rolling back Tenant -- ${tenant.id} \n`);

          const db_url = `${tenant.db_connection}${tenant.db_name}`
          const process = spawn("sequelize db:migrate:undo", [`--url ${db_url}`, `--migrations-path ${migrations_path}`]);

          process.stdout.on("data", (data) => {
            console.log(`Output: ${data}`);
          });

          process.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
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
  .option('--path', 'provide custom migration path (default /app/migrations/tenants)')
  .option('-t, --tenants <array>', 'tenants array ids')
  .action((options) => {
    try {
      let tenants;
      const migrations_path = options.path ? path.resolve(options.path) : default_migrations_path;

      if (options.tenants.length > 0) {
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
          console.log(`Rolling back Tenant -- ${tenant.id} \n`);

          const db_url = `${tenant.db_connection}${tenant.db_name}`
          const process = spawn("sequelize db:migrate:undo:all", [`--url ${db_url}`, `--migrations-path ${migrations_path}`]);

          process.stdout.on("data", (data) => {
            console.log(`Output: ${data}`);
          });

          process.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
          });
        });
      });

    } catch (error) {
      throw error;
    }
  });

program.parse();
