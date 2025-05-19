import {Elysia} from "elysia";
import {APIRoutes} from "../routes/APIRoutes";
import {config, TenantSchema} from "node-tenancy";
import {Schema} from "mongoose";
// import {getMessages, publishMessage} from "../controllers/RabbitmqController";
import {getMessages, publishMessage} from "../controllers/RedisController";

const app = new Elysia();

interface User {
    username: string;
    email: string;
    active: boolean;
    createdAt: Date;
}

const userSchema = new Schema<User>({
    username: String,
    email: {type: String, required: true},
    active: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});

getMessages('test', true).then().catch(e => console.log(e));
publishMessage('test', {'message': 'test'}, true).then().catch(e => console.log(e));

// Configure tenancy
config.setConfig({
    central_domains: ["admin.myapp.com"],
    tenant_schemas: {
        "User": userSchema
    },
    central_schemas: {
        "Tenant": TenantSchema
    }
});

app.use(APIRoutes);
app.listen(process.env.PORT ?? 3000);
