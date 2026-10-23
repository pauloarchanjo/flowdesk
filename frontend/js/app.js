import {
  consumeQueuedToast
} from "./components/toast.js";


import {
  initializeGlobalSearch
} from "./components/globalSearch.js";


function loadGlobalComponentStyles() {
  const stylesheetId =
    "flowdesk-components-css";


  if (
    document.getElementById(
      stylesheetId
    )
  ) {
    return;
  }


  const stylesheet =
    document.createElement(
      "link"
    );


  stylesheet.id =
    stylesheetId;


  stylesheet.rel =
    "stylesheet";


  stylesheet.href =
    new URL(
      "../css/components.css",
      import.meta.url
    ).href;


  document.head.appendChild(
    stylesheet
  );
}


function initializeNavigation() {
  const currentPage =
    document.body.dataset.page;


  const navigationItems =
    document.querySelectorAll(
      "[data-page]"
    );


  navigationItems.forEach(
    (item) => {

      const isCurrentPage =
        item.dataset.page ===
        currentPage;


      item.classList.toggle(
        "active",
        isCurrentPage
      );


      if (isCurrentPage) {
        item.setAttribute(
          "aria-current",
          "page"
        );

      } else {
        item.removeAttribute(
          "aria-current"
        );
      }

    }
  );
}


loadGlobalComponentStyles();

initializeNavigation();

initializeGlobalSearch();

consumeQueuedToast();