DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30)
);
CREATE TABLE role (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);
CREATE TABLE employee (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
FOREIGN KEY (role_id) REFERENCES role (id),
-- ON DELETE SET NULL,
    -- REFERENCES roles
manager_id INT,
FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
    -- IF NO VALUE SET NULL
    -- manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)
);