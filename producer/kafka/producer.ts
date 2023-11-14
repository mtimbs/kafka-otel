import {Partitioners} from "kafkajs";
import {kafka} from "./client";

export const producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.DefaultPartitioner,
    transactionTimeout: 30000
})
