const mysql = require("mysql2");
const inquirer = require("inquirer");
// const Choices = require("inquirer/objects/choices");
const PORT = process.env.PORT || 3001;
const cTable = require('console.table');
//Connect to datebase
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_tracker",
  },
  console.log(`Connected to the datebase`)
);
const DepartmentList = () => {
  return new Promise((fill, reject) => {
  var departmentNewList = []
  db.query('SELECT * FROM department', (err, results) => {
  if (err) {
  reject(err)
          }
  for (let i = 0; i < results.length; i++) {
  departmentNewList.push(results[i]);
}
fill(departmentNewList)})})
}
const roleList = () => {
  return new Promise((fill, reject) => {
      var roleNewList = []
      db.query('SELECT * FROM employeerole', (err, results) => {
          if (err) {
              reject(err)
          }
          for (let i = 0; i < results.length; i++) {
              roleNewList.push(results[i].title);
          }
          fill(roleNewList)
      })
  })
}
const employeeList = () => {
  return new Promise((fill, reject) => {
      var employeeNewList = []
      db.query('SELECT * FROM employee', (err, results) => {
          if (err) {
              reject(err)
          }
          for (let i = 0; i < results.length; i++) {
              employeeNewList.push(results[i].first_name + ' ' + results[i].last_name);
          }
          fill(employeeNewList)
      })
  })
}
const managerList = () => {
  return new Promise((fill, reject) => {
      var managerNewList = []
      db.query('SELECT * FROM employee', (err, results) => {
          if (err) {
              reject(err)
          }
          for (let i = 0; i < results.length; i++) {
              managerNewList.push(results[i].first_name + ' ' + results[i].last_name);
          }
          fill(managerNewList)
      })
  })
}
const deptId = (allNumId) => {
  return new Promise((fill, reject) => {
      db.query('SELECT id FROM department WHERE name = ?', allNumId, (err, results) => {
          if (err) {
              reject(err)
          } else {
              fill(results[0].id)
          }
      })
  })
}
const roleId = (allNumId) => {
  return new Promise((fill, reject) => {
      db.query('SELECT id FROM employeerole WHERE title = ?', allNumId, (err, results) => {
          if (err) {
              reject(err)
          } else {
              fill(results[0].id)
          }
      })
  })
}
const employeeId = (allNumId) => {
  return new Promise((fill, reject) => {
      db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [allNumId.split(' ')[0], allNumId.split(' ')[1]], (err, results) => {
          if (err) {
              reject(err)
          } else {
              fill(results[0].id)
          }
      })
  })
}
const ask = () => {
  inquirer.prompt([{
          type: 'list',
          name: 'selection',
          message: 'What would you like to do?',
          choices: ['View All Employee',
              'Add Employee',
              'Update Employee Role',
              'View All Role',
              'Add Role',
              'View All department',
              'Add Department',
              'QUIT'
          ]
      }])
  .then(ans => {
          switch (ans.selection) {
              case 'View All Employee':
                  viewEmployee();

                  break;
              case 'Add Employee':
                  addEmployee()
                  break;
              case 'Update Employee Role':
                  updateEmployeeRole()
                  break;
              case 'View All Role':
                  viewRole()
                  break;
              case 'Add Role':
                  addRole()
                  break;
              case 'View All department':
                  viewDepartment()
                  break;
              case 'Add Department':
                  addDepartment()
                  break;
              default:
                  console.log('Thank you for using this program (control + C) after select quit')
                  break;
          }
      })
}

const viewEmployee = () => {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, employeerole.title, department.name As department, employeerole.salary,CONCAT(m.first_name,' ',m.last_name) AS manager FROM employee JOIN employeerole on employeerole.id = employee.role_id JOIN department ON department.id = employeerole.department_id LEFT JOIN employee m ON employee.manager_id = m.id", (err, result) => {
      if (err) {
          console.log(err)
      } else {
          const table = cTable.getTable(result)
          console.log(table)
      }
      ask()
  })
}

