CREATE TABLE IF NOT EXISTS `Supplier`(
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name varchar(255) not null UNIQUE KEY,
    brand_name varchar(255) not null,
    support_phone INT,
    support_email varchar(255) not null,
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