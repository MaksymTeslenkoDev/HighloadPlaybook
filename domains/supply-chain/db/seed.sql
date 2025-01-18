-- Seed data for Suppliers
INSERT INTO Suppliers (name, contact_info, location) VALUES
('Tech Parts Ltd', 'techparts@example.com', 'New York, USA'),
('Global Raw Materials', 'globalraw@example.com', 'London, UK'),
('Mega Components', 'megacomp@example.com', 'Berlin, Germany');

-- Seed data for Warehouses
INSERT INTO Warehouses (name, location, capacity) VALUES
('New York Warehouse', 'New York, USA', 5000),
('London Storage', 'London, UK', 3500),
('Berlin Distribution', 'Berlin, Germany', 4000);

-- Seed data for Products
INSERT INTO Products (name, category, supplier_id, price, is_finished_product) VALUES
('CPU Chip', 'Electronics', 1, 120.00, FALSE),
('Screen Display', 'Electronics', 2, 80.00, FALSE),
('Battery Pack', 'Energy', 3, 50.00, FALSE),
('Mobile Phone', 'Gadgets', NULL, 700.00, TRUE),
('Smart Watch', 'Wearables', NULL, 300.00, TRUE);

-- Seed data for Bill of Materials (BOM)
INSERT INTO Bill_of_Materials (finished_product_id, component_product_id, quantity_required) VALUES
(4, 1, 1), -- Mobile Phone requires 1 CPU Chip
(4, 2, 1), -- Mobile Phone requires 1 Screen Display
(4, 3, 1), -- Mobile Phone requires 1 Battery Pack
(5, 1, 1), -- Smart Watch requires 1 CPU Chip
(5, 3, 1); -- Smart Watch requires 1 Battery Pack

-- Seed data for Inventory
INSERT INTO Inventory (warehouse_id, product_id, quantity) VALUES
(1, 1, 200), -- CPU Chips in New York Warehouse
(1, 2, 150), -- Screen Displays in New York Warehouse
(1, 3, 300), -- Battery Packs in New York Warehouse
(2, 1, 100), -- CPU Chips in London Storage
(2, 2, 120), -- Screen Displays in London Storage
(3, 3, 200); -- Battery Packs in Berlin Distribution

-- Seed data for Customers
INSERT INTO Customers (name, email, phone_number, address) VALUES
('John Doe', 'johndoe@example.com', '1234567890', '123 Main St, New York, USA'),
('Alice Brown', 'alicebrown@example.com', '2345678901', '456 Park Ave, London, UK'),
('Michael Smith', 'michaelsmith@example.com', '3456789012', '789 Tech Rd, Berlin, Germany');

-- Seed data for Orders
INSERT INTO Orders (customer_id, order_date, status, total_amount) VALUES
(1, NOW(), 'Pending', 1400.00),
(2, NOW(), 'Shipped', 700.00),
(3, NOW(), 'Delivered', 1000.00);

-- Seed data for Order Details
INSERT INTO Order_Details (order_id, product_id, quantity, price) VALUES
(1, 4, 2, 700.00), -- John Doe orders 2 Mobile Phones
(2, 5, 1, 300.00), -- Alice Brown orders 1 Smart Watch
(3, 4, 1, 700.00), -- Michael Smith orders 1 Mobile Phone
(3, 5, 1, 300.00); -- Michael Smith orders 1 Smart Watch

-- Seed data for Shipments
INSERT INTO Shipments (order_id, warehouse_id, shipment_date, delivery_date, status) VALUES
(2, 1, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 'In Transit'),
(3, 3, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 'Delivered');

-- Seed data for Manufacturing Orders
INSERT INTO Manufacturing_Orders (finished_product_id, quantity_to_produce, production_start_date, status) VALUES
(4, 50, NOW(), 'In Progress'),
(5, 30, NOW(), 'Pending');
