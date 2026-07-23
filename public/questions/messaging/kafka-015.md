---
id: kafka-015
path: questions/messaging/kafka-015.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Kafka Security (SSL/SASL/ACL)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Kafka Security (SSL/SASL/ACL)

By default, an out-of-the-box Apache Kafka cluster is completely insecure. Anyone who knows the broker IP and port can connect, read any message from any topic, write arbitrary data, and even delete topics.

Securing a Kafka cluster involves implementing three distinct layers: **Encryption** (Data in transit), **Authentication** (Who are you?), and **Authorization** (What are you allowed to do?).

---

## 1. Encryption (Data in Transit): SSL/TLS

Without encryption, data travels between producers, brokers, and consumers in plain text.

**How it works:** Kafka uses standard SSL/TLS (similar to HTTPS).
*   Brokers are configured with a Keystore containing a certificate (signed by a Certificate Authority or self-signed).
*   Clients (Producers/Consumers) are configured with a Truststore containing the CA's public certificate to verify the broker's identity.

**Client Configuration Example:**
```properties
security.protocol=SSL
ssl.truststore.location=/var/private/ssl/client.truststore.jks
ssl.truststore.password=secret
```

*Note:* Enabling SSL adds CPU overhead for encryption/decryption, which can slightly impact maximum throughput.

---

## 2. Authentication: SASL & mTLS

Authentication verifies the identity of the client connecting to the cluster. Kafka supports several mechanisms.

### a. mTLS (Mutual TLS / 2-Way SSL)
Not only does the client verify the broker (Encryption), but the broker also requires the client to present a valid certificate.
*   **Pros:** Highly secure, leverages existing PKI infrastructure.
*   **Cons:** Managing and rotating client certificates for hundreds of microservices can be an operational nightmare.

### b. SASL (Simple Authentication and Security Layer)
SASL is a framework for authentication. Kafka supports several SASL mechanisms:

*   **SASL/PLAIN:** Simple username and password. 
    *   *Warning:* Must ALWAYS be used in conjunction with SSL encryption; otherwise, credentials are sent in plain text.
*   **SASL/SCRAM:** (Salted Challenge Response Authentication Mechanism). More secure than PLAIN. Credentials are hashed. It allows adding/removing users dynamically via Kafka commands without restarting brokers (unlike PLAIN which often requires JAAS config file updates).
*   **SASL/GSSAPI (Kerberos):** The enterprise standard for large organizations. Integrates with Active Directory. Highly secure, but notorious for being complex to configure and troubleshoot.
*   **SASL/OAUTHBEARER:** Integrates with OAuth2 providers (like Keycloak, Okta). Microservices acquire JWT tokens and present them to Kafka. Excellent for modern cloud-native architectures.

**Client Configuration Example (SASL/SCRAM with SSL):**
```properties
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-256
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required \
    username="my-app-user" \
    password="super-secret-password";
```

---

## 3. Authorization: ACLs (Access Control Lists)

Once a client is authenticated (e.g., Kafka knows it is `User:my-app-user`), Authorization dictates what that user is allowed to do.

Kafka uses **ACLs** (Access Control Lists) to manage permissions. The default authorizer stores ACL rules in ZooKeeper (or KRaft metadata).

**ACL Structure:**
An ACL rule consists of:
*   **Principal:** The authenticated user (e.g., `User:my-app-user`).
*   **Operation:** What action is being attempted? (`READ`, `WRITE`, `CREATE`, `DELETE`, `ALL`).
*   **Resource:** What is the target? (`Topic:orders`, `Group:order-processing-group`, `Cluster`).
*   **Permission Type:** `ALLOW` or `DENY`.

**Common Operational Scenarios:**

*   **Scenario 1: Least Privilege Producer**
    You want the `order-service` to ONLY be able to write to the `orders` topic.
    *   Command: `kafka-acls.sh --authorizer-properties zookeeper.connect=localhost:2181 --add --allow-principal User:order-service --operation WRITE --topic orders`

*   **Scenario 2: Secure Consumer**
    A consumer needs permission to READ from a topic, but it *also* needs permission to READ from its specific Consumer Group (so it can commit offsets).
    *   Command (Topic): `... --add --allow-principal User:analytics-service --operation READ --topic orders`
    *   Command (Group): `... --add --allow-principal User:analytics-service --operation READ --group analytics-group`

**Summary:** A production-ready Kafka cluster must implement SSL for encryption, a robust SASL mechanism (like SCRAM or OAuth) for authentication, and strict ACLs enforcing the principle of least privilege to prevent unauthorized data access or accidental topic deletion.
