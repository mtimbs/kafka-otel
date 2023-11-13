import { NodeSDK } from "@opentelemetry/sdk-node";
import { KafkaJsInstrumentation } from "opentelemetry-instrumentation-kafkajs";
import { Resource } from "@opentelemetry/resources";
import {ConsoleSpanExporter, SimpleSpanProcessor} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk: NodeSDK = new NodeSDK({
    instrumentations: [
        new KafkaJsInstrumentation(),
    ],
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'example-producer',
    }),
    spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
});
sdk.start();
