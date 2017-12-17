
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
    console.log("===========================================================================");
  console.log("                 WELCOME TO BAMAZON MANAGER SECTION           ");
    console.log("===========================================================================");

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
              switch (answer.options) {
                case "View Products for Sale":
                  //showproducts
                  showProductHeader();
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

function showProductHeader(){

  console.log("===========================================================================");
  console.log("|| PRODUCT || QUANTITY  ||                                   ||          || ");
  console.log("|| NUMBER  || IN STOCK  || ITEM NAME                         || PRICE    ||");
  console.log("===========================================================================");
}// end showProductHeader

function showProducts(){

  connection.query("SELECT * FROM products ORDER BY item_id", function(err, res) {
      //=========START SHOWING THE LIST OF ITEMS FOR SALE  
        for (var i = 0; i < res.length; i++){
            console.log("||      "+res[i].item_id+ " || "+res[i].stock_quantity +"         ||"+ res[i].product_brandname + " "+ res[i].product_name +" "+res[i].product_color+" ||  $"+res[i].price.toFixed(2)+ " || "  );
        }//end for loop

        console.log("===========================================================================");
        showSelection();
        //console.log(res);

      });//end connection.query

}//end showProducts

function viewLowInventory(){

  connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY item_id", function(err, res) {
      //if there is none to show

      if (res.length >0){

    console.log("===========================================================================");
    console.log("                LIST OF LOW INVENTORY");
    showProductHeader();
      //=========START SHOWING THE LIST OF ITEMS with quantity under 5 
        for (var i = 0; i < res.length; i++){
            console.log("||      "+res[i].item_id+ " || "+res[i].stock_quantity +"         ||"+ res[i].product_brandname + " "+ res[i].product_name +"||  $"+res[i].price.toFixed(2)+ " || "  );
        }//end for loop

        console.log("===========================================================================");
        showSelection();
        //console.log(res);
      } else{
        console.log("All stock is good!");

        showSelection();
      }
  });//end connection.query
}//end viewLowInventory

function addInventory(){
  //showHeader();
  //showProducts();
  inquirer.prompt([{
                name:"itemID",
                type:"input",
                message: "Enter Product ID to add inventory:",

              },
                {
                name:"newQty",
                type:"input",
                message:"Enter quantity you would like to add to stock:",
              }
              ])
        .then(function(answer){
            var newQry = "SELECT stock_quantity FROM products WHERE item_id="+answer.itemID;
            //console.log(newQry);
            connection.query(newQry, function(err, res) {
            var oldQty = res[0].stock_quantity;
            var newQtyUpdate = parseInt(oldQty) + parseInt(answer.newQty);
            console.log("Inventory Added/Updated!")
            //connection.query();
            newQry = "UPDATE products SET stock_quantity="+newQtyUpdate+" WHERE item_id="+answer.itemID;
            connection.query(newQry, function(err, res) {});
            //console.log(newQry);

          });
            showProducts();
            //showSelection();
          });//end then function
            //connection.query();
}//end addInventory

function addProduct(){
  inquirer.prompt([{
                name:"itemdept",
                type:"input",
                message: "Enter Department Where the Product belongs (category):",

              },{
                name:"itembrand",
                type:"input",
                message: "Enter Brand name for the Product to add inventory:",

              },
                {
                name:"itemdesc",
                type:"input",
                message:"Enter full description of the item:",
              },
                {
                name:"itemcolor",
                type:"input",
                message:"Enter color:",
              },
                {
                name:"itemprice",
                type:"input",
                message:"Enter the unit price of the item:",
              },
                {
                name:"itemstock",
                type:"input",
                message:"Enter quantity of the item in stock:",
              }
              ])
        .then(function(answer){
            //var newSQL="INSERT INTO products ";

            connection.query('INSERT INTO products SET ?', 
              {
                product_brandname: answer.itembrand,
                product_name: answer.itemdesc,
                product_color: answer.itemcolor,
                department_name: answer.itemdept,
                price: answer.itemprice,
                stock_quantity: answer.itemstock

              }, function (error, results, fields) {
              if (error) throw error;
              console.log("========================================");
              console.log("NEW ITEM ADDED with ID: "+results.insertId);
              console.log("========================================");

            });
            //connection.query(newSQL, function(err, res) {});
            showSelection();
        });

}//end addProduct


