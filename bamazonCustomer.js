// Challenge #1: Customer View (Minimum Requirement)
// Create a MySQL Database called bamazon.
// Then create a Table inside of that database called products.
// The products table should have each of the following columns:
// item_id (unique id for each product)
// product_name (Name of product)
// department_name
// price (cost to customer)
// stock_quantity (how much of the product is available in stores)
// Populate this database with around 10 different products. 
//(i.e. Insert "mock" data rows into this database and table).
// Then create a Node application called bamazonCustomer.js. 
//Running this application will first display all of the items available for sale. 
//Include the ids, names, and prices of products for sale.

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


//var columnify = require('columnify');

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
  showAllItems();

});

function showAllItems() {
      console.log("===========================================================================");
      console.log(" Welcome to BAMAZON! Your one stop resource for pretty much anything!");
      console.log("===========================================================================");
      console.log("|| PRODUCT || QUANTITY  ||                                   ||          || ");
      console.log("|| NUMBER  || IN STOCK  || ITEM NAME                         || PRICE    ||");
      console.log("===========================================================================");

      // query the database and show all the items for sale

      connection.query("SELECT * FROM products ORDER BY item_id", function(err, res) {
        for (var i = 0; i < res.length; i++){
            console.log("||      "+res[i].item_id+ " || "+res[i].stock_quantity +"         ||"+ res[i].product_brandname + " "+ res[i].product_name +" $"+res[i].price+ " || "  );
        }

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
            message: "Please enter how many you would like to purchase"
          }
          ])
          .then(function(answer) {
            var query = "SELECT * FROM products WHERE item_id=?";
            // if (res[answer.itemID - 1].stock_quantity < answer.qty) {
            //   console.log(you asked for too much)
            //   //restart the function
            // }
            // else {}
            connection.query(query, [answer.itemID], function(err, res) {
              
              //  get a running total
              var total=0;

              // check if the quantity they want is equal or less than what's in stock
              if (answer.qty <= res[0].stock_quantity){
                  //if there's stock then print and show total bill
                  //call the order footer
                  orderFooter1();
                  
                    total= res[0].price * answer.qty;
                    newQty= res[0].stock_quantity - answer.qty;
                    console.log("product number: "+res[0].item_id + "|| " +res[0].product_brandname + " "+ res[0].product_name+" "+res[0].price + " x "+ answer.qty);
                   //};
                   //call update database
                      var newQry="UPDATE table products SET stock_quantity="+newQty + " WHERE item_id="+answer.itemID;
                      console.log(newQry);

                      //call the footer function passing total
                      orderFooter2(total);
                      //call what to do next function
                      askWhatNext();
                      
                      
              } else {
                    inquirer.prompt({
                      name:"qty",
                      type:"input",
                      message:"Insufficient quantity to fulfull your order.\n Please Enter quantity: "
                    })
                    .then(function(answer2){
                      orderfooter1();
                      for (var i = 0; i < res.length; i++) {
                        total= res[i].price * answer2.qty;
                        newQty= res[i].stock_quantity - answer2.qty;

                        console.log(res[i].item_id + " " +res[i].product_brandname + " "+ res[i].product_name+" "+res[i].price + " x "+ answer2.qty);
                       };

                       //call update database
                      var newQry="UPDATE table products SET stock_quantity="+newQty + " WHERE item_id="+answer.itemID;
                      console.log(newQry);

                       orderfooter2(total);
                      // call what to do next function
                      askWhatNext();
                      
                                   });
                      }//end else
            });
          });
    });
}

function orderFooter1(){
  console.log("===========================================================================");
  console.log(" Your order summary:");
  console.log("===========================================================================");
}

function orderFooter2(total){
  console.log("===========================================================================");
  console.log("                                                      Total: $ "+ total );
  console.log("===========================================================================");
  console.log("Thank you for your order!");
  console.log(" ");

}

function askWhatNext(){
// ask the user what to do next
  inquirer.prompt({
                name:"next",
                type:"list",
                message: "What would you like to do next?",
                choices: [
                  "Buy another product?",
                  "Quit"
                ]

              })
        .then(function(answer){
              switch (answer.next) {
                case "Buy another product?":
                  showAllItems();
                  break;
                case "Quit":
                  return process.exit();
                  break;
                }
              });
                                  


}