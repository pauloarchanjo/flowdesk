const priorityMatrix = {

  high: {
    high: "P1",
    medium: "P2",
    low: "P3"
  },

  medium: {
    high: "P2",
    medium: "P3",
    low: "P4"
  },

  low: {
    high: "P3",
    medium: "P4",
    low: "P4"
  }

};


export function calculatePriority(
  impact,
  urgency
) {

  if (!impact || !urgency) {

    return "";

  }


  const normalizedImpact =
    impact.toLowerCase();


  const normalizedUrgency =
    urgency.toLowerCase();


  return (
    priorityMatrix[
    normalizedImpact
    ]?.[
    normalizedUrgency
    ] ?? ""
  );

}