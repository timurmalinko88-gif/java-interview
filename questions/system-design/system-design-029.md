---
id: system-design-029
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 60%
source: Custom
prerequisites: ["Databases", "Big Data"]
---

# Data Lake vs Data Warehouse

Compare a Data Warehouse with a Data Lake. In what scenarios would a company use one over the other?

---ANSWER---

Both are used to store massive amounts of data for analytics and business intelligence, but their approaches are completely different.

**Data Warehouse (e.g., Amazon Redshift, Google BigQuery, Snowflake)**
- *Data Type*: Highly structured, relational data (rows and columns).
- *Process*: **Schema-on-Write** (ETL - Extract, Transform, Load). Before data can be loaded into the warehouse, it must be cleaned, transformed, and forced into a strict predefined schema.
- *Users*: Business Analysts.
- *Use Case*: Fast, complex SQL queries for business intelligence, generating weekly sales reports, financial dashboards. The data is trustworthy and curated.

**Data Lake (e.g., Amazon S3, Hadoop HDFS, Azure Data Lake)**
- *Data Type*: Structured, semi-structured (JSON, XML), and completely unstructured data (images, logs, audio).
- *Process*: **Schema-on-Read** (ELT - Extract, Load, Transform). Data is dumped into the lake in its raw, native format. You only figure out how to parse it (the schema) when you actually need to read it.
- *Users*: Data Scientists, Machine Learning engineers.
- *Use Case*: Machine learning training, big data exploration, storing massive volumes of raw logs cheaply before deciding what is useful.

### Life Analogy
A **Data Warehouse** is like a meticulously organized library. Every book is classified, labeled, and put on a specific shelf. It takes time to process new books, but finding information is incredibly fast and reliable.
A **Data Lake** is like a massive warehouse building where you just throw boxes, furniture, and documents into a pile. It's incredibly fast and cheap to store things, but when you need to find something specific, you have to dig through the pile and make sense of it on the spot.

### Key Points
- Warehouse = Structured data, Schema-on-Write, used by Analysts for BI.
- Lake = Unstructured raw data, Schema-on-Read, used by Data Scientists for ML/Exploration.
