# Transaction, Locks, Isolation Levels

## Locks 

### Types of Locks 
- Shared Lock (S) 
- Exclusive Lock (X)

### Lock in Share Mode (S)

```
SELECT ... LOCK IN SHARE MODE
```
Locks rows in a range for **writting**. Other transactions will be able to read. If other transaction tries to modify the locked rows, it will wait until lock will dissapear, or transaction which set this lock will be commited/rollback. 

### For Update (X)

```
SELECT ... FOR UPDATE 
```
Loks rows for **reading**. Such queries will read data not from snapshot, as SELECT does, instead directly from the Index. So, they will see changes commited by another transaction after the start. 

### Intention Locks 

Locks on locks ... )))

They need to eficiently resolve problems with parallel data access. **Intention of lock** places on the level of table (not a row), 

- Intention shared lock (IS) - blocks only the creation of other shared locks and LOCK TABLE operations.
- Intention exclusive lock (IX) - blocks only the creation of other exclusive locks and LOCK TABLE operations.

Before any transaction can equire either **shared/exclusive** lock on a row in the table. It must first acquire an **IS or IX** lock on the table. This behavior increase the speed of processing concurent requests. It will decrease the amount of work for InnoDb in negative scenarious, when row has already been locked by other transaction. Instead of manually checking had a row been locked in each new transaction, InnoDb will check either lock or intense of lock, which current transaction try to set on a row/table is compatible with already existed lock/intense of lock and when NO, transactions will wait. 

### Locks Compatibility
A lock is granting to the requesting transaction if is **compatible** with existing locks, and not granted if it **conflicts** with existing locks. 
Transaction will be waiting for resolving lock which is bloking her, two things can happen, either lock will be released and our transaction successfully will run or transaction will fail with timeout. 


|       | X         | IX        | S         | IS        |
|-------|-----------|-----------|-----------|-----------|
| **X** | Conflict  | Conflict  | Conflict  | Conflict  |
| **IX**| Conflict  | Compatible| Conflict  | Compatible|
| **S** | Conflict  | Conflict  | Compatible| Compatible|
| **IS**| Conflict  | Compatible| Compatible| Compatible|


The status of the locks can be seen by running `show engine innodb status`. 

### Gap Locks
A gap lock is a lock between index records, or a gap lock before the first or after the las entry in index. For example 
```
SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;
```
Such lock not only locks rows with values 10 and 20 for updating but also it will locks all values of index in this range, nobody else won't be allowed to insert or update rows withing this gap. This locks are trade-off between perfomance and concurrency. 

Gap lock is needed in order to avoid the appearance of phantom records, when, for example, between two identical readings of a range, a neighboring transaction manages to insert a record into this range.

Gap locking can be disabled explicitly. This occurs if you change the transaction isolation level to READ COMMITTED. In this case, gap locking is disabled for searches and index scans and is used only for foreign-key constraint checking and duplicate-key checking.

## Consistent Read
At the start of transaction a snapshot (read view) of the db data is created. This snapshot can't be affected by changes in parallel transactions, only by changes in current transaction. Reading from such snapshot is called a **non-blocking consistent read**. InnoDB can be asked to take a snapshot before the first request in a transaction, for this you need to mention this at the time of the start of the transaction - `START TRANSACTION WITH CONSISTENT SNAPSHOT`.

Such snapshot stores in memory, and when memory size won't be enough will be uploaded to swap. Which may effect the perfomance.

**Level of isolations can effect the behavior of working with a snapshot. Based on the amount of snapshots and time when they were created, will be defined usage of fast memory (RAM) and hard drive. In higload systems, we should always avoid working with slow hard drive.**

## Isolation Levels 

Can be set globally and per session. Isolation levels determines the work behavior with "snapshots", and controls the occur of some problems of concurrent access.

### Repeatable Read 

Default in InnoDB. 

A consistent read (SELECT ...), during one transaction, reads from the initial snapshot and doesn't block anything, it means that the same queries will always return the same result. 

For blocking reads, (SELECT ... FOR UPDATE/LOCK IN SHARE MODE) update and delete, such queries won't use initial "snapshot", instead they will set a lock for current index in the db. Based on the type of index and type of condition (unique or range) in WHERE clause, InnoDB will lock either range (gap-locks, next-key lock) or record lock. 

**Use Case:** Read Heavy systems, where we don't want to create a "snapshot" multiple times during one transaction and system can tolerate phantom reads, and can't afford non-repeatable reads. 

### Read Commited

Each consistent read (SELECT ...) will create own "snapshot" and will read data from it. 
For blocking reads, (SELECT ... FOR UPDATE/LOCK IN SHARE MODE) update and delete, InnoDB locks only index records, not gaps. It allows new records to be inserted next to locked records. 

Because gap lock is disabled, **phantom rows** may occur because other sessions may insert new lines into gaps.

If some transaction tx2 will update or insert some rows between first select (S1) and second select (S2) and was commited, "snapshot" created by S2 will get updated with changes of tx2, making imposible of occuring phantom-reads. 

But we have an overhead in memory, since each select creates new snapshot wich will be stored in the memory. And thus making such isolation level not appropriate for read-heavy systems. 

**Use cases**: This is the most commonly used isolation level in many databases. It's a good balance between consistency and concurrency and is suitable for most applications where you cannot tolerate dirty reads but can afford non-repeatable reads. 

**Example**: An e-commerce application where you fetch the price of a product and price should be actual on the moment of each request. It's okay if the price changes in a subsequent transaction, but you don't want to read an uncommitted price. 

**Not Suitable for**: News platforms, tons of consistend reads (SELECT), platform can freely tolerate when during some request some news or news update rwon't be returned. Eventually "missed" news will come in subsequent requests. 

### Read Uncommited

Disable locking. All SELECT queries are read in a non-blocking manner. Changes to an incomplete transaction can be read in other transactions, and these changes can also be rolled back later. This is the so-called "dirty read".

**Use Case:** When you need maximum throughput and the application can tolerate dirty reads. This is appropriate in scenarios where you're performing analytics or reporting queries where absolute accuracy at the moment of transaction is not critical. 

**Example:** A real-time dashboard that shows trending data, where it's okay if some of the data is not yet committed.

### Serializable 

Simmilar to REPETABLE READ, but all sonsistent reads (SELECT) are implicitly converted to SELECT ... LOCK IN SHARE MODE if autocommit is disabled. If enabled each SELECT goes into seperate transaction. 

Serializable guarantees 100% consistency, as a result any problem of concurrent access can occur. All transaction wich insert, modify or delete data, will be worked sequentially. LOCK IN SHARE MODE allows read, locks only write.