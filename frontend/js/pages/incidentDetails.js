import {
  getIncidentById,
  updateIncident
} from "../services/storageService.js";


import {
  calculatePriority
} from "../utils/priority.js";


import {
  getAgentsForGroup,
  getSuggestedAssignmentGroup
} from "../utils/assignment.js";


import {
  INCIDENT_STATES,
  getLifecycleActions,
  canTransition
} from "../utils/incidentLifecycle.js";

import {
  showToast
} from "../components/toast.js";

const CURRENT_USER =
  "Administrator";


const params =
  new URLSearchParams(
    window.location.search
  );


const incidentId =
  params.get("id");


let currentIncident =
  null;


/* =========================================================
   Incident elements
   ========================================================= */


const incidentContent =
  document.querySelector(
    "#incident-content"
  );


const incidentError =
  document.querySelector(
    "#incident-error"
  );


const numberElement =
  document.querySelector(
    "#incident-number"
  );


const titleElement =
  document.querySelector(
    "#incident-title"
  );


const priorityElement =
  document.querySelector(
    "#incident-priority"
  );


const stateElement =
  document.querySelector(
    "#incident-state"
  );


const stateTextElement =
  document.querySelector(
    "#incident-state-text"
  );


const updatedElement =
  document.querySelector(
    "#incident-updated"
  );


const descriptionElement =
  document.querySelector(
    "#incident-description"
  );


const callerElement =
  document.querySelector(
    "#incident-caller"
  );


const categoryElement =
  document.querySelector(
    "#incident-category"
  );


const groupElement =
  document.querySelector(
    "#incident-group"
  );


const assignedToElement =
  document.querySelector(
    "#incident-assigned-to"
  );


const impactElement =
  document.querySelector(
    "#incident-impact"
  );


const urgencyElement =
  document.querySelector(
    "#incident-urgency"
  );


const createdElement =
  document.querySelector(
    "#incident-created"
  );


const updatedFieldElement =
  document.querySelector(
    "#incident-updated-field"
  );


const activityElement =
  document.querySelector(
    "#incident-activity"
  );


/* =========================================================
   Resolution Information
   ========================================================= */


const resolutionPanel =
  document.querySelector(
    "#resolution-panel"
  );


const resolutionCodeElement =
  document.querySelector(
    "#resolution-code"
  );


const resolutionNotesElement =
  document.querySelector(
    "#resolution-notes"
  );


const resolvedByElement =
  document.querySelector(
    "#resolved-by"
  );


const resolvedAtElement =
  document.querySelector(
    "#resolved-at"
  );


/* =========================================================
   Lifecycle
   ========================================================= */


const lifecycleStateElement =
  document.querySelector(
    "#lifecycle-current-state"
  );


const lifecycleStateTextElement =
  document.querySelector(
    "#lifecycle-current-state-text"
  );


const lifecycleActionsElement =
  document.querySelector(
    "#lifecycle-actions"
  );


const lifecycleMessageElement =
  document.querySelector(
    "#lifecycle-message"
  );


/* =========================================================
   Work Notes
   ========================================================= */


const workNoteForm =
  document.querySelector(
    "#work-note-form"
  );


const workNoteInput =
  document.querySelector(
    "#work-note"
  );


const workNoteSubmit =
  document.querySelector(
    "#work-note-submit"
  );


const workNoteHelper =
  document.querySelector(
    "#work-note-helper"
  );


/* =========================================================
   Edit Incident
   ========================================================= */


const editIncidentButton =
  document.querySelector(
    "#edit-incident-button"
  );


const editDialog =
  document.querySelector(
    "#edit-incident-dialog"
  );


const editForm =
  document.querySelector(
    "#edit-incident-form"
  );


const editDialogClose =
  document.querySelector(
    "#edit-dialog-close"
  );


const editDialogCancel =
  document.querySelector(
    "#edit-dialog-cancel"
  );


const editCategory =
  document.querySelector(
    "#edit-category"
  );


const editAssignmentGroup =
  document.querySelector(
    "#edit-assignment-group"
  );


const editAssignedTo =
  document.querySelector(
    "#edit-assigned-to"
  );


const editImpact =
  document.querySelector(
    "#edit-impact"
  );


const editUrgency =
  document.querySelector(
    "#edit-urgency"
  );


const editPriorityValue =
  document.querySelector(
    "#edit-priority-value"
  );


const editFormFeedback =
  document.querySelector(
    "#edit-form-feedback"
  );


