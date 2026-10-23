const categoryAssignmentRules = {
  Hardware: "Infrastructure",
  Software: "Applications",
  Network: "Network",
  Access: "Service Desk",
  Email: "Service Desk",
  Security: "Security",
  Other: "Service Desk"
};


const groupAgents = {
  "Service Desk": [
    "Administrator",
    "Olivia Brown"
  ],

  Infrastructure: [
    "David Moore"
  ],

  Network: [
    "Michael Reed"
  ],

  Applications: [
    "Sarah Collins"
  ],

  Security: [
    "Emily Ross"
  ]
};


export function getSuggestedAssignmentGroup(category) {
  if (!category) {
    return "";
  }

  return (
    categoryAssignmentRules[category] ??
    "Service Desk"
  );
}


export function getAgentsForGroup(group) {
  return [
    ...(groupAgents[group] ?? [])
  ];
}