/*---------------------------------------------
hamburger menu
---------------------------------------------*/
window.addEventListener("load", () => {
	const btn = document.querySelector(".menubtn");
	const nav = document.querySelector(".nav");

	btn.addEventListener("click", () => {
		btn.classList.toggle("menubtn--open");
		nav.classList.toggle("nav--active");
	});
});
