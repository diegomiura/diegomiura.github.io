(function () {
	const root = document.documentElement;
	const body = document.body;
	const navToggle = document.querySelector(".nav-toggle");
	const nav = document.getElementById("site-nav");
	const navLinks = nav ? nav.querySelectorAll("a") : [];
	const themeToggle = document.querySelector(".theme-toggle");
	const themeToggleIcon = themeToggle
		? themeToggle.querySelector(".theme-toggle__icon")
		: null;
	const year = document.getElementById("year");
	const storageKey = "theme";

	if (year) {
		year.textContent = String(new Date().getFullYear());
	}

	const getSystemTheme = function () {
		return window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const getStoredTheme = function () {
		try {
			const storedTheme = localStorage.getItem(storageKey);
			return storedTheme === "dark" || storedTheme === "light"
				? storedTheme
				: null;
		} catch (error) {
			return null;
		}
	};

	const updateThemeControl = function (theme) {
		if (!themeToggle) {
			return;
		}

		const nextTheme = theme === "dark" ? "light" : "dark";
		if (themeToggleIcon) {
			themeToggleIcon.textContent = nextTheme === "dark" ? "☾" : "☀";
		}
		themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
		themeToggle.setAttribute(
			"aria-label",
			nextTheme === "dark" ? "Switch to dark theme" : "Switch to light theme"
		);
	};

	const setTheme = function (theme, shouldStore) {
		root.setAttribute("data-theme", theme);
		updateThemeControl(theme);

		if (shouldStore) {
			try {
				localStorage.setItem(storageKey, theme);
			} catch (error) {
				// Persisting the theme is optional.
			}
		}
	};

	setTheme(root.getAttribute("data-theme") || getStoredTheme() || getSystemTheme(), false);

	if (themeToggle) {
		themeToggle.addEventListener("click", function () {
			const currentTheme = root.getAttribute("data-theme") === "dark"
				? "dark"
				: "light";
			setTheme(currentTheme === "dark" ? "light" : "dark", true);
		});
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
})();
