"use strict";

// To make the header/navbar sticky via javascript
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 0);
});

// get year for footer
let n = new Date();
let yearr = n.getFullYear();
document.getElementById("year").innerHTML = yearr;

// To make navbar appear when clicked on hamburger icon
let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
	menu.classList.toggle("bx-x");
	navbar.classList.toggle("open");
};


// alert("This is a demo site and not a commercial version. The site is available for sale. Please mail to nextlevelproduction@duck.com to purchase the site.");
