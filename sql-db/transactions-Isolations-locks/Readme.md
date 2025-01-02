# Transaction, Locks, Isolation Levels

## Locks 

### Types of Locks 
- Shared Lock (S) 
- Exclusive Lock (X)

### Lock in Share Mode

```
SELECT ... LOCK IN SHARE MODE
```
Locks rows in a range for **writting**. Other transactions will be able to read. If other transaction tries to modify the locked rows, it will wait until lock will dissapear, or transaction which set this lock will be commited/rollback. 