/* =========================================================
   Resolution Dialog
   ========================================================= */


const resolutionDialog =
  document.querySelector(
    "#resolution-dialog"
  );


const resolutionForm =
  document.querySelector(
    "#resolution-form"
  );


const resolutionDialogClose =
  document.querySelector(
    "#resolution-dialog-close"
  );


const resolutionDialogCancel =
  document.querySelector(
    "#resolution-dialog-cancel"
  );


const resolutionCodeInput =
  document.querySelector(
    "#resolution-code-input"
  );


const resolutionNotesInput =
  document.querySelector(
    "#resolution-notes-input"
  );


/* =========================================================
   Helpers
   ========================================================= */


function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}


function formatDateTime(value) {
  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    "en",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}


function getStateClass(state) {
  return normalize(state)
    .replaceAll(
      " ",
      "-"
    );
}


function createActivity({
  type,
  message,
  details = null,
  createdAt = new Date().toISOString()
}) {
  return {
    id:
      crypto.randomUUID(),

    type,

    message,

    details,

    author:
      CURRENT_USER,

    createdAt
  };
}


/* =========================================================
   Activity
   ========================================================= */


function renderActivity(
  activity = []
) {
  if (!activityElement) {
    return;
  }


  activityElement.innerHTML =
    "";


  if (
    !Array.isArray(activity) ||
    activity.length === 0
  ) {
    const emptyState =
      document.createElement(
        "p"
      );


    emptyState.className =
      "activity-empty";


    emptyState.textContent =
      "No activity recorded.";


    activityElement.appendChild(
      emptyState
    );


    return;
  }


  const sortedActivity =
    [...activity].sort(
      (
        firstItem,
        secondItem
      ) => {

        return (
          new Date(
            secondItem.createdAt
          ) -
          new Date(
            firstItem.createdAt
          )
        );

      }
    );


  sortedActivity.forEach(
    (activityItem) => {

      const item =
        document.createElement(
          "article"
        );


      item.className =
        "activity-item";


      const marker =
        document.createElement(
          "div"
        );


      marker.className =
        "activity-marker";


      if (
        activityItem.type ===
        "workNote"
      ) {
        marker.classList.add(
          "activity-marker-note"
        );
      }


      if (
        activityItem.type ===
        "resolution"
      ) {
        marker.classList.add(
          "activity-marker-resolution"
        );
      }


      const content =
        document.createElement(
          "div"
        );


      content.className =
        "activity-content";


      const message =
        document.createElement(
          "p"
        );


      message.className =
        "activity-message";


      message.textContent =
        activityItem.message ??
        "Incident updated";


      content.appendChild(
        message
      );


      if (
        activityItem.details
      ) {
        const details =
          document.createElement(
            "p"
          );


        details.className =
          "activity-details";


        details.textContent =
          activityItem.details;


        content.appendChild(
          details
        );
      }


      const metadata =
        document.createElement(
          "p"
        );


      metadata.className =
        "activity-metadata";


      metadata.textContent =
        `${activityItem.author ??
        "System"
        } · ${formatDateTime(
          activityItem.createdAt
        )}`;


      content.appendChild(
        metadata
      );


      item.append(
        marker,
        content
      );


      activityElement.appendChild(
        item
      );

    }
  );
}


/* =========================================================
   Resolution Information
   ========================================================= */


function renderResolutionInformation(
  incident
) {
  if (!resolutionPanel) {
    return;
  }


  const hasResolutionState =
    incident.state ===
    INCIDENT_STATES.RESOLVED ||
    incident.state ===
    INCIDENT_STATES.CLOSED;


  if (!hasResolutionState) {
    resolutionPanel.hidden =
      true;

    return;
  }


  resolutionPanel.hidden =
    false;


  if (resolutionCodeElement) {
    resolutionCodeElement.textContent =
      incident.resolutionCode ||
      "—";
  }


  if (resolutionNotesElement) {
    resolutionNotesElement.textContent =
      incident.resolutionNotes ||
      "No resolution notes recorded.";
  }


  if (resolvedByElement) {
    resolvedByElement.textContent =
      incident.resolvedBy ||
      "—";
  }


  if (resolvedAtElement) {
    resolvedAtElement.textContent =
      formatDateTime(
        incident.resolvedAt
      );
  }
}


/* =========================================================
   Lifecycle
   ========================================================= */


