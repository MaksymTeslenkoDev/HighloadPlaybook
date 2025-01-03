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


    X	        IX	        S	        IS
X	Conflict	Conflict	Conflict	Conflict
IX	Conflict	Compatible	Conflict	Compatible
S	Conflict	Conflict	Compatible	Compatible
IS	Conflict	Compatible	Compatible	Compatible


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


