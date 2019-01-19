require("dotenv").config();

// Our requirements
const keys = require("./keys.js");
var mysql = require("mysql");
var inquirer = require("inquirer");

const pwd = process.env.MYSQL_PWD;

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

function readProducts() {
    console.log("Selecting all auctions...\n");
    connection.query("SELECT * FROM auctions", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
};

readProducts();