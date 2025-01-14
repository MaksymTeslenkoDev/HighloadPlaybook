CREATE TABLE IF NOT EXISTS `Supplier`(
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    domain varchar(255) not null UNIQUE KEY,
    name varchar(255) not null, 
    phone INT 
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS 'Warehouse' (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255), 
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)