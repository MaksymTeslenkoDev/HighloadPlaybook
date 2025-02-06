-- Simple join example (JOIN/INNER JOIN)
-- Result includes all values from both tables. Even the supplier_id field appears twice because we select all columns of both tables:
SELECT * 
FROM supply_chain.Product as p JOIN supply_chain.Supplier s
ON p.supplier_id = s.supplier_id;

-- LEFT JOIN: When a left table row doesn't have a match in the right table, the result shows no values from the right table. 
-- In MySQL empty columns from right table will be null
SELECT * 
FROM supply_chain.Product as p LEFT JOIN supply_chain.Supplier s
ON p.supplier_id = s.supplier_id;

-- FULL OUTER JOIN doesn't suppored in MySQL InnoDB
SELECT * 
FROM supply_chain.Product as p FULL OUTER JOIN supply_chain.Supplier s
ON p.supplier_id = s.supplier_id;

-- CROSS JOIN 
-- Present all possible combinations of rows from two tables
-- PostgreSQL 
SELECT * FROM supply_chain.Product CROSS JOIN supply_chain.Supplier;
-- MySQL
SELECT * FROM supply_chain.Product, supply_chain.Supplier;
