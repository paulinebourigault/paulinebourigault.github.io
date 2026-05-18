(function () {
  document.documentElement.setAttribute("data-theme", "light");
  document.documentElement.setAttribute("data-theme-setting", "light");

  if (typeof Storage !== "undefined") {
    localStorage.setItem("theme", "light");
    localStorage.setItem("themeSetting", "light");
  }

  if (window.setThemeSetting) {
    window.setThemeSetting = function () {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.setAttribute("data-theme-setting", "light");
      if (typeof Storage !== "undefined") {
        localStorage.setItem("theme", "light");
        localStorage.setItem("themeSetting", "light");
      }
    };
  }

  if (window.initTheme) {
    window.initTheme = function () {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.setAttribute("data-theme-setting", "light");
    };
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes" && (mutation.attributeName === "data-theme" || mutation.attributeName === "data-theme-setting")) {
        const theme = document.documentElement.getAttribute("data-theme");
        if (theme !== "light") {
          document.documentElement.setAttribute("data-theme", "light");
          document.documentElement.setAttribute("data-theme-setting", "light");
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-theme-setting"],
  });
})();
