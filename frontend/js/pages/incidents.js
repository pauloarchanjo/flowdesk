import {
  getIncidents
} from "../services/storageService.js";


const tableBody =
  document.querySelector(
    "#incident-table-body"
  );


const searchInput =
  document.querySelector(
    "#incident-search"
  );


const stateFilter =
  document.querySelector(
    "#state-filter"
  );


const priorityFilter =
  document.querySelector(
    "#priority-filter"
  );


const groupFilter =
  document.querySelector(
    "#group-filter"
  );


const clearFiltersButton =
  document.querySelector(
    "#clear-filters"
  );


const resultCount =
  document.querySelector(
    "#result-count"
  );


function normalize(value) {

  return String(value ?? "")
    .toLowerCase()
    .trim();

}


function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function formatDate(date) {

  if (!date) {

    return "—";

  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return "—";

  }


  return new Intl.DateTimeFormat(
    "en",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(parsedDate);

}


function getStateClass(state) {

  return normalize(state)
    .replaceAll(" ", "-");

}


function openIncident(
  incidentId
) {

  window.location.href =
    `./incident-details.html?id=${encodeURIComponent(
      incidentId
    )}`;

}


function populateAssignmentGroups() {

  const incidents =
    getIncidents();


  const groups = [
    ...new Set(
      incidents
        .map(
          (incident) =>
            incident.group
        )
        .filter(Boolean)
    )
  ].sort();


  groupFilter.innerHTML = `
        <option value="">
            All groups
        </option>
    `;


  groups.forEach((group) => {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      group;


    option.textContent =
      group;


    groupFilter.appendChild(
      option
    );

  });

}


function getFilteredIncidents() {

  const incidents =
    getIncidents();


  const query =
    normalize(
      searchInput.value
    );


  const selectedState =
    stateFilter.value;


  const selectedPriority =
    priorityFilter.value;


  const selectedGroup =
    groupFilter.value;


  return incidents
    .filter((incident) => {

      const searchableContent =
        normalize(
          [
            incident.number,
            incident.title,
            incident.caller,
            incident.group,
            incident.category
          ].join(" ")
        );


      const matchesSearch =
        !query ||
        searchableContent.includes(
          query
        );


      const matchesState =
        !selectedState ||
        incident.state ===
        selectedState;


      const matchesPriority =
        !selectedPriority ||
        incident.priority ===
        selectedPriority;


      const matchesGroup =
        !selectedGroup ||
        incident.group ===
        selectedGroup;


      return (
        matchesSearch &&
        matchesState &&
        matchesPriority &&
        matchesGroup
      );

    })
    .sort(
      (
        firstIncident,
        secondIncident
      ) => {

        return (
          new Date(
            secondIncident.updatedAt
          ) -
          new Date(
            firstIncident.updatedAt
          )
        );

      }
    );

}


function renderEmptyState() {

  tableBody.innerHTML = `
        <tr>
            <td
                colspan="7"
                class="empty-state"
            >
                No incidents match the selected filters.
            </td>
        </tr>
    `;

}


function renderIncidents() {

  const incidents =
    getFilteredIncidents();


  resultCount.textContent =
    `${incidents.length} ${incidents.length === 1
      ? "incident"
      : "incidents"
    }`;


  tableBody.innerHTML = "";


  if (!incidents.length) {

    renderEmptyState();

    return;

  }


  incidents.forEach(
    (incident) => {

      const row =
        document.createElement(
          "tr"
        );


      const stateClass =
        getStateClass(
          incident.state
        );


      const priorityClass =
        normalize(
          incident.priority
        );


      row.dataset.incidentId =
        incident.id;


      row.tabIndex = 0;


      row.setAttribute(
        "role",
        "link"
      );


      row.setAttribute(
        "aria-label",
        `Open ${incident.number}: ${incident.title}`
      );


      row.innerHTML = `
                <td class="incident-number">
                    ${escapeHtml(
        incident.number
      )}
                </td>

                <td class="incident-title">
                    ${escapeHtml(
        incident.title
      )}
                </td>

                <td class="incident-caller">
                    ${escapeHtml(
        incident.caller
      )}
                </td>

                <td>
                    <span
                        class="badge badge-${escapeHtml(
        priorityClass
      )}"
                    >
                        ${escapeHtml(
        incident.priority
      )}
                    </span>
                </td>

                <td>
                    <span
                        class="state-label state-${escapeHtml(
        stateClass
      )}"
                    >
                        <span
                            class="state-dot"
                        ></span>

                        ${escapeHtml(
        incident.state
      )}
                    </span>
                </td>

                <td class="incident-group">
                    ${escapeHtml(
        incident.group
      )}
                </td>

                <td class="incident-date">
                    ${formatDate(
        incident.updatedAt
      )}
                </td>
            `;


      row.addEventListener(
        "click",
        () => {

          openIncident(
            incident.id
          );

        }
      );


      row.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();


            openIncident(
              incident.id
            );

          }

        }
      );


      tableBody.appendChild(
        row
      );

    }
  );

}


function clearFilters() {

  searchInput.value =
    "";


  stateFilter.value =
    "";


  priorityFilter.value =
    "";


  groupFilter.value =
    "";


  renderIncidents();


  searchInput.focus();

}


searchInput.addEventListener(
  "input",
  renderIncidents
);


stateFilter.addEventListener(
  "change",
  renderIncidents
);


priorityFilter.addEventListener(
  "change",
  renderIncidents
);


groupFilter.addEventListener(
  "change",
  renderIncidents
);


clearFiltersButton.addEventListener(
  "click",
  clearFilters
);


populateAssignmentGroups();

renderIncidents();