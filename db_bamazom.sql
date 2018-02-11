CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INTEGER(20) AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price FLOAT(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('mascara', 'cosmetics', 13.4, 3672), ('iPhone 5', 'electronics', 638, 3),
('milk', 'food', 3.42, 273), ('coat', 'clothes', 156, 42),
('bottled water', 'food', 1, 8371), ('twix', 'food', 2.99, 13144),
('table', 'furniture', 182.99, 16), ('rose', 'flowers', 5.55, 283),
('tulip', 'flowers', 3.33, 221), ('potato', 'food', 0.31, 721);

SELECT * FROM products;

CREATE TABLE departments(
    department_id INTEGER(20) AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL
);

SELECT department_name FROM products
GROUP BY department_name;

INSERT INTO departments(department_name, over_head_costs)
VALUES ('clothes', 300.21), ('cosmetics', 241), ('electronics', 251), ('flowers', 531), 
('food', 241), ('furniture', 241.45), ('travel', 382);

SELECT * FROM departments;

ALTER TABLE products
ADD product_sales DECIMAL(10,2);