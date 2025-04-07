DROP table if EXISTS ManufacturingOrder;
DROP table if EXISTS Inventory;
DROP table if EXISTS Shipment;
DROP table if EXISTS Warehouse;
DROP table if EXISTS BillOfMaterials;
DROP table if EXISTS OrderDetails;
DROP table if EXISTS Product;
DROP table if EXISTS Supplier;
DROP table if EXISTS Orders;
DROP table if EXISTS Customer;


CREATE TABLE IF NOT EXISTS `Supplier` (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name varchar(255) not null UNIQUE,
    brand_name varchar(255) not null,
    support_phone INT,
    support_email varchar(255) not null,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Warehouse` (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255), 
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Product` (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    supplier_id INT,
    price DECIMAL(10,2) NOT NULL,
    is_finished_product BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE SET NULL
);

-- Tracks which raw materials are required to manufacture a finished product.
CREATE TABLE IF NOT EXISTS `BillOfMaterials` (
    bom_id INT AUTO_INCREMENT PRIMARY KEY,
    finished_product_id INT NOT NULL,
    component_product_id INT NOT NULL,
    quantity_required INT NOT NULL,
    FOREIGN KEY (finished_product_id) REFERENCES Product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (component_product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Inventory` (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE,
    UNIQUE (warehouse_id, product_id)
);

CREATE TABLE IF NOT EXISTS `Customer` (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Orders` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Shipped', 'Delivered', 'Canceled') DEFAULT 'Pending',
    customer_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

-- Tracks which products are included in an order.
CREATE TABLE IF NOT EXISTS `OrderDetails` (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price) STORED,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Shipment` (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    shipment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP,
    status ENUM('In Transit', 'Delivered', 'Returned') DEFAULT 'In Transit',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(warehouse_id) ON DELETE CASCADE
);

-- Manufacturing Orders Table
CREATE TABLE IF NOT EXISTS `ManufacturingOrder` (
    manufacturing_order_id INT AUTO_INCREMENT PRIMARY KEY,
    finished_product_id INT NOT NULL,
    quantity_to_produce INT NOT NULL,
    production_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    production_end_date TIMESTAMP NULL,
    status ENUM('Pending', 'In Progress', 'Completed', 'Canceled') DEFAULT 'Pending',
    FOREIGN KEY (finished_product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);