function renderLifecycle(
  incident
) {
  if (
    !lifecycleStateElement ||
    !lifecycleStateTextElement ||
    !lifecycleActionsElement
  ) {
    return;
  }


  const stateClass =
    getStateClass(
      incident.state
    );


  lifecycleStateElement.className =
    `state-label state-${stateClass}`;


  lifecycleStateTextElement.textContent =
    incident.state ??
    "—";


  lifecycleActionsElement.innerHTML =
    "";


  if (
    lifecycleMessageElement
  ) {
    lifecycleMessageElement.hidden =
      true;
  }


  const actions =
    getLifecycleActions(
      incident.state
    );


  if (!actions.length) {
    if (
      lifecycleMessageElement
    ) {
      lifecycleMessageElement.textContent =
        incident.state ===
          INCIDENT_STATES.CLOSED
          ? "This incident is closed. No further lifecycle actions are available."
          : "No lifecycle actions are available.";


      lifecycleMessageElement.hidden =
        false;
    }


    return;
  }


  actions.forEach(
    (action) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.textContent =
        action.label;


      button.className =
        action.variant ===
          "primary"
          ? "button lifecycle-button"
          : "button-secondary lifecycle-button";


      button.addEventListener(
        "click",
        () => {

          if (
            action.action ===
            "resolve"
          ) {
            openResolutionDialog();

            return;
          }


          transitionIncident(
            action.targetState,
            action.action
          );

        }
      );


      lifecycleActionsElement.appendChild(
        button
      );

    }
  );
}


/* =========================================================
   Work Notes
   ========================================================= */


function renderWorkNoteState(
  incident
) {
  if (
    !workNoteInput ||
    !workNoteSubmit
  ) {
    return;
  }


  const isClosed =
    incident.state ===
    INCIDENT_STATES.CLOSED;


  workNoteInput.disabled =
    isClosed;


  workNoteSubmit.disabled =
    isClosed;


  if (isClosed) {
    workNoteInput.placeholder =
      "Closed incidents are read-only.";


    if (workNoteHelper) {
      workNoteHelper.textContent =
        "Closed incidents cannot receive new work notes.";
    }

  } else {
    workNoteInput.placeholder =
      "Add troubleshooting details, investigation notes or internal updates...";


    if (workNoteHelper) {
      workNoteHelper.textContent =
        "Work notes are visible to service desk agents.";
    }
  }
}


/* =========================================================
   Edit State
   ========================================================= */


function renderEditState(
  incident
) {
  if (!editIncidentButton) {
    return;
  }


  const isClosed =
    incident.state ===
    INCIDENT_STATES.CLOSED;


  editIncidentButton.disabled =
    isClosed;


  editIncidentButton.title =
    isClosed
      ? "Closed incidents are read-only."
      : "Edit incident";
}


/* =========================================================
   Main Incident Rendering
   ========================================================= */


function renderIncident(
  incident
) {
  currentIncident =
    incident;


  document.title =
    `${incident.number} · FlowDesk`;


  if (numberElement) {
    numberElement.textContent =
      incident.number ??
      "—";
  }


  if (titleElement) {
    titleElement.textContent =
      incident.title ??
      "Untitled incident";
  }


  if (priorityElement) {
    priorityElement.textContent =
      incident.priority ??
      "—";


    priorityElement.className =
      "badge";


    if (
      incident.priority
    ) {
      priorityElement.classList.add(
        `badge-${normalize(
          incident.priority
        )}`
      );
    }
  }


  const stateClass =
    getStateClass(
      incident.state
    );


  if (stateElement) {
    stateElement.className =
      `state-label state-${stateClass}`;
  }


  if (stateTextElement) {
    stateTextElement.textContent =
      incident.state ??
      "—";
  }


  if (updatedElement) {
    updatedElement.textContent =
      formatDateTime(
        incident.updatedAt
      );
  }


  if (descriptionElement) {
    descriptionElement.textContent =
      incident.description?.trim() ||
      "No description provided.";
  }


  if (callerElement) {
    callerElement.textContent =
      incident.caller ||
      "—";
  }


  if (categoryElement) {
    categoryElement.textContent =
      incident.category ||
      "—";
  }


  if (groupElement) {
    groupElement.textContent =
      incident.group ||
      "—";
  }


  if (assignedToElement) {
    assignedToElement.textContent =
      incident.assignedTo ||
      "Unassigned";
  }


  if (impactElement) {
    impactElement.textContent =
      incident.impact ||
      "—";
  }


  if (urgencyElement) {
    urgencyElement.textContent =
      incident.urgency ||
      "—";
  }


  if (createdElement) {
    createdElement.textContent =
      formatDateTime(
        incident.createdAt
      );
  }


  if (updatedFieldElement) {
    updatedFieldElement.textContent =
      formatDateTime(
        incident.updatedAt
      );
  }


  renderResolutionInformation(
    incident
  );


  renderLifecycle(
    incident
  );


  renderWorkNoteState(
    incident
  );


  renderEditState(
    incident
  );


  renderActivity(
    incident.activity
  );
}


