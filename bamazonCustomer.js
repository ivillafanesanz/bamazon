var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "127.0.0.1",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "andrea95",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showProduct();
});

function showProduct() {
    console.log("Selecting all products...\n");
    

    connection.query("SELECT * FROM product", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        inquirer.prompt([
            {
                type: 'input',
                name: 'itemID',
                message: 'What is the id of the product you want to buy ? \n \n'
            }
        ]).then(function (response) {
            // console.log("Items " + itemID.itemID);
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'units',
                    message: 'How many units of the product would you like to buy? \n \n'
                }
            ]).then(function (responseUnits) {
                // console.log("Item ID " + response.itemID);

                // console.log("result" + res);
                var productID = parseInt(response.itemID);
                var unitQuantity = responseUnits.units;
                var existingStock = res[productID-1].stock_quantity;
                console.log("hi this is existingstock"+existingStock);
                // console.log(res[parseInt(productID)].stock_quantity);
                // console.log(res[response.itemID].stock_quantity);

                var price = res[productID-1].price;
                console.log("the price is"+price);

                


                // console.log(response.itemID);
                // console.log("Items " + itemID.itemID);

                updateProduct(unitQuantity, productID, existingStock,price);
                // console.log("unitquantity",unitQuantity);
                // console.log("productid",productID);
                // console.log("existingstock",existingStock);


            })

            function updateProduct(unitQuantity, productID, existingStock, price) {

                console.log("Updating all amazon quantities...\n");
                if (parseInt(existingStock) <= parseInt(unitQuantity)) {
                    console.log("insufficient quantity!")
                }
                else {
                    var existing = parseInt(existingStock) - parseInt(unitQuantity)

                    // var costPurchase = parseInt(unitQuantity)*"price"

                    console.log("stock after"+existing)
                    console.log("existing stock is"+existingStock)
                    var query = connection.query(

                        "UPDATE product SET ? WHERE ?",
                        [
                            {
                                stock_quantity: existing
                            },
                            {
                                id: productID
                            }
                        ],
                        function (err, res) {
                            console.log(res.affectedRows + " products updated!\n");
                            console.log(err);
                            // Call deleteProduct AFTER the UPDATE completes
                            connection.end();
                        }

                        
                    );
                    var customerCost = unitQuantity*price;
                        console.log("The purchase will cost you in dollars",customerCost);

                    // logs the actual query being run
                    console.log(query.sql);
                }


            }




        })





    });
}