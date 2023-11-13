# kafka-otel

Given two services, I want to be able to link opentelemetry spans from the consumer to the producer. This example uses the [opentelemetry-instrumentation-kafkajs](https://github.com/aspecto-io/opentelemetry-ext-js/tree/master/packages/instrumentation-kafkajs) package to instrument. 

## Buil and Run
To run this example app
```bash
docker-compose build

docker compose up
```

This will boot up
- zookeeper
- schema registry
- kafka (single broker)
- producer app (producer/main.ts)
- consumer app (consumer/main.ts)

##  Goal
Send a message from the producer app and see the span attributes for that message in the consumer app link to the producer span.
