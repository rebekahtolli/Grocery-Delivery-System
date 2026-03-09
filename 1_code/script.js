// Check login
let user = localStorage.getItem("loggedInUser");
if(!user){
  window.location.href = "login.html";
}
document.getElementById("welcomeUser").innerText = "Welcome, " + user;

function logout(){
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Products
let products = [
  {name:"Orange Juice", price:4},
  {name:"Yogurt", price:3},
  {name:"Milk", price:3},
  {name:"Bread", price:2},
  {name:"Eggs", price:4},
  {name:"Cheese", price:5},
  {name:"Chicken Breast", price:7},
  {name:"Ground Beef", price:6},
  {name:"Apples", price:2},
  {name:"Bananas", price:1},
  {name:"Strawberries", price:4},
  {name:"Blueberries", price:5},
  {name:"Lettuce", price:2},
  {name:"Tomatoes", price:3},
  {name:"Potatoes", price:3},
  {name:"Onions", price:2},
  {name:"Pasta", price:2},
  {name:"Rice", price:3},
  {name:"Cereal", price:4},
  {name:"Granola", price:3},
  {name:"Peanut Butter", price:5}
];

let cart = [];

function displayProducts(){
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product,index)=>{
    let div = document.createElement("div");
    div.className="product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

function addToCart(index){
  cart.push(products[index]);
  updateCart();
}

function updateCart(){
  let cartList = document.getElementById("cart");
  cartList.innerHTML="";
  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price} 
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartList.appendChild(li);
    total += item.price;
  });

  document.getElementById("total").innerText = total;
}

function removeFromCart(index){
  cart.splice(index, 1);  // Remove the selected item
  updateCart();            // Refresh cart display
}

// Checkout functions
function checkout(){
  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }
  document.getElementById("checkoutForm").classList.remove("hidden");
}

function cancelCheckout(){
  document.getElementById("checkoutForm").classList.add("hidden");
}

function confirmCheckout(){
  let name = document.getElementById("customerName").value;
  let address = document.getElementById("customerAddress").value;
  let timeSlot = document.getElementById("deliveryTime").value;
  
  if(!name || !address){
    alert("Please fill all delivery details");
    return;
  }
  
  let summary = "<strong>Name:</strong> " + name + "<br>" +
                "<strong>Address:</strong> " + address + "<br>" +
                "<strong>Delivery Time:</strong> " + timeSlot + "<br>" +
                "<strong>Items:</strong><br>";
                
  cart.forEach(item=>{
    summary += item.name + " - $" + item.price + "<br>";
  });
  summary += "<strong>Total:</strong> $" + cart.reduce((sum,item)=>sum+item.price,0);
  
  document.getElementById("orderSummary").innerHTML = summary;
  document.getElementById("checkoutForm").classList.add("hidden");
  document.getElementById("orderConfirmation").classList.remove("hidden");
  
  cart = [];
  updateCart();
}

function closeConfirmation(){
  document.getElementById("orderConfirmation").classList.add("hidden");
}

displayProducts();
