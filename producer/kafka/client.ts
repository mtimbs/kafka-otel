import { Kafka } from 'kafkajs'

// Create the client with the broker list
export const kafka = new Kafka({
    clientId: 'test-client',
    brokers: ['kafka-broker-1:9092']
})
