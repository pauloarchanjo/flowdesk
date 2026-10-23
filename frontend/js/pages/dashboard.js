import {
  getIncidents
} from "../services/storageService.js";


import {
  INCIDENT_STATES
} from "../utils/incidentLifecycle.js";


const openIncidentsElement =
  document.querySelector(
    "#metric-open"
  );


const highPriorityElement =
  document.querySelector(
    "#metric-high-priority"
  );


const inProgressElement =
  document.querySelector(
    "#metric-in-progress"
  );


const resolvedTodayElement =
  document.querySelector(
    "#metric-resolved-today"
  );


const recentIncidentsBody =
  document.querySelector(
    "#recent-incidents-body"
  );


/* =========================================================
   Helpers
   ========================================================= */


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


function getStateClass(state) {
  return normalize(state)
    .replaceAll(
      " ",
      "-"
    );
}


function isSameLocalDay(
  firstDate,
  secondDate
) {
  if (
    !firstDate ||
    !secondDate
  ) {
    return false;
  }


  const first =
    new Date(firstDate);


  const second =
    new Date(secondDate);


  if (
    Number.isNaN(
      first.getTime()
    ) ||
    Number.isNaN(
      second.getTime()
    )
  ) {
    return false;
  }


  return (
    first.getFullYear() ===
    second.getFullYear() &&

    first.getMonth() ===
    second.getMonth() &&

    first.getDate() ===
    second.getDate()
  );
}


function openIncident(
  incidentId
) {
  window.location.href =
    `./pages/incident-details.html?id=${encodeURIComponent(
      incidentId
    )}`;
}


/* =========================================================
   Metrics
   ========================================================= */


function calculateMetrics(
  incidents
) {
  const activeStates = [
    INCIDENT_STATES.NEW,
    INCIDENT_STATES.ASSIGNED,
    INCIDENT_STATES.IN_PROGRESS
  ];


  const openIncidents =
    incidents.filter(
      (incident) =>
        activeStates.includes(
          incident.state
        )
    );


  const criticalHigh =
    openIncidents.filter(
      (incident) =>
        incident.priority ===
        "P1" ||

        incident.priority ===
        "P2"
    );


  const inProgress =
    incidents.filter(
      (incident) =>
        incident.state ===
        INCIDENT_STATES.IN_PROGRESS
    );


  const now =
    new Date();


  const resolvedToday =
    incidents.filter(
      (incident) => {

        /*
            Current records use resolvedAt.

            The updatedAt fallback keeps older
            development seed data compatible.
        */

        if (
          incident.resolvedAt
        ) {
          return isSameLocalDay(
            incident.resolvedAt,
            now
          );
        }


        return (
          incident.state ===
          INCIDENT_STATES.RESOLVED &&

          isSameLocalDay(
            incident.updatedAt,
            now
          )
        );

      }
    );


  return {
    open:
      openIncidents.length,

    highPriority:
      criticalHigh.length,

    inProgress:
      inProgress.length,

    resolvedToday:
      resolvedToday.length
  };
}


function renderMetrics(
  incidents
) {
  const metrics =
    calculateMetrics(
      incidents
    );


  if (openIncidentsElement) {
    openIncidentsElement.textContent =
      metrics.open;
  }


  if (highPriorityElement) {
    highPriorityElement.textContent =
      metrics.highPriority;
  }


  if (inProgressElement) {
    inProgressElement.textContent =
      metrics.inProgress;
  }


  if (resolvedTodayElement) {
    resolvedTodayElement.textContent =
      metrics.resolvedToday;
  }
}


/* =========================================================
   Recent Incidents
   ========================================================= */


function getRecentIncidents(
  incidents,
  limit = 5
) {
  return [...incidents]
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
    )
    .slice(
      0,
      limit
    );
}


function renderEmptyState() {
  if (!recentIncidentsBody) {
    return;
  }


  recentIncidentsBody.innerHTML = `
        <tr>
            <td
                colspan="5"
                class="empty-state"
            >
                No incidents available.
            </td>
        </tr>
    `;
}


function renderRecentIncidents(
  incidents
) {
  if (!recentIncidentsBody) {
    return;
  }


  recentIncidentsBody.innerHTML =
    "";


  const recentIncidents =
    getRecentIncidents(
      incidents
    );


  if (
    recentIncidents.length === 0
  ) {
    renderEmptyState();

    return;
  }


  recentIncidents.forEach(
    (incident) => {

      const row =
        document.createElement(
          "tr"
        );


      const priorityClass =
        normalize(
          incident.priority
        );


      const stateClass =
        getStateClass(
          incident.state
        );


      row.dataset.incidentId =
        incident.id;


      row.tabIndex =
        0;


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
            event.key ===
            "Enter" ||

            event.key ===
            " "
          ) {
            event.preventDefault();


            openIncident(
              incident.id
            );
          }

        }
      );


      recentIncidentsBody.appendChild(
        row
      );

    }
  );
}


/* =========================================================
   Dashboard
   ========================================================= */


function renderDashboard() {
  const incidents =
    getIncidents();


  renderMetrics(
    incidents
  );


  renderRecentIncidents(
    incidents
  );
}


/*
    Re-render when returning through
    browser history / bfcache.
*/

window.addEventListener(
  "pageshow",
  renderDashboard
);


/*
    Also synchronizes the dashboard
    if localStorage changes in another tab.
*/

window.addEventListener(
  "storage",
  renderDashboard
);


renderDashboard();