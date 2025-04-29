// Type definitions for node-tenancy
// Project: https://github.com/johnabil/tenancy
// Definitions by: node-tenancy team

import { Schema, Connection, Model } from 'mongoose';
import { Sequelize, ModelOptions } from 'sequelize';

declare namespace NodeTenancy {
  /**
   * Configuration interface
   */
  interface Config {
    setConfig(config: ConfigOptions): void;
    getConfig(): ConfigOptions;
  }

  /**
   * Configuration options
   */
  interface ConfigOptions {
    connection?: string;
    central_domains?: string[];
    tenant_id?: string;
    tenant_name?: string;
    tenant_connection?: Connection | Sequelize;
    central_connection?: Connection | Sequelize;
    queue_connection?: string;
    tenant_schemas?: Record<string, Schema> | Array<(sequelize: Sequelize) => any>;
    central_schemas?: Record<string, Schema> | Array<(sequelize: Sequelize) => any>;
    db_options?: Record<string, any>;
  }

  /**
   * Database utility functions
   */
  interface DatabaseUtils {
    getDriverClass(): any;
    resolveTenantConnection(connection: string, db_name: string, options?: object): Connection | Sequelize;
    resolveCentralConnection(options?: object): Connection | Sequelize;
    registerSchemas(connection: Connection | Sequelize, schemas: Record<string, Schema> | Array<(sequelize: Sequelize) => any>): void;
    getModel(model_name: string): Model<any> | any;
    getDefaultTenantSchema(): Schema | ((sequelize: Sequelize) => any);
  }

  /**
   * Queue utility functions
   */
  interface QueueUtils {
    getConnectionUrl(): string;
    connect(url?: string, options?: object): Promise<any>;
  }

  /**
   * Express middleware function
   */
  type Middleware = (req: any, res: any, next: any) => void | Promise<void>;

  /**
   * Main module interface
   */
  interface NodeTenancy {
    config: Config;
    db: DatabaseUtils;
    queue: QueueUtils;
    TenantSchema: Schema;
    DomainSchema: (sequelize: Sequelize) => any;
    initializeTenancyMiddleware: Middleware;
    initializeCentralMiddleware: Middleware;
  }
}

declare const nodeTenancy: NodeTenancy.NodeTenancy;

export = nodeTenancy; 