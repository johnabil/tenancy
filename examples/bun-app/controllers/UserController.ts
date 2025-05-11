import {config, db} from "node-tenancy"

export function getUsersCount() {
    return db.getModel('User').countDocuments().then((usersCount: any) => {
        return {
            'tenant_id': config.getConfig()?.tenant_id,
            'users_count': usersCount,
        };
    });
}
