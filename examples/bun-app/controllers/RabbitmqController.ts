import {queue, config} from "node-tenancy"
import {ConsumeMessage} from "amqplib";

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

export async function getMessages(queue_name: string, is_tenant_connection = false): Promise<void> {
    setConnectionConfig(is_tenant_connection);

    const conn = await queue.connect();

    if ("createChannel" in conn) {
        const channel = await conn.createChannel();

        await channel.assertQueue(queue_name);

        await channel.consume(queue_name, async (msg: ConsumeMessage | null) => {
            if (msg !== null) {
                console.log('Received:', msg.content.toString());
                channel.ack(msg);
            } else {
                console.log('Consumer cancelled by server');
            }
            await channel.close();
            await conn.close();
        });
    }
}

export async function publishMessage(queue_name: string, message: object, is_tenant_connection = false): Promise<void> {
    setConnectionConfig(is_tenant_connection);

    const conn = await queue.connect();
    if ("createChannel" in conn) {
        const channel = await conn.createChannel();
        channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)));
        setTimeout(function () {
            conn.close();
        }, 500);
    }
}
