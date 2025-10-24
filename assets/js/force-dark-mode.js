// Force dark mode always - add this after theme.js loads
(function () {
  // Force dark mode immediately
  document.documentElement.setAttribute("data-theme", "dark");
  document.documentElement.setAttribute("data-theme-setting", "dark");

  // Store dark mode preference
  if (typeof Storage !== "undefined") {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("themeSetting", "dark");
  }

  // Override any theme functions to always return dark
  if (window.setThemeSetting) {
    window.setThemeSetting = function () {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.setAttribute("data-theme-setting", "dark");
      if (typeof Storage !== "undefined") {
        localStorage.setItem("theme", "dark");
        localStorage.setItem("themeSetting", "dark");
      }
    };
  }

  if (window.initTheme) {
    window.initTheme = function () {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.setAttribute("data-theme-setting", "dark");
    };
  }

  // Monitor for any theme changes and force back to dark
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes" && (mutation.attributeName === "data-theme" || mutation.attributeName === "data-theme-setting")) {
        const theme = document.documentElement.getAttribute("data-theme");
        if (theme !== "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.setAttribute("data-theme-setting", "dark");
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-theme-setting"],
  });
})();
