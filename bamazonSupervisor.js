require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = sql.createConnection({
    user: 'root',
    password: process.env.DB_PASSWORD,
    port: 3306,
    host: 'localhost',
    batabase: 'bamazon'
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



// The `total_profit` column should be calculated on the fly using the difference between 
// `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. 
// You should use a custom alias.


    whatsNext();
}

function newDepartment(){
    console.log('in newDepartment')
    console.log('\n');


    whatsNext();
}

function whatsNext(){
    inquirer.prompt([
        {
            message: 'What\'s next?',
            type: 'list',
            name: 'next',
            choices: ['Let me do some more work', 'Let me go!']
        }
    ]).then(function(responce){
        console.log('\n');
        if(responce.next === 'Let me do some more work'){
            initialPrmpt();
        }
        else{
            process.exit();
        }
    })
}


