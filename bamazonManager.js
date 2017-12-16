
// Challenge #2: Manager View (Next Level)

// Create a new Node application called bamazonManager.js. Running this application will:
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, 
// the app should list every available item: 
// the item IDs, names, prices, and quantities.

// If a manager selects View Low Inventory, then it 
// should list all items with an inventory count lower than five.

// If a manager selects Add to Inventory, your app should 
// display a prompt that will let the manager "add more" of any item currently in the store.

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

// If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.
// Challenge #3: Supervisor View (Final Level)

// Create a new MySQL table called departments. Your table should include the following columns:

// department_id

// department_name

// over_head_costs (A dummy number you set for each department)

// Modify the products table so that there's a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.

// Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// Make sure your app still updates the inventory listed in the products column.
// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:

// View Product Sales by Department

// Create New Department

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// department_id department_name over_head_costs product_sales total_profit
// 01  Electronics 10000 20000 10000
// 02  Clothing  60000 100000  40000
// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.

// If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.

// Hint: You may need to look into aliases in MySQL.

// Hint: You may need to look into GROUP BYs.

// Hint: You may need to look into JOINS.

// HINT: There may be an NPM package that can log the table to the console. What's is it? Good question :)

// Minimum Requirements

// Attempt to complete homework assignment as described in instructions. If unable to complete certain portions, please pseudocode these portions to describe what remains to be completed.

// One More Thing

// If you have any questions about this project or the material we have covered, please post them in the community channels in slack so that your fellow developers can help you! If you're still having trouble, you can come to office hours for assistance from your instructor and TAs.

// Good Luck!


var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
                  host: "localhost",
                  port: 3306,

                  // Your username
                  user: "root",

                  // Your password
                  password: "root",
                  database: "bamazon"
                });

connection.connect(function(err) {
                                  if (err) throw err;
                                  showHeader();
                                  showSelection();
                                  //getData();
                                  //getUserInput();
                                  //endConnection();
                                  }
                    );

function endConnection(){
   connection.end();
};

function showHeader(){
  console.log("====================================================");
  console.log("       WELCOME TO BAMAZON MANAGER SECTION           ");
  console.log("====================================================");

}//end showHeader

function showSelection(){
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Produc
  // ask the user what to do 
  inquirer.prompt({
                name:"options",
                type:"list",
                message: "Choose from the following:",
                choices: [
                  "View Products for Sale",
                  "View Low Inventory",
                  "Add to Inventory",
                  "Add New Product",
                  "Quit"
                ]

              })
        .then(function(answer){
              switch (answer.next) {
                case "View Products for Sale":
                  //showproducts
                  showProducts();
                  break;
                case "View Low Inventory":
                  //view low inventory
                  viewLowInventory();
                  break;
                case "Add to Inventory":
                  //Add to inventory
                  addInventory();
                  break;
                case "Add New Product":
                  //addproducts
                  addProduct();
                  break;
                case "Quit":
                  endConnection();
                  return process.exit();
                  break;
                }
              });


}//end showHeader function


