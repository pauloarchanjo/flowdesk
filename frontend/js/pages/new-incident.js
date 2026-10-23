import {
  calculatePriority
} from "../utils/priority.js";


import {
  getSuggestedAssignmentGroup
} from "../utils/assignment.js";


import {
  getNextIncidentNumber,
  saveIncident
} from "../services/storageService.js";

import {
  queueToast
} from "../components/toast.js";


const form =
  document.querySelector(
    "#incident-form"
  );


const callerInput =
  document.querySelector(
    "#caller"
  );


const titleInput =
  document.querySelector(
    "#title"
  );


const descriptionInput =
  document.querySelector(
    "#description"
  );


const categorySelect =
  document.querySelector(
    "#category"
  );


const assignmentGroupSelect =
  document.querySelector(
    "#assignment-group"
  );


const impactSelect =
  document.querySelector(
    "#impact"
  );


const urgencySelect =
  document.querySelector(
    "#urgency"
  );


const priorityValue =
  document.querySelector(
    "#priority-value"
  );


function updatePriority() {
  const priority =
    calculatePriority(
      impactSelect.value,
      urgencySelect.value
    );


  priorityValue.textContent =
    priority || "—";


  priorityValue.classList.remove(
    "priority-p1",
    "priority-p2",
    "priority-p3",
    "priority-p4"
  );


  if (priority) {
    priorityValue.classList.add(
      `priority-${priority.toLowerCase()}`
    );
  }
}


function updateAssignmentGroup() {
  const suggestedGroup =
    getSuggestedAssignmentGroup(
      categorySelect.value
    );


  if (!suggestedGroup) {
    return;
  }


  assignmentGroupSelect.value =
    suggestedGroup;
}


function createIncident() {
  const now =
    new Date().toISOString();


  const priority =
    calculatePriority(
      impactSelect.value,
      urgencySelect.value
    );


  return {
    id:
      crypto.randomUUID(),

    number:
      getNextIncidentNumber(),

    caller:
      callerInput.value.trim(),

    title:
      titleInput.value.trim(),

    description:
      descriptionInput.value.trim(),

    category:
      categorySelect.value,

    impact:
      impactSelect.value,

    urgency:
      urgencySelect.value,

    priority,

    state:
      "New",

    group:
      assignmentGroupSelect.value,

    assignedTo:
      null,

    resolutionCode:
      null,

    resolutionNotes:
      null,

    resolvedBy:
      null,

    resolvedAt:
      null,

    createdAt:
      now,

    updatedAt:
      now,

    activity: [
      {
        id:
          crypto.randomUUID(),

        type:
          "created",

        message:
          "Incident created",

        author:
          "Administrator",

        createdAt:
          now
      }
    ]
  };
}


impactSelect.addEventListener(
  "change",
  updatePriority
);


urgencySelect.addEventListener(
  "change",
  updatePriority
);


categorySelect.addEventListener(
  "change",
  updateAssignmentGroup
);


form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();


    if (!form.checkValidity()) {
      form.reportValidity();

      return;
    }


    const incident =
      createIncident();


    if (!incident.priority) {
      return;
    }


    saveIncident(
      incident
    );

    queueToast({
      type:
        "success",

      title:
        "Incident created",

      message:
        `${incident.number} was created successfully.`
    });

    window.location.href =
      `./incident-details.html?id=${encodeURIComponent(
        incident.id
      )}`;
  }
);