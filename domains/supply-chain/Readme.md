# Supply Chain Management System

## Overview

The **Supply Chain Management System** models a real-world supply chain, tracking **suppliers, warehouses, inventory, customer orders, and manufacturing processes**. The system supports procurement, inventory tracking, customer orders, manufacturing, and logistics.

---

## Database Setup

### Prerequisites
To run this database, ensure you have **Docker** and **Docker Compose** installed, and that your environment variables are correctly set in a `.env` file.

### Docker Compose Configuration
The database runs inside a **Percona MySQL** container, as defined in the `docker-compose.yml` file:

```yaml
services:
  percona:
    image: percona/percona-server:8.0.40-aarch64
    container_name: ps_mysql
    ports:
      - "3307:3306"
    env_file:
      - .env
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: bob
      MYSQL_PASSWORD: secretbob
    volumes:
      - supply_chain_data:/var/lib/mysql
      - ./cfg/my.cnf:/etc/my.cnf
    networks:
      - ps_mysql_network
volumes:
  supply_chain_data:

networks:
  ps_mysql_network:
    driver: bridge
```

### Running the Database
To start the database container, run:

```sh
docker-compose up -d
```

This will start the MySQL server inside a **Docker container** with the configured settings.

### Initializing Database Tables
To create all necessary tables inside the MySQL database, run:

```sh
npm run db:init-tables
```

This command executes the SQL schema file (`db/structure.sql`) inside the **Percona MySQL container**.

### Seeding the Database
To populate the database with sample data, run:

```sh
npm run db:seed
```

This will execute the `db/seed.sql` script inside the running MySQL container.

---

## Database Tables Overview

This system includes the following tables:

### 1. Suppliers

Stores details of suppliers providing raw materials or finished goods.

- **Relationships**:
  - Supplies **Products**.

#### Key Fields

- `supplier_id` (PK) - Unique identifier.
- `name` - Supplier’s name.
- `contact_info` - Contact details.
- `location` - Supplier’s address.

---

### 2. Warehouses

Represents storage facilities where products and raw materials are kept.

- **Relationships**:
  - Stores **Products** via **Inventory**.
  - Ships **Orders** via **Shipments**.

#### Key Fields

- `warehouse_id` (PK) - Unique identifier.
- `name` - Warehouse name.
- `location` - Warehouse location.
- `capacity` - Maximum storage.

---

### 3. Products

Represents both **finished products** and **raw materials/components**.

- **Relationships**:
  - Can be **supplied** by **Suppliers**.
  - Stored in **Warehouses** via **Inventory**.
  - Ordered by **Customers** via **Orders**.
  - Can be **manufactured** using **sub-products** from **Bill of Materials (BOM)**.

#### Key Fields

- `product_id` (PK) - Unique identifier.
- `name` - Product name.
- `category` - Type of product.
- `supplier_id` (FK) - Supplier reference.
- `price` - Unit price.
- `is_finished_product` (BOOLEAN) - `TRUE` if a final product, `FALSE` if a raw material.

---

### 4. Bill of Materials (BOM)

Tracks which **raw materials** are required to manufacture a **finished product**.

- **Self-referencing Relationship**:
  - Links **Products** as **components** of other **Products**.

#### Key Fields

- `bom_id` (PK) - Unique identifier.
- `finished_product_id` (FK → Products) - The **final product** being manufactured.
- `component_product_id` (FK → Products) - The **raw material** needed.
- `quantity_required` - How many units of the raw material are needed.

---

### 5. Inventory

Tracks **stock levels** of products in **warehouses**.

- **Relationships**:
  - Links **Products** and **Warehouses**.

#### Key Fields

- `inventory_id` (PK) - Unique identifier.
- `warehouse_id` (FK → Warehouses) - Where the product is stored.
- `product_id` (FK → Products) - The stored product.
- `quantity` - Available stock.

---

### 6. Customers

Stores customer details for placing orders.

- **Relationships**:
  - Can place **Orders**.

#### Key Fields

- `customer_id` (PK) - Unique identifier.
- `name` - Customer’s name.
- `email` - Contact email.
- `phone_number` - Contact number.
- `address` - Delivery address.

---

### 7. Orders

Stores **customer purchases**.

- **Relationships**:
  - Links to **Customers**.
  - Contains multiple **Products** via **Order Details**.
  - Fulfilled by **Shipments**.

#### Key Fields

- `order_id` (PK) - Unique identifier.
- `customer_id` (FK → Customers) - The buyer.
- `order_date` - Date of purchase.
- `status` - (`Pending`, `Shipped`, `Delivered`, `Canceled`).

---

### 8. Order Details

Tracks which **products** are included in an **order**.

- **Relationships**:
  - Links **Orders** and **Products**.

#### Key Fields

- `order_detail_id` (PK) - Unique identifier.
- `order_id` (FK → Orders) - The order reference.
- `product_id` (FK → Products) - The purchased product.
- `quantity` - Number of units.
- `price` - Unit price.

---

### 9. Shipments

Tracks **order deliveries** from **warehouses** to **customers**.

- **Relationships**:
  - Ships **Orders**.
  - Originates from a **Warehouse**.

#### Key Fields

- `shipment_id` (PK) - Unique identifier.
- `order_id` (FK → Orders) - The shipped order.
- `warehouse_id` (FK → Warehouses) - The warehouse shipping the product.
- `shipment_date` - When it was sent.
- `delivery_date` - Expected delivery.

---

### 10. Manufacturing Orders

Tracks **production processes** for making finished products.

- **Relationships**:
  - Uses **raw materials** from **Bill of Materials (BOM)**.
  - Consumes stock from **Production Inventory**.

#### Key Fields

- `manufacturing_order_id` (PK) - Unique identifier.
- `finished_product_id` (FK → Products) - What is being manufactured.
- `quantity_to_produce` - Number of units.
- `status` - (`Pending`, `In Progress`, `Completed`).
- `start_date`, `end_date` - Production timeline.

---

## How the System Works

### 1. Ordering Products

1. A **Customer** places an **Order** for a **Product**.
2. The system **checks Inventory** in the **Warehouses**.
3. If stock exists, a **Shipment** is created.
4. If stock **does not exist**, a **Manufacturing Order** is triggered.

---

### 2. Manufacturing a Product

1. A **Manufacturing Order** is created.
2. The system **retrieves BOM requirements**.
3. It **checks Production Inventory**:
   - If **enough materials exist**, production starts.
   - If **materials are missing**, they are ordered from **Suppliers**.
4. Once materials are received, production **begins**.
5. After **completion**, the finished product is **added to Inventory**.

---

### 3. Shipping the Order

1. The **Warehouse** prepares the order.
2. A **Shipment** is created and tracked.
3. Once delivered, the **Order Status** updates to **"Delivered"**.

---

## Final Relationships Summary

| Table                                       | Relationship                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| Products ↔ Suppliers                        | A **Supplier** provides **Products**.                                           |
| Warehouses ↔ Inventory                      | A **Warehouse** stores **Products**.                                            |
| Products ↔ BOM                              | A **Product** is made of **sub-products** (self-referencing).                   |
| Orders ↔ Customers                          | A **Customer** places **Orders**.                                               |
| Orders ↔ Order Details                      | An **Order** contains multiple **Products**.                                    |
| Orders ↔ Shipments                          | An **Order** is fulfilled via **Shipments**.                                    |
| Manufacturing Orders ↔ BOM                  | A **Manufacturing Order** uses raw materials from **BOM**.                      |
| Manufacturing Orders ↔ Production Inventory | **Production Inventory** ensures raw materials are available for manufacturing. |

---
