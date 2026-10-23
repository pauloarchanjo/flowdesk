import {
  seedIncidents
} from "../data/incidents.js";


const STORAGE_KEY =
  "flowdesk.incidents";


const STORAGE_VERSION_KEY =
  "flowdesk.storageVersion";


const STORAGE_VERSION =
  "2";


function clone(value) {
  return structuredClone(value);
}


function initializeIncidents() {
  const initialIncidents =
    clone(seedIncidents);


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialIncidents)
  );


  localStorage.setItem(
    STORAGE_VERSION_KEY,
    STORAGE_VERSION
  );


  return initialIncidents;
}


export function getIncidents() {
  const currentVersion =
    localStorage.getItem(
      STORAGE_VERSION_KEY
    );


  if (
    currentVersion !==
    STORAGE_VERSION
  ) {
    return initializeIncidents();
  }


  const storedData =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!storedData) {
    return initializeIncidents();
  }


  try {
    const incidents =
      JSON.parse(storedData);


    if (!Array.isArray(incidents)) {
      return initializeIncidents();
    }


    return incidents;

  } catch (error) {

    console.error(
      "FlowDesk: unable to read incidents from storage.",
      error
    );


    return initializeIncidents();
  }
}


export function getIncidentById(id) {
  if (!id) {
    return null;
  }


  const incidents =
    getIncidents();


  return (
    incidents.find(
      (incident) =>
        String(incident.id) ===
        String(id)
    ) ?? null
  );
}


export function saveIncidents(incidents) {
  if (!Array.isArray(incidents)) {
    throw new TypeError(
      "FlowDesk: incidents must be an array."
    );
  }


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(incidents)
  );
}


export function saveIncident(incident) {
  const incidents =
    getIncidents();


  incidents.push(
    incident
  );


  saveIncidents(
    incidents
  );


  return incident;
}


export function updateIncident(
  id,
  changes
) {
  const incidents =
    getIncidents();


  const incidentIndex =
    incidents.findIndex(
      (incident) =>
        String(incident.id) ===
        String(id)
    );


  if (incidentIndex === -1) {
    return null;
  }


  const currentIncident =
    incidents[incidentIndex];


  const updatedIncident = {
    ...currentIncident,
    ...changes,

    id:
      currentIncident.id
  };


  incidents[incidentIndex] =
    updatedIncident;


  saveIncidents(
    incidents
  );


  return updatedIncident;
}


export function getNextIncidentNumber() {
  const incidents =
    getIncidents();


  const numbers =
    incidents
      .map((incident) => {

        const number =
          incident.number ?? "";


        return Number(
          number.replace(
            /\D/g,
            ""
          )
        );

      })
      .filter(
        Number.isFinite
      );


  const highestNumber =
    numbers.length
      ? Math.max(
        ...numbers
      )
      : 0;


  return `INC${String(
    highestNumber + 1
  ).padStart(4, "0")}`;
}