/* =========================================================
   Resolution Dialog
   ========================================================= */


function openResolutionDialog() {
  if (
    !currentIncident ||
    !resolutionDialog ||
    currentIncident.state !==
    INCIDENT_STATES.IN_PROGRESS
  ) {
    return;
  }


  if (
    resolutionCodeInput
  ) {
    resolutionCodeInput.value =
      "";
  }


  if (
    resolutionNotesInput
  ) {
    resolutionNotesInput.value =
      "";
  }


  resolutionDialog.showModal();
}


function closeResolutionDialog() {
  if (
    resolutionDialog?.open
  ) {
    resolutionDialog.close();
  }
}


function resolveIncident() {
  if (
    !currentIncident ||
    currentIncident.state !==
    INCIDENT_STATES.IN_PROGRESS ||
    !resolutionCodeInput ||
    !resolutionNotesInput
  ) {
    return;
  }


  const resolutionCode =
    resolutionCodeInput.value;


  const resolutionNotes =
    resolutionNotesInput.value.trim();


  if (
    !resolutionCode ||
    !resolutionNotes
  ) {
    return;
  }


  const now =
    new Date().toISOString();


  const activity =
    Array.isArray(
      currentIncident.activity
    )
      ? [...currentIncident.activity]
      : [];


  activity.push(
    createActivity({
      type:
        "resolution",

      message:
        `Incident resolved — ${resolutionCode}`,

      details:
        resolutionNotes,

      createdAt:
        now
    })
  );


  const updatedIncident =
    updateIncident(
      currentIncident.id,
      {
        state:
          INCIDENT_STATES.RESOLVED,

        resolutionCode,

        resolutionNotes,

        resolvedBy:
          CURRENT_USER,

        resolvedAt:
          now,

        updatedAt:
          now,

        activity
      }
    );


  if (!updatedIncident) {
    return;
  }


  closeResolutionDialog();

  renderIncident(
    updatedIncident
  );

  showToast({
    type:
      "success",

    title:
      "Changes saved",

    message:
      `${updatedIncident.number} was updated successfully.`
  });
}


/* =========================================================
   Edit Incident
   ========================================================= */


function populateAssignedTo(
  group,
  selectedAgent = ""
) {
  if (!editAssignedTo) {
    return;
  }


  const agents =
    getAgentsForGroup(
      group
    );


  editAssignedTo.innerHTML =
    `<option value="">Unassigned</option>`;


  agents.forEach(
    (agent) => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        agent;


      option.textContent =
        agent;


      editAssignedTo.appendChild(
        option
      );

    }
  );


  editAssignedTo.value =
    agents.includes(
      selectedAgent
    )
      ? selectedAgent
      : "";
}


function updateEditPriority() {
  if (
    !editImpact ||
    !editUrgency ||
    !editPriorityValue
  ) {
    return;
  }


  const priority =
    calculatePriority(
      editImpact.value,
      editUrgency.value
    );


  editPriorityValue.textContent =
    priority ||
    "—";


  editPriorityValue.classList.remove(
    "priority-p1",
    "priority-p2",
    "priority-p3",
    "priority-p4"
  );


  if (priority) {
    editPriorityValue.classList.add(
      `priority-${priority.toLowerCase()}`
    );
  }
}


function openEditDialog() {
  if (
    !currentIncident ||
    !editDialog ||
    currentIncident.state ===
    INCIDENT_STATES.CLOSED
  ) {
    return;
  }


  if (editCategory) {
    editCategory.value =
      currentIncident.category ??
      "";
  }


  if (
    editAssignmentGroup
  ) {
    editAssignmentGroup.value =
      currentIncident.group ??
      "";
  }


  populateAssignedTo(
    currentIncident.group,
    currentIncident.assignedTo
  );


  if (editImpact) {
    editImpact.value =
      currentIncident.impact ??
      "Medium";
  }


  if (editUrgency) {
    editUrgency.value =
      currentIncident.urgency ??
      "Medium";
  }


  if (editFormFeedback) {
    editFormFeedback.hidden =
      true;
  }


  updateEditPriority();


  editDialog.showModal();
}


