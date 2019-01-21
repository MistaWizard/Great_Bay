require("dotenv").config();

// Our requirements
const keys = require("./keys.js");
var mysql = require("mysql");
var inquirer = require("inquirer");

const pwd = keys.mysqlDB.password;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: pwd,
  database: "greatBay_db"
});


// variables to communicate with the command line
var nodeArgs = process.argv;
var action = process.argv[2];
var value = "";

// Allowing multiples words on the command line
for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {
    value = value + "+" + nodeArgs[i];
  }
  else {
    value += nodeArgs[i];
  }
}

// Can we define readProducts as a var, to call from later functions? -robert
switch (action) {

  case "auction-bid":
    auctionBid();
    break;

  case "select-auction":
    readProducts();
    break;
}

function readProducts() {
  console.log("Selecting all auctions...\n");
  connection.query("SELECT * FROM auctions", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};

//readProducts();

//************************************************************************************ */

// function to get all items available for bidding, and allow you to place a bid
// auctionBid should be called in the opening prompt
function  auctionBid() {
  // query DB for available items/auctions
  connection.query("SELECT * FROM auctions", function (err, res) {
    if (err) throw err;
    // prompt for selection from available items
    inquirer.prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function () {
          var availArray = [];
          for (var i = 0; i < res.length; i++) {
            availArray.push(res[i].item_name);
          }
          return availArray;
        },
        message: "What would you like to bid on?"
      },
      {
        name: "bid",
        type: "input",
        message: "How much would you like to bid?"
      }
    ]).then(function (selection) {
      // call the choice from the DB
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].item_name === selection.choice) {
          chosenItem = res[i];
        }
      }

      // is the submitted bid the highest bid?
      if (chosenItem.highBid < parseInt(selection.bid)) {
        // If bid is highest, update db, log it, restart
        connection.query("UPDATE auctions SET ? WHERE ?", [{
          highBid: selection.bid
        }, {
          id: chosenItem.id
        }], function (error) {
          if (error) throw err;
          console.log("High bid! One step closer to OWNING IT!");
          readProducts();
        });
      }
      else {
        // if bid isn't highest, log it and readProducts over
        console.log("What else in them pockets, cuz that bid ain't gettin it.");
        readProducts();
      }
    });
  });
};

// restart the ACTION!
//readProducts();