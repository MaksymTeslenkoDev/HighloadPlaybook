## SQL databases 
Since db works with disk we need to know how to optimize the work with it because it is one of the biggest thing wich can impact the performance. 

**MySql Architecture**
![MySQL srchitecture](./images/mysql-architecture.png)

### Connection management and security 
For each connection, a seperated thread is allocated withing the server process. Amount of connections limits by the amount of open file descriptors on our server. Basically it is one of the easiest and obvious thing to improve.
The recommended optimal amount of connections can be calculated by formula: **(CPU * 2) - 1**. However, it is essential to tailor the configuration to your specific workload and monitor the database's performance to achieve optimal results.

In modern applications, connection pools manage database connections efficiently, reusing them instead of opening and closing them repeatedly. This can significantly change the effective number of connections required.

### Optimization and execution
MySQL parse queries to create an internal structure (execution plan) and then performs a number of optimizations. These include rewriting the query, determining the order in which tables are read, choosing which indexes to use, and so on.

MySQL optimizer works always as **greedy!** algorithm. He tries to use the least amount of resources on each operation. It means that for so difficult queries optimizer can make a mistake and choose not optimal query plan. To check query plan for we can use **explain** or **explain analyze**. We should always try to avoid use of difficult queries with not obvious use of indexes and tons of joins. 

Cashing for sql queiries in MySql doesn't work so well due to cache invalidation. Generally recomendation is to turn of mysql cache for not read heavy systems (amount of read operations significantlly bigger then amount of write operations). 

What is the difference between **explain** and **explain analyze**.
EXPLAIN calculated complexity based on the statistic without execution, while EXPLAIN ANALYZE execute query and show the statistic of real query execution. Also to get real statistic of query, make sens to add "no cache" key to query which should be explained to turn of use of cache. 

During examine of query pay attention to: FULL SCANS, usage of indexes, time of query execution. 

### Concurrent access management