function closeEditDialog() {
  if (
    editDialog?.open
  ) {
    editDialog.close();
  }
}


function addFieldChangeActivity(
  activity,
  label,
  oldValue,
  newValue,
  createdAt
) {
  const oldDisplay =
    oldValue ||
    "Unassigned";


  const newDisplay =
    newValue ||
    "Unassigned";


  if (
    oldDisplay ===
    newDisplay
  ) {
    return;
  }


  activity.push(
    createActivity({
      type:
        "fieldChange",

      message:
        `${label} changed from ${oldDisplay} to ${newDisplay}`,

      createdAt
    })
  );
}


function saveIncidentEdits() {
  if (
    !currentIncident ||
    !editCategory ||
    !editAssignmentGroup ||
    !editAssignedTo ||
    !editImpact ||
    !editUrgency
  ) {
    return;
  }


  const category =
    editCategory.value;


  const group =
    editAssignmentGroup.value;


  const assignedTo =
    editAssignedTo.value ||
    null;


  const impact =
    editImpact.value;


  const urgency =
    editUrgency.value;


  const priority =
    calculatePriority(
      impact,
      urgency
    );


  const hasChanges =
    category !==
    currentIncident.category ||

    group !==
    currentIncident.group ||

    assignedTo !==
    currentIncident.assignedTo ||

    impact !==
    currentIncident.impact ||

    urgency !==
    currentIncident.urgency ||

    priority !==
    currentIncident.priority;


  if (!hasChanges) {
    showToast({
      type:
        "info",

      title:
        "No changes",

      message:
        "There are no changes to save."
    });


    return;
  }


  const now =
    new Date().toISOString();


  const activity =
    Array.isArray(
      currentIncident.activity
    )
      ? [...currentIncident.activity]
      : [];


  addFieldChangeActivity(
    activity,
    "Category",
    currentIncident.category,
    category,
    now
  );


  addFieldChangeActivity(
    activity,
    "Assignment Group",
    currentIncident.group,
    group,
    now
  );


  addFieldChangeActivity(
    activity,
    "Assigned To",
    currentIncident.assignedTo,
    assignedTo,
    now
  );


  addFieldChangeActivity(
    activity,
    "Impact",
    currentIncident.impact,
    impact,
    now
  );


  addFieldChangeActivity(
    activity,
    "Urgency",
    currentIncident.urgency,
    urgency,
    now
  );


  addFieldChangeActivity(
    activity,
    "Priority",
    currentIncident.priority,
    priority,
    now
  );


  const updatedIncident =
    updateIncident(
      currentIncident.id,
      {
        category,
        group,
        assignedTo,
        impact,
        urgency,
        priority,

        updatedAt:
          now,

        activity
      }
    );


  if (!updatedIncident) {
    return;
  }


  closeEditDialog();


  renderIncident(
    updatedIncident
  );
}


/* =========================================================
   Lifecycle Actions
   ========================================================= */

function showLifecycleFeedback(
  action,
  incident
) {
  const feedback = {
    assign: {
      title:
        "Incident assigned",

      message:
        `${incident.number} was assigned to ${incident.assignedTo}.`
    },

    start: {
      title:
        "Work started",

      message:
        `${incident.number} is now in progress.`
    },

    reopen: {
      title:
        "Incident reopened",

      message:
        `${incident.number} returned to In Progress.`
    },

    close: {
      title:
        "Incident closed",

      message:
        `${incident.number} was closed successfully.`
    }
  };


  const selectedFeedback =
    feedback[action];


  if (!selectedFeedback) {
    return;
  }


  showToast({
    type:
      "success",

    ...selectedFeedback
  });
}

