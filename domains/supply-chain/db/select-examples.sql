-- SELECT *
SELECT * FROM supply_chain.Warehouse;

-- SELECT DISTINCT category from supply_chain.Product;
SELECT DISTINCT category, is_finished_product from supply_chain.Product;

-- ORDER BY 
SELECT * FROM supply_chain.Product 
ORDER BY price DESC;

-- WHERE 
-- Operator: Equal to (=)
SELECT * FROM supply_chain.Product WHERE name = "Smart Watch";
-- Operator: Not Equal to (!= or <>)
SELECT * FROM supply_chain.Product WHERE is_finished_product != 1;
-- Operator: Greater than / Greater than or equal (> / >=)
SELECT * FROM supply_chain.Product WHERE price > 200;
SELECT * FROM supply_chain.Product WHERE price >= 300;
SELECT * FROM supply_chain.Warehouse WHERE created_at > NOW();
SELECT * FROM supply_chain.Warehouse WHERE created_at > '2025-01-18 15:18:48';
-- Operator: Less than / Less than or equal (< / <=)
SELECT * FROM supply_chain.Product WHERE price < 200;
SELECT * FROM supply_chain.Product WHERE price <= 300;
SELECT * FROM supply_chain.Warehouse WHERE created_at < '2025-01-22 15:18:48';
SELECT * FROM supply_chain.Warehouse WHERE created_at < NOW();
-- Operator: Within a range (BETWEEN)
-- Caution: is inclusive, 
SELECT * FROM supply_chain.Product WHERE price BETWEEN 51 AND 299;
-- Operator: Match one of a set of values ( IN )
SELECT * FROM supply_chain.Product WHERE category IN ('Wearables','Energy');
-- Operator: Match a pattern, case sensitive / case insesitive (LIKE / ILIKE)
SELECT * FROM supply_chain.Product WHERE category LIKE 'Wear%';
SELECT * FROM supply_chain.Product WHERE category ILIKE 'wear%'; -- not valid in MySQL (InnoDb), by default case insensitive
SELECT * FROM supply_chain.Product WHERE category LIKE 'Ene__y%';
SELECT * FROM supply_chain.Product WHERE category LIKE '_nergy%';
-- Operator: Negates a condition ( NOT )
SELECT * FROM supply_chain.Product WHERE category NOT LIKE "Wear%";

-- AND and OR
SELECT * FROM supply_chain.Product WHERE category = "Electronics" and price < 120;
SELECT * FROM supply_chain.Product WHERE category = "Electronics" or price BETWEEN 50 and 80;
SELECT * FROM supply_chain.Product WHERE category = "Electronics" AND ( price = 80 or price >= 120) ORDER BY price desc;