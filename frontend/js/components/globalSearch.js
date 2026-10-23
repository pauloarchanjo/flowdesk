import {
  getIncidents
} from "../services/storageService.js";


const MAX_RESULTS = 6;


function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}


function getIncidentDetailsUrl(
  incidentId
) {
  return new URL(
    `../../pages/incident-details.html?id=${encodeURIComponent(
      incidentId
    )}`,
    import.meta.url
  ).href;
}


function getSearchableText(
  incident
) {
  return normalize(
    [
      incident.number,
      incident.title,
      incident.caller,
      incident.category,
      incident.group,
      incident.assignedTo,
      incident.priority,
      incident.state
    ]
      .filter(Boolean)
      .join(" ")
  );
}


function calculateScore(
  incident,
  query
) {
  const normalizedQuery =
    normalize(query);


  const number =
    normalize(
      incident.number
    );


  const title =
    normalize(
      incident.title
    );


  const caller =
    normalize(
      incident.caller
    );


  const searchableText =
    getSearchableText(
      incident
    );


  if (
    number ===
    normalizedQuery
  ) {
    return 1000;
  }


  if (
    number.startsWith(
      normalizedQuery
    )
  ) {
    return 800;
  }


  if (
    title ===
    normalizedQuery
  ) {
    return 700;
  }


  if (
    title.startsWith(
      normalizedQuery
    )
  ) {
    return 600;
  }


  if (
    title.includes(
      normalizedQuery
    )
  ) {
    return 500;
  }


  if (
    caller.startsWith(
      normalizedQuery
    )
  ) {
    return 400;
  }


  if (
    searchableText.includes(
      normalizedQuery
    )
  ) {
    return 300;
  }


  return 0;
}


function searchIncidents(
  query
) {
  const normalizedQuery =
    normalize(query);


  if (!normalizedQuery) {
    return [];
  }


  const terms =
    normalizedQuery
      .split(/\s+/)
      .filter(Boolean);


  return getIncidents()
    .filter(
      (incident) => {

        const searchableText =
          getSearchableText(
            incident
          );


        return terms.every(
          (term) =>
            searchableText.includes(
              term
            )
        );

      }
    )
    .map(
      (incident) => ({
        incident,

        score:
          calculateScore(
            incident,
            normalizedQuery
          )
      })
    )
    .sort(
      (
        firstResult,
        secondResult
      ) => {

        if (
          secondResult.score !==
          firstResult.score
        ) {
          return (
            secondResult.score -
            firstResult.score
          );
        }


        return (
          new Date(
            secondResult.incident.updatedAt
          ) -
          new Date(
            firstResult.incident.updatedAt
          )
        );

      }
    )
    .slice(
      0,
      MAX_RESULTS
    )
    .map(
      (result) =>
        result.incident
    );
}


