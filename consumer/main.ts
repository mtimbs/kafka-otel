import "./observability/tracing"
import { SpanKind, trace } from "@opentelemetry/api";

import {kafka} from "./kafka/client";

const tracer = trace.getTracer("test-consumer", "1.0");
const sleep = (ms: number) => new Promise( resolve => setTimeout(resolve, ms));

const messageHandler = async ({ topic, partition, message }) => {
    tracer.startActiveSpan("consumer-message-handler", {kind: SpanKind.CONSUMER}, (span) => {
        console.log("handling message", {
            topic,
            partition,
            key: message.key?.toString(),
            value: message.value.toString(),
            headers: message.headers,
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
