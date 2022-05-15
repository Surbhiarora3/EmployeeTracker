INSERT INTO  department(name)
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');


INSERT INTO  employeerole(title,salary,department_id)
VALUES ('Sales Lead', 100000,1),
            ('Salesperson', 75000,1),
            ('Lead Engineer',125000,2),
            ('Software Engineer',100000,2),
            ('Account Manager',80000,3),
            ('Accountant',70000,3),
            ('Legal Team Lead',110000,4),
            ('Lawyer',100500,4);
            

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('John', 'Doe',1,NULL),
('Mike','Chan',2,1),
('Ashley','Rodriguez',3,NULL),
('Kevin','Tupik',4,3),
('Kunal','Singh',5,NULL),
('Malia','Brown',6,5),
('Sarah','Lourd',7,NULL),
('Tom','Allen',8,7);
