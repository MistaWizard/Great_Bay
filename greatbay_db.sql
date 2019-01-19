CREATE DATABASE greatBay_DB;

USE greatBay_DB;

CREATE TABLE auctions(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  starting_bid INT default 0,
  highest_bid INT default 0,
  items_sold VARCHAR (150) NOT NULL,
  PRIMARY KEY (id)
);
