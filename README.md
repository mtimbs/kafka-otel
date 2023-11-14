# kafka-otel

Given two services, I want to be able to link opentelemetry spans from the consumer to the producer. 
This example originally tried to use the [opentelemetry-instrumentation-kafkajs](https://github.com/aspecto-io/opentelemetry-ext-js/tree/master/packages/instrumentation-kafkajs) package to instrument.

Due to what I can only assume is a massive skill issue I could not get it to work as expected.
In the end I opted for manual instrumentation which is actually exceedingly easy and begs the question why auto-instrumentation even exists in the first place.

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