export function initializeGlobalSearch() {
  const searchContainer =
    document.querySelector(
      ".topbar .search"
    );


  const searchInput =
    searchContainer?.querySelector(
      "input"
    );


  if (
    !searchContainer ||
    !searchInput
  ) {
    return;
  }


  /*
      Prevent duplicate initialization
      if app.js is evaluated again.
  */

  if (
    searchContainer.dataset
      .globalSearchInitialized ===
    "true"
  ) {
    return;
  }


  searchContainer.dataset
    .globalSearchInitialized =
    "true";


  searchInput.autocomplete =
    "off";


  searchInput.setAttribute(
    "role",
    "combobox"
  );


  searchInput.setAttribute(
    "aria-autocomplete",
    "list"
  );


  searchInput.setAttribute(
    "aria-expanded",
    "false"
  );


  const resultsPanel =
    document.createElement(
      "div"
    );


  resultsPanel.id =
    "global-search-results";


  resultsPanel.className =
    "global-search-results";


  resultsPanel.hidden =
    true;


  resultsPanel.setAttribute(
    "role",
    "listbox"
  );


  searchInput.setAttribute(
    "aria-controls",
    resultsPanel.id
  );


  searchContainer.appendChild(
    resultsPanel
  );


  let currentResults =
    [];


  let activeIndex =
    -1;


  function closeSearch() {
    resultsPanel.hidden =
      true;


    activeIndex =
      -1;


    searchInput.setAttribute(
      "aria-expanded",
      "false"
    );


    searchInput.removeAttribute(
      "aria-activedescendant"
    );
  }


  function openSearch() {
    resultsPanel.hidden =
      false;


    searchInput.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  function updateActiveResult() {
    const resultItems =
      resultsPanel.querySelectorAll(
        ".global-search-result"
      );


    resultItems.forEach(
      (
        resultItem,
        index
      ) => {

        const isActive =
          index ===
          activeIndex;


        resultItem.classList.toggle(
          "active",
          isActive
        );


        resultItem.setAttribute(
          "aria-selected",
          String(
            isActive
          )
        );

      }
    );


    if (
      activeIndex >= 0 &&
      resultItems[activeIndex]
    ) {
      const activeResult =
        resultItems[
        activeIndex
        ];


      searchInput.setAttribute(
        "aria-activedescendant",
        activeResult.id
      );


      activeResult.scrollIntoView({
        block:
          "nearest"
      });

    } else {
      searchInput.removeAttribute(
        "aria-activedescendant"
      );
    }
  }


  function openIncident(
    incident
  ) {
    if (!incident?.id) {
      return;
    }


    window.location.href =
      getIncidentDetailsUrl(
        incident.id
      );
  }


  function renderEmptyState(
    message
  ) {
    resultsPanel.innerHTML =
      "";


    const emptyState =
      document.createElement(
        "div"
      );


    emptyState.className =
      "global-search-empty";


    emptyState.textContent =
      message;


    resultsPanel.appendChild(
      emptyState
    );


    openSearch();
  }


  function renderResults(
    results
  ) {
    resultsPanel.innerHTML =
      "";


    activeIndex =
      -1;


    if (
      results.length === 0
    ) {
      renderEmptyState(
        "No incidents found."
      );

      return;
    }


    results.forEach(
      (
        incident,
        index
      ) => {

        const result =
          document.createElement(
            "button"
          );


        result.type =
          "button";


        result.id =
          `global-search-result-${index}`;


        result.className =
          "global-search-result";


        result.setAttribute(
          "role",
          "option"
        );


        result.setAttribute(
          "aria-selected",
          "false"
        );


        const header =
          document.createElement(
            "div"
          );


        header.className =
          "global-search-result-header";


        const number =
          document.createElement(
            "span"
          );


        number.className =
          "global-search-number";


        number.textContent =
          incident.number ??
          "—";


        const status =
          document.createElement(
            "span"
          );


        status.className =
          "global-search-status";


        status.textContent =
          [
            incident.priority,
            incident.state
          ]
            .filter(Boolean)
            .join(" · ");


        header.append(
          number,
          status
        );


        const title =
          document.createElement(
            "span"
          );


        title.className =
          "global-search-title";


        title.textContent =
          incident.title ??
          "Untitled incident";


        const metadata =
          document.createElement(
            "span"
          );


        metadata.className =
          "global-search-metadata";


        metadata.textContent =
          [
            incident.group,
            incident.caller
          ]
            .filter(Boolean)
            .join(" · ");


        result.append(
          header,
          title,
          metadata
        );


        result.addEventListener(
          "mouseenter",
          () => {

            activeIndex =
              index;


            updateActiveResult();

          }
        );


        result.addEventListener(
          "click",
          () => {

            openIncident(
              incident
            );

          }
        );


        resultsPanel.appendChild(
          result
        );

      }
    );


    openSearch();
  }


  function performSearch() {
    const query =
      searchInput.value.trim();


    if (!query) {
      currentResults =
        [];


      closeSearch();

      return;
    }


    currentResults =
      searchIncidents(
        query
      );


    renderResults(
      currentResults
    );
  }


  searchInput.addEventListener(
    "input",
    performSearch
  );


  searchInput.addEventListener(
    "focus",
    () => {

      if (
        searchInput.value.trim()
      ) {
        performSearch();
      }

    }
  );


  searchInput.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Escape"
      ) {
        closeSearch();

        searchInput.blur();

        return;
      }


      if (
        resultsPanel.hidden ||
        currentResults.length ===
        0
      ) {
        return;
      }


      if (
        event.key ===
        "ArrowDown"
      ) {
        event.preventDefault();


        activeIndex =
          activeIndex <
            currentResults.length -
            1
            ? activeIndex + 1
            : 0;


        updateActiveResult();

        return;
      }


      if (
        event.key ===
        "ArrowUp"
      ) {
        event.preventDefault();


        activeIndex =
          activeIndex > 0
            ? activeIndex - 1
            : currentResults.length -
            1;


        updateActiveResult();

        return;
      }


      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();


        const selectedIndex =
          activeIndex >= 0
            ? activeIndex
            : 0;


        const incident =
          currentResults[
          selectedIndex
          ];


        if (incident) {
          openIncident(
            incident
          );
        }
      }

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (
        !searchContainer.contains(
          event.target
        )
      ) {
        closeSearch();
      }

    }
  );


  window.addEventListener(
    "storage",
    () => {

      if (
        searchInput.value.trim()
      ) {
        performSearch();
      }

    }
  );
}