const addEmployee = async () => {
  const newRoleList = await roleList();
  const newManagerList = await managerList();
  inquirer.prompt([{
          type: 'input',
          name: 'firstName',
          message: "What is your employee's first name?",
      }, {
          type: 'input',
          name: 'lastName',
          message: "What is your employee's last name?",
      }, {
          type: 'list',
          name: 'roles',
          message: "What is your employee's role?",
          choices: newRoleList

      }, {
          type: 'list',
          name: 'Manager',
          message: "Who is your employee's manager?",
          choices: newManagerList
      }])
      .then(async (ans) => {
          const roleIds = await roleId(ans.roles)
          const managerIds = await employeeId(ans.Manager)
          const addFunc = "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
          const addName = [ans.firstName, ans.lastName, roleIds, managerIds]

          db.query(addFunc, addName, (err, result) => {
              if (err) {
                  throw err
              } else {
                  db.query(`SELECT CONCAT(a.first_name, " ", a.last_name) AS Name, employeerole.title AS Role, IFNULL(CONCAT(b.first_name, " ", b.last_name),NULL) AS Manager
                  FROM employee a
                  LEFT JOIN employee b ON b.id = a.manager_id
                  JOIN employeerole ON a.role_id = employeerole.id
                  ORDER BY a.last_name`, (err, result) => {
                      if (err) {
                          throw err
                      } else {
                          console.table(result)
                          ask()
                      }

                  })
              }
          })
      })
}
const updateEmployeeRole = async () => {
  const employeeNew = await employeeList()
  const newRoleList = await roleList();
  inquirer.prompt([{
      type: 'list',
      name: 'employeeName',
      message: "Which employee's role do you want to update?",
      choices: employeeNew

  }, {
      type: 'list',
      name: 'updateEmployeeRole',
      message: "which role do you want to assign the selected employee?",
      choices: newRoleList
  }]).then(async (ans) => {
      const roleIds = await roleId(ans.updateEmployeeRole)
      const employeeIds = await employeeId(ans.employeeName)
      const update = `UPDATE employee SET role_id = ${roleIds} WHERE id = ${employeeIds}`;
      db.query(update, (err, result) => {
          if (err) {
              throw err
          } else {
              db.query(`SELECT CONCAT(a.first_name, " ", a.last_name) AS Name, employeerole.title AS Role, IFNULL(CONCAT(b.first_name, " ", b.last_name),NULL) AS Manager
                      FROM employee a
                      LEFT JOIN employee b ON b.id = a.manager_id
                      JOIN employeerole ON a.role_id = employeerole.id
                      ORDER BY a.last_name`, (err, results) => {
                  if (err) {
                      throw err
                  } else {
                      console.table(results)
                    ask()
                  }
              })
          }
      })
  })
}
const viewRole = () => {
  db.query('SELECT employeerole.id,employeerole.title, department.name AS department, employeerole.salary FROM employeerole JOIN department ON department.id = employeerole.department_id', (err, result) => {
      if (err) {
          console.log(err)
      } else {
          const table = cTable.getTable(result)
          console.log(table)
      }
      ask()
  })
}
const addRole = async () => {
  var myListDepartment = await DepartmentList();
  inquirer.prompt([{
      type: 'input',
      name: 'role',
      message: 'What is the name of the role?'
  }, {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?'
  }, {
      type: 'list',
      name: 'departmentList',
      message: 'Which department does the role belong to?',
      choices: myListDepartment
  }]).then(async (ans) => {
      const roleIds = await deptId(ans.departmentList)
      db.query('INSERT INTO employeerole(title,salary,department_id) VALUES (?,?,?)', [ans.role, ans.salary, roleIds], (err, results) => {
          if (err) {
              throw err
          } else {
              db.query('SELECT title AS role, salary AS Salary, department.name AS department FROM employeerole JOIN department ON department_id = department.id', (err, results) => {
                  if (err) {
                      throw err
                  } else {
                      console.table(results)
                      ask()
                  }
              })
          }
      })

  })
}
const viewDepartment = () => {
db.query('SELECT department.id, department.name AS department FROM department', (err, result) => {
if (err) {
throw err
} else {
const table = cTable.getTable(result)
console.log(table)}
      ask()
  })
}

const addDepartment = () => {

  inquirer.prompt([{
      type: 'input',
      name: 'department',
      message: 'What is the name of the department'
  }]).then(ans => {
      const addDe = [ans.department]
      db.query('INSERT INTO  department(name) VALUES (?)', addDe, (err, result) => {
          if (err) {
              throw err
          } else {
              console.log('added new department')
              db.query('SELECT name AS Department FROM department', (error, results) => {
                  if (err) {
                      throw err
                  } else {
                      console.table(results)
                      ask()
                  }
              })
          }
      })

  })
}
ask()


