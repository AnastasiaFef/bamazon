var inquirer = require('inquirer');
var mysql = require('mysql');
require('dotenv').config()
// const db = require('db')

var connection = mysql.createConnection({
        multipleStatements: true,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'bamazon'
})

connection.connect(function(err, res){
    if(err) throw err;
})

initialPrompt();

function initialPrompt(){
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(function(responce){
        console.log(responce.action)
        switch (responce.action) {
            case 'View Products for Sale': 
                viewProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            default: 
                console.log('Something went wrong...');
                break;
        }
    })
}

function viewProducts(){
    connection.query(
        'SELECT item_id, product_name, price, stock_quantity FROM products', 
        function(err, res){
            if(err) throw err;
            console.log('\n\nitem_id | product_name | price | stock_quantity');
            res.forEach(
                function(element){
                    console.log(element.item_id + ' | ' + element.product_name + ' | ' + element.price + ' | ' + element.stock_quantity);
                }
            )
            console.log('\n');
            whatsNext();
        }
    )
}

function viewLowInventory(){
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5', 
        function(err, res){
            if(err) throw err;
            console.log('\nitem_id | product_name | price | stock_quantity');
            res.forEach(
                function(element){
                    console.log(element.item_id + ' | ' + element.product_name + ' | ' + element.price + ' | ' + element.stock_quantity);
                }
            )
            console.log('\n');
            whatsNext();
        }
    )
}

function addToInventory(){
    connection.query(
        'SELECT * FROM products',
        function(err, res){
            if(err) throw err;
            var arrayOfElements = [];
            res.forEach(element => {
                arrayOfElements.push(element.item_id + ', ' + element.product_name + ', ' + element.stock_quantity);
            });
            console.log('\n');
            inquirer.prompt([
                {
                    type: 'list',
                    choices: arrayOfElements,
                    message: 'What items would you like to add to inventory?',
                    name: 'selectedItem'
                },
                {
                    type: 'input',
                    message: 'How many items would you like to add?',
                    name: 'thisMany'
                }
            ]).then(function(answer){
                var selectedId = parseInt(answer.selectedItem.split(', ')[0]);
                var quantityWas = parseInt(answer.selectedItem.split(', ')[2]);
                var totalItemsQuantity = quantityWas + parseInt(answer.thisMany);
                // console.log(selectedId, typeof(selectedId), totalItemsQuantity, typeof(totalItemsQuantity));
                connection.query(
                    'UPDATE products SET stock_quantity = ' + totalItemsQuantity + ' WHERE item_id = ' + selectedId,
                    function(err, res){
                        if(err) throw err;
                        // console.log(res);
                        connection.query(
                            'SELECT * FROM products WHERE item_id =' + selectedId,
                            function(err, res){
                                if(err) throw err;
                                console.log('\nQuantity of ', res[0].product_name, ' was changed from ' + quantityWas + ' to ' + totalItemsQuantity + '!!!');
                                console.log('\n');
                                whatsNext();
                            }
                        )
                    }
                )
            })
        }
    )
}

function addProduct(){
    var departmentNames = [];
    connection.query(
        'SELECT * FROM departments',
        function(err, res){
            if(err) throw err;
            res.forEach(element => {
                departmentNames.push(element.department_name);
            });
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of item you would like to add?',
                    name: 'name'
                },
                {
                    type: 'list',
                    message: 'Select the department for this item.',
                    name: 'department',
                    choices: departmentNames
                },
                {
                    type: 'input',
                    message: 'What is the retail price for a single item?',
                    name: 'price'
                },
                {
                    type: 'input',
                    message: 'Please enter quantity of the item.',
                    name: 'quantity'
                }
            ]).then(function(responce){
                var product_name = responce.name;
                var department_name = responce.department;
                var price = parseFloat(responce.price);
                var stock_quantity = parseInt(responce.quantity);
                connection.query(
                    'INSERT INTO products SET ?', 
                    [{
                        product_name: product_name,  
                        department_name: department_name, 
                        price: price,
                        stock_quantity: stock_quantity
                    }],
                    function(err, res){
                        if(err) throw err;
                        console.log('Item ', product_name, ' was successfully added to inventory.\n');
                        whatsNext();
                    }
                )
            })
        }
    )
}

function whatsNext(){
    inquirer.prompt([
        {
            message: 'What\'s next?',
            type: 'list',
            name: 'next',
            choices: ['I love managing so much, let me do it again!', 'Ohh, I am tired of managing... :(']
        }
    ]).then(function(responce){
        console.log('\n');
        if(responce.next === 'I love managing so much, let me do it again!'){
            initialPrompt();
        }
        else{
            process.exit();
        }
    })
}