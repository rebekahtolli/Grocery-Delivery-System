document.addEventListener("DOMContentLoaded", function() {

  // AUTH
  let user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "login.html";
  document.getElementById("welcomeUser").innerText = "Welcome, " + user;

  // PRODUCTS
  let products = [
    {name:"Milk", price:3, category:"Dairy"},
    {name:"Cheese", price:5, category:"Dairy"},
    {name:"Yogurt", price:3, category:"Dairy"},
    {name:"Butter", price:4, category:"Dairy"},
    {name:"Eggs", price:4, category:"Dairy"},

    {name:"Chicken Breast", price:7, category:"Meat"},
    {name:"Ground Beef", price:6, category:"Meat"},
    {name:"Salmon", price:9, category:"Meat"},
    {name:"Turkey", price:6, category:"Meat"},
    {name:"Tofu", price:4, category:"Meat"},

    {name:"Apples", price:2, category:"Fruits"},
    {name:"Bananas", price:1, category:"Fruits"},
    {name:"Strawberries", price:4, category:"Fruits"},
    {name:"Blueberries", price:5, category:"Fruits"},
    {name:"Grapes", price:4, category:"Fruits"},
    {name:"Oranges", price:3, category:"Fruits"},

    {name:"Lettuce", price:2, category:"Vegetables"},
    {name:"Tomatoes", price:3, category:"Vegetables"},
    {name:"Potatoes", price:3, category:"Vegetables"},
    {name:"Onions", price:2, category:"Vegetables"},
    {name:"Carrots", price:2, category:"Vegetables"},
    {name:"Broccoli", price:3, category:"Vegetables"},

    {name:"Rice", price:3, category:"Pantry"},
    {name:"Pasta", price:2, category:"Pantry"},
    {name:"Cereal", price:4, category:"Pantry"},
    {name:"Granola", price:3, category:"Pantry"},
    {name:"Peanut Butter", price:5, category:"Pantry"},
    {name:"Bread", price:2, category:"Pantry"},

    {name:"Chips", price:3, category:"Snacks"},
    {name:"Cookies", price:4, category:"Snacks"},
    {name:"Crackers", price:3, category:"Snacks"},
    {name:"Popcorn", price:2, category:"Snacks"},

    {name:"Orange Juice", price:4, category:"Drinks"},
    {name:"Apple Juice", price:3, category:"Drinks"},
    {name:"Soda", price:2, category:"Drinks"},
    {name:"Coffee", price:6, category:"Drinks"},
    {name:"Tea", price:3, category:"Drinks"},

    {name:"Frozen Pizza", price:6, category:"Frozen"},
    {name:"Ice Cream", price:5, category:"Frozen"},
    {name:"Frozen Bell Peppers", price:5, category:"Frozen"},
    {name:"Frozen Stir Fry", price:6, category:"Frozen"},
    {name:"Frozen Broccoli", price:4, category:"Frozen"}
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  let currentCategory = "All";

  // DISPLAY PRODUCTS
  function displayProducts(list = products){
    let container = document.getElementById("product-list");
    container.innerHTML = "";

    list.forEach((p, i) => {
      container.innerHTML += `
        <div class="product">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="addToCart(${i})">Add</button>
        </div>`;
    });
  }

  // FILTERING
  window.filterCategory = function(event, category){
    currentCategory = category;

    let buttons = document.querySelectorAll("#categories button");
    buttons.forEach(btn => btn.classList.remove("active"));

    event.target.classList.add("active");

    applyFilters();
  }

  window.searchProducts = function(){
    applyFilters();
  }

  function applyFilters(){
    let query = document.getElementById("searchBar").value.toLowerCase();

    let filtered = products.filter(p => {
      let matchesSearch = p.name.toLowerCase().includes(query);
      let matchesCategory = currentCategory === "All" || p.category === currentCategory;
      return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
  }

  // CART
  window.addToCart = function(index){
    let item = products[index];
    let existing = cart.find(p => p.name === item.name);

    if(existing){
      existing.qty++;
    } else {
      cart.push({...item, qty:1});
    }

    saveCart();
  }

  window.changeQty = function(index, delta){
    cart[index].qty += delta;
    if(cart[index].qty <= 0) cart.splice(index,1);
    saveCart();
  }

  function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }

  function updateCart(){
    let list = document.getElementById("cart");
    list.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
      total += item.price * item.qty;
      list.innerHTML += `
        <li>
          ${item.name} (${item.qty}) - $${item.price * item.qty}
          <button onclick="changeQty(${i},1)">+</button>
          <button onclick="changeQty(${i},-1)">-</button>
        </li>`;
    });

    document.getElementById("total").innerText = total;
  }

  // CHECKOUT
  window.checkout = function(){
    if(cart.length === 0) return alert("Cart empty");
    document.getElementById("checkoutForm").classList.remove("hidden");
  }

  window.cancelCheckout = function(){
    document.getElementById("checkoutForm").classList.add("hidden");
  }

  window.confirmCheckout = function(){
    let name = document.getElementById("customerName").value;
    let address = document.getElementById("customerAddress").value;

    if(!name || !address) return alert("Fill all fields");

    let order = {
      items: [...cart],
      total: cart.reduce((sum,i)=>sum+i.price*i.qty,0),
      status: "Preparing"
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    simulateDelivery(order);

    cart = [];
    saveCart();

    document.getElementById("checkoutForm").classList.add("hidden");
    displayOrders();
  }

  // DELIVERY SIMULATION
  function simulateDelivery(order){
    setTimeout(()=>{order.status="Out for Delivery"; displayOrders();},3000);
    setTimeout(()=>{order.status="Delivered"; displayOrders();},6000);
  }

  // ORDER HISTORY
  function displayOrders(){
    let list = document.getElementById("orderHistory");
    list.innerHTML = "";

    orders.forEach(o => {
      list.innerHTML += `<li>Order - $${o.total} | Status: ${o.status}</li>`;
    });
  }

  // LOGOUT
  window.logout = function(){
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  }

  // INIT
  displayProducts();
  updateCart();
  displayOrders();

  // Set default active category
  document.querySelector("#categories button").classList.add("active");

});
