(function () {
  "use strict";

  // Set this to your actual MyDesigns storefront URL.
  var MY_DESIGNS_STORE_URL = "";

  function wireStoreLinks() {
    var cta = document.getElementById("myDesignsCta");
    var navLink = document.getElementById("shopLink");

    if (!MY_DESIGNS_STORE_URL) {
      if (cta) {
        cta.textContent = "Store Link Coming Soon";
        cta.setAttribute("aria-disabled", "true");
        cta.removeAttribute("target");
      }
      return;
    }

    if (cta) {
      cta.href = MY_DESIGNS_STORE_URL;
    }
    if (navLink) {
      navLink.href = MY_DESIGNS_STORE_URL;
      navLink.target = "_blank";
      navLink.rel = "noopener noreferrer";
    }
  }

  wireStoreLinks();
})();