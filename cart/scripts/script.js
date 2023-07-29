// Handle form submissions

document.getElementById("addForm").addEventListener("submit", addItem);
document.getElementById("removeForm").addEventListener("submit", removeItem);
document.getElementById("showItems").addEventListener("click", showItems);

// Function to add an item to the cart

function addItem(event) {
  event.preventDefault();
  const item = document.getElementById("itemName").value;
  const quantity = document.getElementById("itemQty").value;

  fetch("/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ item, quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showItems();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to remove an item from the cart

function removeItem(event) {
  event.preventDefault();
  const id = document.getElementById("itemId").value;

  fetch(`/cart/remove/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      showItems();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to show the cart items in a table

function showItems() {
  fetch("/cart/show")
    .then((response) => response.json())
    .then((data) => {
      const cartTable = document.getElementById("cartTable");

      // Clear the table body before adding new rows

      while (cartTable.rows.length > 0) {
        cartTable.deleteRow(0);
      }

      data.forEach((item) => {
        const newRow = cartTable.insertRow();

        // Add ID column

        const idCell = newRow.insertCell();
        idCell.textContent = item.id;

        // Add Item Name column

        const nameCell = newRow.insertCell();
        nameCell.textContent = item.item;

        // Add Item Quantity column

        const quantityCell = newRow.insertCell();
        quantityCell.textContent = item.quantity;
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
