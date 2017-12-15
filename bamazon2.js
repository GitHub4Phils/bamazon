
// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, 
// your application should check if your store has enough of the 
// product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, 
// and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
// If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.
// Challenge #2: Manager View (Next Level)

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

connection.connect(function(err) {if (err) throw err;showAllItems();});



function showAllItems() {
      console.log("===========================================================================");
      console.log(" Welcome to BAMAZON! Your one stop resource for pretty much anything!");
      console.log("===========================================================================");
      console.log("|| PRODUCT || QUANTITY  ||                                   ||          || ");
      console.log("|| NUMBER  || IN STOCK  || ITEM NAME                         || PRICE    ||");
      console.log("===========================================================================");

      // query the database and show all the items for sale

      connection.query("SELECT * FROM products ORDER BY item_id", function(err, res) {
      // =========START SHOWING THE LIST OF ITEMS FOR SALE  
        for (var i = 0; i < res.length; i++){
            console.log("||      "+res[i].item_id+ " || "+res[i].stock_quantity +"         ||"+ res[i].product_brandname + " "+ res[i].product_name +" $"+res[i].price+ " || "  );
        }
      //==========END SHOWING THE LIST OF ITEMS FOR SALE

      // after showing what's available ask the user what product number to buy and the quantity
       inquirer
          .prompt([{
            name: "itemID",
            type: "input",
            message: "Please enter the product number you'd like to purchase: "
          },
          {
            name:"qty",
            type:"input",
            message: "Please enter how many you would like to purchase: "
          }
          ])
          .then(function(answer) {
            //if qty given is more than what's in stock
            if (answer.qty <= res[answer.itemID-1].stock_quantity){

                    orderFooter1();
                  
                    total= res[answer.itemID-1].price * answer.qty;
                    newQty= res[answer.itemID-1].stock_quantity - answer.qty;
                    console.log("product number: " + res[answer.itemID-1].item_id + "|| " +res[answer.itemID-1].product_brandname + " "+ res[answer.itemID-1].product_name+" "+res[answer.itemID-1].price + " x "+ answer.qty);
                   //};
                   //call update database
                      var newQry="UPDATE table products SET stock_quantity="+newQty + " WHERE item_id="+answer.itemID;
                      console.log(newQry);

                      //call the footer function passing total
                      orderFooter2(total);
                      //call what to do next function
                      askWhatNext();

            }

          else{
            // qty given is more than whats in stock
            console.log("Insufficient quantity for your order.");
          };

        });

