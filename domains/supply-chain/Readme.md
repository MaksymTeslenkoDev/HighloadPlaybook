# Supply Chain Management System

## Overview
The **Supply Chain Management System** is a software application designed to manage and optimize the movement of goods, inventory, and orders between suppliers, warehouses, and customers. The system allows users to track stock levels, place and fulfill customer orders, and manage logistics efficiently. It provides a robust foundation for practicing SQL queries and implementing CRUD operations for a real-world domain.

---

## System Features
1. **Supplier Management**: Manage information about suppliers providing goods.
2. **Warehouse Management**: Track and update storage facilities and product inventories.
3. **Product Catalog**: Maintain a catalog of products with details such as supplier, price, and category.
4. **Inventory Tracking**: Monitor stock levels of products in different warehouses.
5. **Order Management**: Place, update, and track customer orders.
6. **Shipment Tracking**: Manage the logistics of delivering orders from warehouses to customers.

---

## Key Entities
- **Suppliers**: Organizations or vendors supplying goods.
- **Warehouses**: Locations storing products for distribution.
- **Products**: Items managed in the system and ordered by customers.
- **Inventory**: Tracks product quantities in each warehouse.
- **Customers**: Individuals or businesses placing orders.
- **Orders**: Customer purchases with associated products.
- **Shipments**: Delivery records for fulfilling customer orders.

---

## CRUD Operations

### 1. Supplier Management
- **Create**: Add a new supplier with contact and location details.
- **Read**: View a list of suppliers or search for a specific one.
- **Update**: Edit supplier details (e.g., contact info).
- **Delete**: Remove a supplier if they have no linked products.

### 2. Warehouse Management
- **Create**: Add new warehouse records with capacity and location details.
- **Read**: View all warehouses and their inventory status.
- **Update**: Modify warehouse capacity or location.
- **Delete**: Remove a warehouse if no inventory or shipments are associated.

### 3. Product Catalog
- **Create**: Add new products with details like category, supplier, and price.
- **Read**: View and search products by category or supplier.
- **Update**: Update product price or supplier information.
- **Delete**: Remove a product if it’s not linked to inventory or orders.

### 4. Inventory Management
- **Create**: Add inventory for a product in a warehouse.
- **Read**: View inventory levels across warehouses.
- **Update**: Adjust stock levels during restocking or sales.
- **Delete**: Remove inventory entries if a product is discontinued.

### 5. Customer Management
- **Create**: Register a new customer with contact and address details.
- **Read**: View customer profiles and order history.
- **Update**: Modify customer contact info or address.
- **Delete**: Remove a customer if no active orders exist.

### 6. Order Management
- **Create**: Place new orders for customers.
- **Read**: View all orders, filter by status, or search by customer.
- **Update**: Modify order status (e.g., Pending → Shipped).
- **Delete**: Cancel orders if they haven’t been shipped.

### 7. Shipment Tracking
- **Create**: Schedule shipments for orders.
- **Read**: View shipment history and track status (e.g., In Transit).
- **Update**: Modify shipment details (e.g., delivery date).
- **Delete**: Cancel shipments if the associated order is canceled.

---

## System Purpose
The Supply Chain Management System aims to:
- Simulate real-world database interactions.
- Serve as a practice ground for CRUD operations and SQL logic.
- Provide a scalable foundation for managing suppliers, inventory, orders, and logistics.

---

## Initial Task Overview
1. **Set up Database**: Design and implement the database schema.
2. **Populate Tables**: Add sample data for suppliers, warehouses, products, and customers.
3. **CRUD Functionality**: Implement base CRUD operations for each entity.
4. **Reporting and Queries**: Create SQL queries to:
   - List products with low inventory.
   - Track orders and shipments for a specific customer.
   - Identify the busiest warehouse based on orders fulfilled.
5. **Testing**: Test all operations for consistency and accuracy.
