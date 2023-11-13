import {kafka} from "./client";
import {Partitioners} from "kafkajs";

export const producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.DefaultPartitioner,
    transactionTimeout: 30000
})
