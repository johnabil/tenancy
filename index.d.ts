import {Schema, Connection} from 'mongoose';
import {Sequelize, Model as SqlModel} from 'sequelize';
import {MongoDriver} from './src/drivers/database/MongoDriver'
import {SqlDriver} from './src/drivers/database/SqlDriver'

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
        tenant_connection?: Connection | Sequelize;
        central_connection?: Connection | Sequelize;
        queue_connection?: string;
        tenant_schemas?: Record<string, Schema> | Array<(sequelize: Sequelize) => SqlModel>;
        central_schemas?: Record<string, Schema> | Array<(sequelize: Sequelize) => SqlModel>;

        [key: string]: unknown;
    }

    /**
     * Database utility functions
     */
    interface DatabaseUtils {
        getDriverClass(): MongoDriver | SqlDriver;

        resolveTenantConnection(connection: string, db_name: string, options?: object): Connection | Sequelize;

        resolveCentralConnection(options?: object): Connection | Sequelize;

        registerSchemas(connection: Connection | Sequelize, schemas: Record<string, Schema> | Array<(sequelize: Sequelize) => SqlModel>): void;

        getModel(model_name: string): SqlModel | Mongoose.Model;

        getDefaultTenantSchema(): Schema | ((sequelize: Sequelize) => SqlModel);
    }

    /**
     * Queue utility functions
     */
    interface QueueUtils {
        getConnectionUrl(): string;

        connect(url?: string, options?: object): Promise<object>;
    }

    /**
     * Express middleware function
     */
    type Middleware = (Request: object, Response: object, Next: object) => void | Promise<void>;

    /**
     * Main module interface
     */
    interface NodeTenancy {
        config: Config;
        db: DatabaseUtils;
        queue: QueueUtils;
        TenantSchema: Schema;
        DomainSchema: (sequelize: Sequelize) => SqlModel;
        initializeTenancyMiddleware: Middleware;
        initializeCentralMiddleware: Middleware;
    }
}

declare const nodeTenancy: NodeTenancy.NodeTenancy;

export = nodeTenancy;
