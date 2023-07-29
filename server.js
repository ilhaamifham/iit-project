// Import required modules

const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Create an instance of Express.js

const app = express();
const port = 3000;

// Create an empty array to store cart items

let cartItems = [];

// Middleware to parse request body

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the static HTML file

app.use(express.static("cart"));

// Initialize the SQLite database

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database.");

    // Create the 'cart' table if it doesn't exist

    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY,
        item TEXT,
        quantity INTEGER
      )
    `);
  }
});

// Endpoint to add an item to the cart

app.post("/cart/add", (req, res) => {
  const { item, quantity } = req.body;
  const newItem = {
    id: cartItems.length + 1,
    item: item,
    quantity: parseInt(quantity),
  };

  // Add the item to the cart array

  cartItems.push(newItem);

  // Add the item to the SQLite database

  db.run(
    "INSERT INTO cart (item, quantity) VALUES (?, ?)",
    [item, quantity],
    (err) => {
      if (err) {
        console.error("Error inserting item into the database:", err.message);
        res.status(500).json({ message: "Error adding item to cart" });
      } else {
        res.json(newItem);
      }
    }
  );
});

// Endpoint to remove an item from the cart

app.delete("/cart/remove/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Remove the item from the cart array

  cartItems = cartItems.filter((item) => item.id !== id);

  // Remove the item from the SQLite database

  db.run("DELETE FROM cart WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Error removing item from the database:", err.message);
      res.status(500).json({ message: "Error removing item from cart" });
    } else {
      res.json({ message: "Item removed successfully" });
    }
  });
});

// Endpoint to show the cart items

app.get("/cart/show", (req, res) => {
  res.json(cartItems);
});

// Default route handler for GET requests

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/cart/index.html");
});

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
