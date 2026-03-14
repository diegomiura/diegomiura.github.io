(function () {
	const body = document.body;
	const navToggle = document.querySelector(".nav-toggle");
	const nav = document.getElementById("site-nav");
	const navLinks = nav ? nav.querySelectorAll("a") : [];
	const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
	const year = document.getElementById("year");

	body.classList.add("js-enabled");

	if (year) {
		year.textContent = String(new Date().getFullYear());
	}

	const closeNav = function () {
		body.classList.remove("nav-open");
		if (navToggle) {
			navToggle.setAttribute("aria-expanded", "false");
		}
	};

	if (navToggle && nav) {
		navToggle.addEventListener("click", function () {
			const isOpen = body.classList.toggle("nav-open");
			navToggle.setAttribute("aria-expanded", String(isOpen));
		});

		navLinks.forEach(function (link) {
			link.addEventListener("click", closeNav);
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape") {
				closeNav();
			}
		});
	}

	const reveal = function (element) {
		element.classList.add("is-visible");
	};

	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			function (entries, currentObserver) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						reveal(entry.target);
						currentObserver.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.18,
				rootMargin: "0px 0px -10% 0px"
			}
		);

		revealItems.forEach(function (item) {
			if (item.getBoundingClientRect().top < window.innerHeight * 0.88) {
				reveal(item);
				return;
			}

			observer.observe(item);
		});
	} else {
		revealItems.forEach(reveal);
	}

	window.addEventListener("load", function () {
		body.classList.remove("is-preload");
	});
})();
