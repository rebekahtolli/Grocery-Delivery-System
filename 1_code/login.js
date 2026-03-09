function register(){

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

if(name === "" || email === "" || password === ""){
document.getElementById("message").innerText = "Please fill all fields";
return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];

let existingUser = users.find(user => user.email === email);

if(existingUser){
document.getElementById("message").innerText = "Email already registered";
return;
}

users.push({name,email,password});

localStorage.setItem("users",JSON.stringify(users));

document.getElementById("message").innerText =
"Account created! Go to login page.";

}

function login(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

let users = JSON.parse(localStorage.getItem("users")) || [];

let user = users.find(
u => u.email === email && u.password === password
);

if(user){

localStorage.setItem("loggedInUser",user.name);

window.location.href = "index.html";

}else{

document.getElementById("message").innerText =
"Invalid email or password";

}
}
