
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

connection.connect(function(err) {
                                  if (err) throw err;

                                  showHeader();
                                  getData();
                                  //getUserInput();
                                  //endConnection();
                                  }
                    );

function endConnection(){
   connection.end();
};


function showHeader(){
  console.log("===========================================================================");
  console.log(" Welcome to BAMAZON! Your one stop resource for pretty much anything!");
  console.log("===========================================================================");
  console.log("|| PRODUCT || QUANTITY  ||                                   ||          || ");
  console.log("|| NUMBER  || IN STOCK  || ITEM NAME                         || PRICE    ||");
  console.log("===========================================================================");
}

function getData(){
  // query the database and show all the items for sale

      connection.query("SELECT * FROM products ORDER BY item_id", function(err, res) {
      // =========START SHOWING THE LIST OF ITEMS FOR SALE  
        for (var i = 0; i < res.length; i++){
            console.log("||      "+res[i].item_id+ " || "+res[i].stock_quantity +"         ||"+ res[i].product_brandname + " "+ res[i].product_name +"||  $"+res[i].price.toFixed(2)+ " || "  );
        }//end for loop

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
            //console.log(answer.itemID);
            //console.log(answer.qty);
            var itemSelected= (answer.itemID) - 1;
            //console.log(res[itemSelected].stock_quantity);

            if (answer.qty <= res[itemSelected].stock_quantity){
                //qty check ok
                //console.log("Yes we can give your order");
                var newQty=(res[itemSelected].stock_quantity) - answer.qty;
                var total=res[itemSelected].price * answer.qty;
                var newSql="UPDATE products SET stock_quantity="+newQty+" WHERE item_id="+answer.itemID;
                //console.log(newSql);
                connection.query(newSql);
                orderFooter1();
                console.log(res[itemSelected].product_brandname + " "+res[itemSelected].product_name+" "+ answer.qty+ " x $"+ res[itemSelected].price.toFixed(2));
                orderFooter2(total);
                askWhatNext();
            }
            else{
                //qty check not ok
                sayInsufficient();
                //endConnection();
                showHeader();
                getData();
                //getUserInput();
            }
          });


      });//end query
}//end function

function sayInsufficient(){
      console.log("===========================================================================");
      console.log("Insufficient stock to fullfill your order. Please try again");
      console.log("===========================================================================");
}

function getUserInput(itemID,stockQty){
  inquirer
          .prompt([
          {
            name:"qty",
            type:"input",
            message: "Please enter how many you would like to purchase: "
          }
          ])
          .then(function(answer) {
            //console.log(itemID);
            //console.log(answer.qty);
            var itemSelected= (answer.itemID) - 1;
            //console.log(answer.qty);

            if (answer.qty <= res[itemSelected].stock_quantity){

                //qty check ok
                //console.log("Yes we can give your order");
                var newQty;
                var total=res[itemSelected].price * answer.qty;
                var newSql="UPDATE products SET stock_quantity="+answer.qty+" WHERE item_id="+itemID+";";
                //console.log(newSql);
                connection.query(newSql);
            }
            else{
                //qty check not ok
                sayInsufficient();
                //getData();
                getUserInput(itemID,stockQty);
            }
          });
}

function orderFooter1(){
  console.log("===========================================================================");
  console.log(" Your order summary:");
  console.log("===========================================================================");
}

function orderFooter2(total){
  console.log("===========================================================================");
  console.log("                                                    Total: $ "+ total.toFixed(2) );
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
                  showHeader();
                  getData();
                  break;
                case "Quit":
                  endConnection();
                  return process.exit();
                  break;
                }
              });
}


