import "./observability/tracing"
import { SpanKind, trace } from "@opentelemetry/api";

import {kafka} from "./kafka/client";

const tracer = trace.getTracer("test-consumer", "1.0");
const sleep = (ms: number) => new Promise( resolve => setTimeout(resolve, ms));

const messageHandler = async ({ topic, partition, message }) => {
    const traceOptions = {
        kind: SpanKind.CONSUMER,
        links: [
            { context: JSON.parse(message.headers['correlation-context'].toString()) }
        ]
    };

    tracer.startActiveSpan("consumer-message-handler", traceOptions, (span) => {
        console.log("handling message", {
            topic,
            partition,
            key: message.key?.toString(),
            value: message.value.toString(),
            headers: message.headers,
            correlationCtx: JSON.parse(message.headers['correlation-context'].toString())
        })

        span.end();
    });
}

(async () => {
    // Stupid hack to stop consumer trying to connect until kafka producer has created the topic
    await sleep(10*1000)
    console.debug("Booting consumer.")
    const consumer = kafka.consumer({groupId: 'consumer-group-A'})
    await consumer.connect();
    console.debug("Consumer connected.")

    console.debug("Attempting to subscribe to topics", { topics: [process.env.TEST_KAFKA_TOPIC] })
    await consumer.subscribe({ topics: [process.env.TEST_KAFKA_TOPIC] })
    console.debug("Successfully subscribed to topics", { topics: [process.env.TEST_KAFKA_TOPIC] })

    await consumer.run({
        eachMessage: messageHandler,
    })
})()
