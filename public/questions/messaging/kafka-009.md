---
id: kafka-009
path: questions/messaging/kafka-009.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Schema Registry (Avro) & Compatibility
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Schema Registry (Avro) & Compatibility

In a microservices architecture using Kafka, producers and consumers are inherently decoupled. Team A might write events to a topic, and Team B (perhaps months later) might write a consumer to read them. 

If Team A sends data as raw JSON (e.g., `{"userId": 123, "status": "active"}`) and later changes the schema (e.g., renaming `userId` to `id`), Team B's consumer will likely crash with parsing errors. Kafka itself is completely agnostic to the payload; it just sees an array of bytes.

To solve this problem of data governance and schema evolution, the industry standard is to use a **Schema Registry** in conjunction with a binary serialization format like **Apache Avro** (or Protobuf/JSON Schema).

## The Role of the Schema Registry

The Schema Registry (most commonly Confluent Schema Registry) is an independent service (a REST API) that sits outside the Kafka brokers. It serves two primary purposes:

1.  **Centralized Storage:** It stores all schemas used in the Kafka cluster, versioning them as they evolve.
2.  **Compatibility Enforcement:** It acts as a gatekeeper. When a producer tries to register a modified schema, the Registry checks it against previous versions according to configured compatibility rules. If the change breaks compatibility, the Registry rejects it, preventing the producer from poisoning the Kafka topic with unreadable data.

## How it Works with Avro

Apache Avro relies heavily on schemas. When data is serialized in Avro, the schema is usually *not* embedded in every single message (unlike JSON, which is self-describing and verbose). 

Here is the flow of producing and consuming a message using the Schema Registry:

### The Producer Flow:
1.  The producer application has an Avro object (e.g., an `Order` object generated from an `.avsc` schema file).
2.  Before sending to Kafka, the `KafkaAvroSerializer` contacts the Schema Registry and says, "Here is the schema I want to use for the `orders` topic."
3.  If the schema is new, the Registry validates it, stores it, and returns a unique integer **Schema ID**. If it already exists, it just returns the ID.
4.  The producer serializes the data. It prepends the 4-byte **Schema ID** (a "magic byte" + ID) to the front of the binary Avro payload.
5.  The producer sends this byte array to the Kafka broker.

### The Consumer Flow:
1.  The consumer receives the byte array from Kafka.
2.  The `KafkaAvroDeserializer` reads the first few bytes to extract the **Schema ID**.
3.  It checks its local cache. If it doesn't have the schema for that ID, it calls the Schema Registry: "Give me the schema for ID #45."
4.  The Registry returns the schema.
5.  The consumer uses that schema to deserialize the binary payload back into a Java object.

## Schema Evolution and Compatibility Modes

Business requirements change, and schemas must evolve. You might need to add a field, remove a field, or change a type. The Schema Registry prevents breaking changes through **Compatibility Modes**.

### 1. BACKWARD Compatibility (The Default)
*   **Rule:** Consumers using the *new* schema can read data written by producers using the *old* schema.
*   **Allowed Changes:** Deleting fields, or adding *optional* fields (fields with a default value).
*   **Scenario:** You upgrade your consumer applications to the new schema first, then upgrade the producers.
*   **Why it works:** If the new consumer expects a new field `address`, and reads an old message lacking it, Avro injects the default value defined in the new schema.

### 2. FORWARD Compatibility
*   **Rule:** Consumers using the *old* schema can read data written by producers using the *new* schema.
*   **Allowed Changes:** Adding fields, or deleting *optional* fields.
*   **Scenario:** You upgrade your producers to emit new data first, and upgrade the consumers later.
*   **Why it works:** If the old consumer reads a new message with an extra `address` field, it simply ignores it because it's not in its schema.

### 3. FULL Compatibility
*   **Rule:** A combination of BACKWARD and FORWARD. Consumers with old schemas can read new data, AND consumers with new schemas can read old data.
*   **Allowed Changes:** You can *only* add optional fields or delete optional fields.

## Why Use Avro + Schema Registry?

1.  **Data Quality:** Prevents consumers from crashing due to unexpected schema changes. Contracts are strictly enforced.
2.  **Smaller Payload Size:** Avro binary format is significantly smaller than JSON because the field names are not transmitted in the message, only the values and the integer Schema ID. This saves massive amounts of network bandwidth and disk space.
3.  **Code Generation:** Avro schemas (`.avsc`) can be used to automatically generate Java/POJO classes (via Maven/Gradle plugins), providing strong compile-time type safety.