function transitionIncident(
  targetState,
  action
) {
  if (!currentIncident) {
    return;
  }


  if (
    !canTransition(
      currentIncident.state,
      targetState
    )
  ) {
    return;
  }


  const previousState =
    currentIncident.state;


  const now =
    new Date().toISOString();


  const activity =
    Array.isArray(
      currentIncident.activity
    )
      ? [...currentIncident.activity]
      : [];


  let assignedTo =
    currentIncident.assignedTo;


  let message;


  const changes = {
    state:
      targetState,

    updatedAt:
      now
  };


  if (
    action ===
    "assign"
  ) {
    assignedTo =
      CURRENT_USER;


    changes.assignedTo =
      assignedTo;


    message =
      `Incident assigned to ${CURRENT_USER}`;

  } else if (
    action ===
    "reopen"
  ) {
    message =
      "Incident reopened";


    changes.resolutionCode =
      null;

    changes.resolutionNotes =
      null;

    changes.resolvedBy =
      null;

    changes.resolvedAt =
      null;

  } else if (
    action ===
    "close"
  ) {
    message =
      "Incident closed";

  } else {
    message =
      `State changed from ${previousState} to ${targetState}`;
  }


  activity.push(
    createActivity({
      type:
        action === "assign"
          ? "assignment"
          : "state",

      message,

      createdAt:
        now
    })
  );


  changes.activity =
    activity;


  const updatedIncident =
    updateIncident(
      currentIncident.id,
      changes
    );


  if (!updatedIncident) {
    return;
  }


  renderIncident(
    updatedIncident
  );

  showLifecycleFeedback(
    action,
    updatedIncident
  );
}


/* =========================================================
   Work Notes
   ========================================================= */


function addWorkNote(
  note
) {
  if (
    !currentIncident ||
    currentIncident.state ===
    INCIDENT_STATES.CLOSED
  ) {
    return;
  }


  const now =
    new Date().toISOString();


  const activity =
    Array.isArray(
      currentIncident.activity
    )
      ? [...currentIncident.activity]
      : [];


  activity.push(
    createActivity({
      type:
        "workNote",

      message:
        "Work note added",

      details:
        note,

      createdAt:
        now
    })
  );


  const updatedIncident =
    updateIncident(
      currentIncident.id,
      {
        updatedAt:
          now,

        activity
      }
    );


  if (!updatedIncident) {
    return;
  }


  if (
    workNoteInput
  ) {
    workNoteInput.value =
      "";
  }


  renderIncident(
    updatedIncident
  );

  showToast({
    type:
      "success",

    title:
      "Work note added",

    message:
      `A new internal note was added to ${updatedIncident.number}.`
  });


  workNoteInput?.focus();
}


/* =========================================================
   Initialization
   ========================================================= */


function showNotFound() {
  if (
    incidentContent
  ) {
    incidentContent.hidden =
      true;
  }


  if (
    incidentError
  ) {
    incidentError.hidden =
      false;
  }
}


function initializePage() {
  if (!incidentId) {
    showNotFound();

    return;
  }


  const incident =
    getIncidentById(
      incidentId
    );


  if (!incident) {
    showNotFound();

    return;
  }


  renderIncident(
    incident
  );
}


/* =========================================================
   Event Bindings
   ========================================================= */


function bindEvents() {

  /* Edit */

  editIncidentButton?.addEventListener(
    "click",
    openEditDialog
  );


  editDialogClose?.addEventListener(
    "click",
    closeEditDialog
  );


  editDialogCancel?.addEventListener(
    "click",
    closeEditDialog
  );


  editCategory?.addEventListener(
    "change",
    () => {

      const suggestedGroup =
        getSuggestedAssignmentGroup(
          editCategory.value
        );


      if (
        suggestedGroup &&
        editAssignmentGroup
      ) {
        editAssignmentGroup.value =
          suggestedGroup;


        populateAssignedTo(
          suggestedGroup
        );
      }

    }
  );


  editAssignmentGroup?.addEventListener(
    "change",
    () => {

      populateAssignedTo(
        editAssignmentGroup.value
      );

    }
  );


  editImpact?.addEventListener(
    "change",
    updateEditPriority
  );


  editUrgency?.addEventListener(
    "change",
    updateEditPriority
  );


  editForm?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (
        !editForm.checkValidity()
      ) {
        editForm.reportValidity();

        return;
      }


      saveIncidentEdits();

    }
  );


  editDialog?.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        editDialog
      ) {
        closeEditDialog();
      }

    }
  );


  /* Resolution */

  resolutionDialogClose?.addEventListener(
    "click",
    closeResolutionDialog
  );


  resolutionDialogCancel?.addEventListener(
    "click",
    closeResolutionDialog
  );


  resolutionForm?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (
        !resolutionForm.checkValidity()
      ) {
        resolutionForm.reportValidity();

        return;
      }


      resolveIncident();

    }
  );


  resolutionDialog?.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        resolutionDialog
      ) {
        closeResolutionDialog();
      }

    }
  );


  /* Work Notes */

  workNoteForm?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const note =
        workNoteInput?.value
          .trim();


      if (!note) {
        return;
      }


      addWorkNote(
        note
      );

    }
  );
}


initializePage();

bindEvents();