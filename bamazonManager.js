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
    // showProduct();
    askQuestions();
});



// Present user with options and get input
function askQuestions() {


    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add new product"],
            name: "selection"
        }
    ]).then(function (answer) {
        userCommand(answer.selection);
    });
}


function userCommand(selection) {

    // Switch statement based on user's selection
    switch (selection) {
        case "View Products for Sale":
            showProduct();
            break;
        case "View Low Inventory":
            lowInventory();
            break;
        case "Add to Inventory":
            addInventory();
            break;
        case "Add new product":
            createProduct();
            break;
    }
}

function showProduct() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM product", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
    });

}

function lowInventory() {
    console.log("Selecting all inventory low products...\n");

    connection.query(
        "SELECT * FROM product WHERE stock_quantity <= 5",

        function (err, res) {

            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(res);
            connection.end();
            // Call readProducts AFTER the DELETE completes
            //   showProduct();
        }


    );

}

function addInventory() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "product_name",
                message: "What is the name of the product you would like to add?"
            },
            {
                type: "input",
                name: "stock_quantity",
                // choices: getDepartments(products),
                message: "How many do you want to add?"
            }
        ]).then(function (response) {
            console.log("Updating  quantities...\n");
            var query = connection.query(
                "UPDATE product SET ? WHERE ?",
                [
                    {
                        stock_quantity: response.stock_quantity,
                    },
                    {
                        product_name: response.product_name
                    }
                ],
                function (err, res) {
                    console.log(res.affectedRows + " products updated!\n");
                    // Call deleteProduct AFTER the UPDATE completes
                    // deleteProduct();
                }
            );

            // logs the actual query being run
            console.log(query.sql);


        });
    }

function createProduct() {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "product_name",
                            message: "What is the name of the product you would like to add?"
                        },
                        {
                            type: "list",
                            name: "department_name",
                            // choices: getDepartments(products),
                            choices: ["furniture", "chairs", "office"],
                            message: "Which department does this product fall into?"
                        },
                        {
                            type: "input",
                            name: "price",
                            message: "How much does it cost?",
                        },
                        {
                            type: "input",
                            name: "stock_quantity",
                            message: "How many are you adding?"
                        }
                    ]).then(function (response) {
                        console.log("Inserting a new product...\n");
                        var query = connection.query(
                            "INSERT INTO product SET ?",
                            {
                                product_name: response.product_name,
                                department_name: response.department_name,
                                price: response.price,
                                stock_quantity: response.stock_quantity
                            },
                            function (err, res) {
                                console.log(res.affectedRows + " product inserted!\n");
                                // Call updateProduct AFTER the INSERT completes
                                showProduct();
                            }
                        );

                        // logs the actual query being run
                        console.log(query.sql);
                    });

        
                }