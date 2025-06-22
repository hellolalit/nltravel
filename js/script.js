"use strict";

// To make the header/navbar sticky via javascript
const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

// Sticky header
window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 0);
});

// Active navigation
window.addEventListener("scroll", () => {
	let current = "";
	sections.forEach(section => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.clientHeight;
		if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
			current = section.getAttribute("id");
		}
	});

	navLinks.forEach(link => {
		link.classList.remove("active");
		if (link.getAttribute("href").slice(1) === current) {
			link.classList.add("active");
		}
	});
});

// Smooth scrolling
navLinks.forEach(link => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		const targetId = link.getAttribute("href");
		const targetSection = document.querySelector(targetId);
		const headerHeight = header.offsetHeight;
		
		window.scrollTo({
			top: targetSection.offsetTop - headerHeight,
			behavior: "smooth"
		});
	});
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
