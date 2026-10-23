export const INCIDENT_STATES = {
  NEW: "New",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed"
};


const lifecycleActions = {
  [INCIDENT_STATES.NEW]: [
    {
      targetState: INCIDENT_STATES.ASSIGNED,
      label: "Assign to me",
      action: "assign",
      variant: "primary"
    }
  ],

  [INCIDENT_STATES.ASSIGNED]: [
    {
      targetState: INCIDENT_STATES.IN_PROGRESS,
      label: "Start work",
      action: "start",
      variant: "primary"
    }
  ],

  [INCIDENT_STATES.IN_PROGRESS]: [
    {
      targetState: INCIDENT_STATES.RESOLVED,
      label: "Resolve incident",
      action: "resolve",
      variant: "primary"
    }
  ],

  [INCIDENT_STATES.RESOLVED]: [
    {
      targetState: INCIDENT_STATES.CLOSED,
      label: "Close incident",
      action: "close",
      variant: "primary"
    },

    {
      targetState: INCIDENT_STATES.IN_PROGRESS,
      label: "Reopen",
      action: "reopen",
      variant: "secondary"
    }
  ],

  [INCIDENT_STATES.CLOSED]: []
};


export function getLifecycleActions(state) {
  return lifecycleActions[state] ?? [];
}


export function canTransition(
  currentState,
  targetState
) {
  const actions =
    getLifecycleActions(currentState);

  return actions.some(
    (action) =>
      action.targetState === targetState
  );
}