DROP DATABASE IF EXISTS bamazon;


CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE product(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);
INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES ("chair", "chairs", 100, 50 );

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES ("chocolate", "food", 5, 100);