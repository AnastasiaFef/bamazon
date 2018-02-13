// The app will take in orders from customers and deplete stock from the store's inventory. 
// As a bonus task, you can program your app to track product sales across your store's 
// departments and then provide a summary of the highest-grossing departments in the store

// customer
// manager/supervisor

var mysql = require('mysql');
var inquirer = require('inquirer');
require('dotenv').config();
// var password = require('./')


// Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'bamazon'
});

connection.connect(function(err){
    if(err) throw err;
})

initialPrompt();

function initialPrompt(){
    connection.query(
        "SELECT item_id, product_name, price FROM products", function(err, res){
            if(err) throw err;
            console.log('item_id | product_name | price');
            res.forEach(element => {
                // var id = element.item_id
                // if(id.length < 3){
                //     id = id + ' ';
                // };
                console.log(element.item_id + ' | ' + element.product_name + ' | ' + element.price);
        });
        setTimeout(wannaBuy, 500);
    });
}

// The app should then prompt users with two messages.
//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

function wannaBuy(){
    inquirer.prompt([{
        type: 'input',
        message: 'Enter id of item you would like to buy:',
        name: 'id'
    },
    {
        type: 'input',
        message: 'How many would you like to buy?',
        name: 'quantity'
    }]).then(function(response){
            connection.query(
                "SELECT * FROM products WHERE item_id =" + response.id,
                (function(err, res){
                if(err) throw err;
                var dbQuantity = res[0].stock_quantity;
                if(dbQuantity < response.quantity){
                    console.log('Sorry we only have ' + dbQuantity + ' items in stock, please come back later!\n');
                    whatsNext();
                }
                else{
                    console.log("Sold!")
                    // However, if your store _does_ have enough of the product, you should fulfill the 
                    // customer's order.
                    // * This means updating the SQL database to reflect the remaining quantity.
                    // * Once the update goes through, show the customer the total cost of their purchase.
                    
                    placeOrder(res[0].item_id, response.quantity, dbQuantity, res[0].price);
                }
            })
        )
    })
}


function placeOrder(id, itemsRequested, dbQuantity, price){
    itemsRequested = parseInt(itemsRequested);
    var itemsLeft = dbQuantity - itemsRequested;
    connection.query(
        "UPDATE products SET stock_quantity = " + itemsLeft + " WHERE item_id = " + id,
        function(err, res){
            if(err) throw err;
            var purchaseSum = parseFloat(itemsRequested * price).toFixed(2);
            console.log('Please transfer $' + purchaseSum + ' to Anastasia\'s account\n');
            connection.query(
                'UPDATE products SET ? WHERE ?', [
                    {
                        product_sales: purchaseSum,
                    },
                    {
                        item_id: id
                    }
                ]
            )
            whatsNext();
        }
    )
}

function whatsNext(){
    inquirer.prompt([
        {
            message: 'What\'s next?',
            type: 'list',
            name: 'next',
            choices: ['I want to try again!', 'Let me out of here']
        }
    ]).then(function(response){
        console.log('\n');
        if(response.next === 'I want to try again!'){
            initialPrompt();
        }
        else{
            process.exit();
        }
    })
}