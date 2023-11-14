import "./observability/tracing"
import { SpanKind, trace } from "@opentelemetry/api";
import {producer} from "./kafka/producer";
const sleep = (ms: number) => new Promise( resolve => setTimeout(resolve, ms));

const tracer = trace.getTracer("test-producer", "1.0");

(async() => {
    // Stupid hack to stop producer trying to connect until kafka is up and running
    await sleep(5*1000);
    await producer.connect();
    console.debug("connected to kafka producer.");
    let i = 1;
    while (i < 1000) {
        await tracer.startActiveSpan("send-test-message", {kind: SpanKind.PRODUCER}, async (span) => {
            const ctx = span.spanContext();
            await producer.send({
                topic: process.env.TEST_KAFKA_TOPIC,
                messages: [
                    {
                        headers: {
                            'correlation-context': Buffer.from(JSON.stringify(ctx)),
                        },
                        key: `${i%5}`,
                        value: JSON.stringify({
                            id: i,
                            message: `Test message number ${i}`
                        })
                    }
                ],
            })
            span.end()
        });

        await sleep(5 * 1000);
        i++;
    }
})()
