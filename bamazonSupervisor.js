require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'bamazon'
})

connection.connect(function(err, res){
    if(err) throw err;
})

initialPrmpt();

function initialPrmpt(){
    inquirer.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            name: 'doThis',
            choices: ['View Product Sales by Department', 'Create New Department']
        }
    ]).then(function(res){
        if(res.doThis === 'View Product Sales by Department'){
            salesByDepartment();
        }
        else{
            newDepartment();
        }
    })
}

function salesByDepartment(){
    console.log('\n');
//     When a supervisor selects `View Product Sales by Department`, 
// the app should display a summarized table in their terminal/bash window. 
// Use the table below as a guide.

// **HINT**: There may be an NPM package that can log the table to the console. 
// What's is it? Good question :)

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

    connection.query(
        'SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) product_sales ' +
        'FROM departments AS d ' +
        'LEFT JOIN products AS p ON ' +
        'd.department_name = p.department_name ' +
        'GROUP BY d.department_id;',
        function(err, res){
            if(err) throw err;
            var arrayWithProfit = [];
            res.forEach(element =>{
                var total_profit = element.product_sales - element.over_head_costs;
                total_profit = parseFloat(total_profit).toFixed(2);
                element.total_profit = total_profit;
                arrayWithProfit.push(element);
            });
            console.table(arrayWithProfit);
            whatsNext();
        }
    )

// The `total_profit` column should be calculated on the fly using the difference between 
// `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. 
// You should use a custom alias.


    
}

function newDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please enter the name of department you want to add:'
        },
        {
            type: 'input',
            message: 'What is the overhead cost for that department?',
            name: 'overhead'
        }
    ]).then(function(response){
        var overheadCost = parseFloat(response.overhead).toFixed(2);
        connection.query(
            'INSERT INTO departments(department_name, over_head_costs) ' +
            'VALUES (\'' + response.name + '\', \'' + overheadCost + '\')',
            function(err, res){
                if(err) throw err;
                console.log('New department added!');
                whatsNext();
            } 
        )
    })
}

function whatsNext(){
    inquirer.prompt([
        {
            message: 'What\'s next?',
            type: 'list',
            name: 'next',
            choices: ['Let me do some more work', 'Let me go!']
        }
    ]).then(function(response){
        console.log('\n');
        if(response.next === 'Let me do some more work'){
            initialPrmpt();
        }
        else{
            process.exit();
        }
    })
}


