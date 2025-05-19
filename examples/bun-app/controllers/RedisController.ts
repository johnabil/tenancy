import {queue, config} from "node-tenancy"

function setConnectionConfig(is_tenant_connection: boolean): void {
    let connection: string;

    if (is_tenant_connection) {
        connection = 'tenant';
    } else {
        connection = 'central';
    }

    config.setConfig({
        'connection': connection,
    });
}

export async function getMessages(channel_name: string, is_tenant_connection = false): Promise<void> {
    setConnectionConfig(is_tenant_connection);

    const client = await queue.connect();

    if ("subscribe" in client) {
        await client.subscribe(channel_name, (message) => {
            console.log(Buffer.from(message).toString());
        }, true);

        await client.quit();
    }
}

export async function publishMessage(channel_name: string, message: object, is_tenant_connection = false): Promise<void> {
    setConnectionConfig(is_tenant_connection);

    // queue.connect(url = null, options = {})
    const client = await queue.connect();

    if ("publish" in client) {
        await client.publish(channel_name, Buffer.from(JSON.stringify(message)));

        await client.quit();
    }
}

