INSERT INTO department (id,dept_name)
VALUES
    (2,"Engineering"),
    (3,"Finance"),
    (4,"Legal"),
    (1,"Sales");
INSERT INTO role (title,salary,department_id)
VALUES
    ("Sales Lead",100000, 1),
    ("Salesperson",80000, 1),
    ("Lead Engineer",150000, 2),
    ("Software Engineer",120000, 2),
    ("Account Manager",160000, 3),
    ("Accountant",125000, 3),
    ("Legal Team Lead",250000, 4),
    ("Lawyer",190000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Don', 1, null),
('Mike', 'Chan', 1, 1),
('Ashley', 'Rodriguez', 2, null),
('kevin', 'Tupik', 2, 2),
('Kunal', 'Singh', 3, null),
('Malia', 'Brown', 3, 3),
('Sarah', 'Lourd', 4, null),
('Tom', 'Allen', 4, 4);

