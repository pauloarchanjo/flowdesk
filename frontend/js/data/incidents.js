export const seedIncidents = [
  {
    id: "incident-24",

    number: "INC0024",

    title:
      "Corporate VPN unavailable",

    caller:
      "Emma Johnson",

    description:
      "User is unable to establish a connection to the corporate VPN. Authentication completes successfully, but the connection is terminated shortly afterwards.",

    category:
      "Network",

    impact:
      "High",

    urgency:
      "Medium",

    priority:
      "P2",

    state:
      "In Progress",

    group:
      "Network",

    assignedTo:
      "Michael Reed",

    createdAt:
      "2026-10-23T07:58:00",

    updatedAt:
      "2026-10-23T08:42:00",

    activity: [
      {
        id: "activity-24-1",

        type:
          "created",

        message:
          "Incident created",

        author:
          "Administrator",

        createdAt:
          "2026-10-23T07:58:00"
      },

      {
        id: "activity-24-2",

        type:
          "assignment",

        message:
          "Assigned to Network",

        author:
          "Administrator",

        createdAt:
          "2026-10-23T08:12:00"
      },

      {
        id: "activity-24-3",

        type:
          "state",

        message:
          "State changed to In Progress",

        author:
          "Michael Reed",

        createdAt:
          "2026-10-23T08:42:00"
      }
    ]
  },


  {
    id: "incident-23",

    number: "INC0023",

    title:
      "ERP production environment unavailable",

    caller:
      "Daniel Carter",

    description:
      "Finance users are unable to access the production ERP environment. The application returns a service unavailable response.",

    category:
      "Software",

    impact:
      "High",

    urgency:
      "High",

    priority:
      "P1",

    state:
      "Assigned",

    group:
      "Applications",

    assignedTo:
      "Sarah Collins",

    createdAt:
      "2026-10-23T07:44:00",

    updatedAt:
      "2026-10-23T08:15:00",

    activity: [
      {
        id: "activity-23-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-23T07:44:00"
      },

      {
        id: "activity-23-2",
        type: "assignment",
        message: "Assigned to Applications",
        author: "Administrator",
        createdAt: "2026-10-23T08:15:00"
      }
    ]
  },


  {
    id: "incident-22",

    number: "INC0022",

    title:
      "Unable to access corporate email",

    caller:
      "Sophia Miller",

    description:
      "User receives an authentication error when attempting to access corporate email from both desktop and web clients.",

    category:
      "Email",

    impact:
      "Medium",

    urgency:
      "Medium",

    priority:
      "P3",

    state:
      "New",

    group:
      "Service Desk",

    assignedTo:
      null,

    createdAt:
      "2026-10-23T07:51:00",

    updatedAt:
      "2026-10-23T07:51:00",

    activity: [
      {
        id: "activity-22-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-23T07:51:00"
      }
    ]
  },


  {
    id: "incident-21",

    number: "INC0021",

    title:
      "Password reset required",

    caller:
      "Lucas Bennett",

    description:
      "User is unable to authenticate after multiple unsuccessful password attempts and requires account recovery.",

    category:
      "Access",

    impact:
      "Low",

    urgency:
      "Low",

    priority:
      "P4",

    state:
      "Resolved",

    group:
      "Service Desk",

    assignedTo:
      "Olivia Brown",

    createdAt:
      "2026-10-23T06:58:00",

    updatedAt:
      "2026-10-23T07:32:00",

    activity: [
      {
        id: "activity-21-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-23T06:58:00"
      },

      {
        id: "activity-21-2",
        type: "state",
        message: "Incident resolved",
        author: "Olivia Brown",
        createdAt: "2026-10-23T07:32:00"
      }
    ]
  },


  {
    id: "incident-20",

    number: "INC0020",

    title:
      "Wireless network instability",

    caller:
      "Olivia Wilson",

    description:
      "Intermittent wireless connectivity reported in the north office area. Multiple users are experiencing frequent disconnections.",

    category:
      "Network",

    impact:
      "High",

    urgency:
      "Medium",

    priority:
      "P2",

    state:
      "In Progress",

    group:
      "Network",

    assignedTo:
      "Michael Reed",

    createdAt:
      "2026-10-22T16:40:00",

    updatedAt:
      "2026-10-22T17:46:00",

    activity: [
      {
        id: "activity-20-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-22T16:40:00"
      },

      {
        id: "activity-20-2",
        type: "state",
        message: "State changed to In Progress",
        author: "Michael Reed",
        createdAt: "2026-10-22T17:46:00"
      }
    ]
  },


  {
    id: "incident-19",

    number: "INC0019",

    title:
      "Employee laptop not starting",

    caller:
      "James Anderson",

    description:
      "Laptop does not complete the boot process after powering on. Device remains on the manufacturer splash screen.",

    category:
      "Hardware",

    impact:
      "Medium",

    urgency:
      "Medium",

    priority:
      "P3",

    state:
      "Assigned",

    group:
      "Infrastructure",

    assignedTo:
      "David Moore",

    createdAt:
      "2026-10-22T15:48:00",

    updatedAt:
      "2026-10-22T16:20:00",

    activity: [
      {
        id: "activity-19-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-22T15:48:00"
      },

      {
        id: "activity-19-2",
        type: "assignment",
        message: "Assigned to Infrastructure",
        author: "Administrator",
        createdAt: "2026-10-22T16:20:00"
      }
    ]
  },


  {
    id: "incident-18",

    number: "INC0018",

    title:
      "Suspicious login activity detected",

    caller:
      "Mia Thompson",

    description:
      "Several authentication attempts were detected from an unusual location outside the employee's normal access pattern.",

    category:
      "Security",

    impact:
      "High",

    urgency:
      "Medium",

    priority:
      "P2",

    state:
      "In Progress",

    group:
      "Security",

    assignedTo:
      "Emily Ross",

    createdAt:
      "2026-10-22T13:25:00",

    updatedAt:
      "2026-10-22T14:12:00",

    activity: [
      {
        id: "activity-18-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-22T13:25:00"
      },

      {
        id: "activity-18-2",
        type: "state",
        message: "Security investigation started",
        author: "Emily Ross",
        createdAt: "2026-10-22T14:12:00"
      }
    ]
  },


  {
    id: "incident-17",

    number: "INC0017",

    title:
      "Printer unavailable on second floor",

    caller:
      "Noah Davis",

    description:
      "Department printer was unavailable to users on the second floor. Network connectivity was restored after restarting the print service.",

    category:
      "Hardware",

    impact:
      "Low",

    urgency:
      "Low",

    priority:
      "P4",

    state:
      "Closed",

    group:
      "Infrastructure",

    assignedTo:
      "David Moore",

    createdAt:
      "2026-10-22T09:32:00",

    updatedAt:
      "2026-10-22T11:55:00",

    activity: [
      {
        id: "activity-17-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-22T09:32:00"
      },

      {
        id: "activity-17-2",
        type: "state",
        message: "Incident closed",
        author: "David Moore",
        createdAt: "2026-10-22T11:55:00"
      }
    ]
  },


  {
    id: "incident-16",

    number: "INC0016",

    title:
      "Access denied to finance application",

    caller:
      "Ava Martinez",

    description:
      "User receives an access denied message when opening the finance reporting application despite having previously approved access.",

    category:
      "Access",

    impact:
      "Medium",

    urgency:
      "Medium",

    priority:
      "P3",

    state:
      "New",

    group:
      "Applications",

    assignedTo:
      null,

    createdAt:
      "2026-10-22T10:34:00",

    updatedAt:
      "2026-10-22T10:34:00",

    activity: [
      {
        id: "activity-16-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-22T10:34:00"
      }
    ]
  },


  {
    id: "incident-15",

    number: "INC0015",

    title:
      "Multiple failed authentication attempts",

    caller:
      "Ethan Clark",

    description:
      "Security monitoring identified multiple unsuccessful authentication attempts against the user's account within a short period.",

    category:
      "Security",

    impact:
      "High",

    urgency:
      "High",

    priority:
      "P1",

    state:
      "Resolved",

    group:
      "Security",

    assignedTo:
      "Emily Ross",

    createdAt:
      "2026-10-21T16:55:00",

    updatedAt:
      "2026-10-21T18:08:00",

    activity: [
      {
        id: "activity-15-1",
        type: "created",
        message: "Incident created",
        author: "Administrator",
        createdAt: "2026-10-21T16:55:00"
      },

      {
        id: "activity-15-2",
        type: "state",
        message: "Incident resolved",
        author: "Emily Ross",
        createdAt: "2026-10-21T18:08:00"
      }
    ]
  }
];