import type { Meeting, TodayDashboard } from "@/types/meeting";

function localDateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const D0 = localDateStr(0);  // today
const D1 = localDateStr(1);  // tomorrow
const D2 = localDateStr(2);
const D4 = localDateStr(4);
const D5 = localDateStr(5);
const D7 = localDateStr(7);
const D9 = localDateStr(9);

// ── User ──────────────────────────────────────────────────────────────────────

export const DUMMY_USER = {
  username: "johndoe",
  email: "john.doe@deenqtt.com",
  role: "Admin",
};

// ── Contacts / Participants ───────────────────────────────────────────────────

export interface DummyContact {
  id: number;
  name: string;
  email: string | null;
  departmentName: string | null;
  phoneHr: string | null;
  authorizationLevel: string | null;
}

export const DUMMY_CONTACTS: DummyContact[] = [
  { id: 1,  name: "Alice Johnson",  email: "alice.j@deenqtt.com",   departmentName: "Engineering", phoneHr: "ext. 101", authorizationLevel: "Manager" },
  { id: 2,  name: "Bob Smith",      email: "bob.s@deenqtt.com",     departmentName: "Engineering", phoneHr: "ext. 102", authorizationLevel: "Staff"   },
  { id: 3,  name: "Clara Lee",      email: "clara.l@deenqtt.com",   departmentName: "Product",     phoneHr: "ext. 201", authorizationLevel: "Manager" },
  { id: 4,  name: "David Kim",      email: "david.k@deenqtt.com",   departmentName: "Product",     phoneHr: null,       authorizationLevel: "Staff"   },
  { id: 5,  name: "Eva Martinez",   email: "eva.m@deenqtt.com",     departmentName: "Design",      phoneHr: "ext. 301", authorizationLevel: "Lead"    },
  { id: 6,  name: "Frank Chen",     email: "frank.c@deenqtt.com",   departmentName: "Design",      phoneHr: "ext. 302", authorizationLevel: "Staff"   },
  { id: 7,  name: "Grace Park",     email: "grace.p@deenqtt.com",   departmentName: "Marketing",   phoneHr: "ext. 401", authorizationLevel: "Manager" },
  { id: 8,  name: "Henry Wilson",   email: "henry.w@deenqtt.com",   departmentName: "Marketing",   phoneHr: null,       authorizationLevel: "Staff"   },
  { id: 9,  name: "Iris Tanaka",    email: "iris.t@deenqtt.com",    departmentName: "HR",          phoneHr: "ext. 501", authorizationLevel: "Manager" },
  { id: 10, name: "Jack Brown",     email: "jack.b@deenqtt.com",    departmentName: "Finance",     phoneHr: "ext. 601", authorizationLevel: "Staff"   },
  { id: 11, name: "Karen White",    email: "karen.w@deenqtt.com",   departmentName: "Finance",     phoneHr: "ext. 602", authorizationLevel: "Lead"    },
  { id: 12, name: "Leo Garcia",     email: "leo.g@deenqtt.com",     departmentName: "Engineering", phoneHr: "ext. 103", authorizationLevel: "Staff"   },
  { id: 13, name: "Mia Nguyen",     email: "mia.n@deenqtt.com",     departmentName: "HR",          phoneHr: "ext. 502", authorizationLevel: "Staff"   },
  { id: 14, name: "Nathan Reed",    email: "nathan.r@deenqtt.com",  departmentName: "Engineering", phoneHr: null,       authorizationLevel: "Staff"   },
  { id: 15, name: "Olivia Stone",   email: "olivia.s@deenqtt.com",  departmentName: "Product",     phoneHr: "ext. 202", authorizationLevel: "Lead"    },
];

// ── Meetings ──────────────────────────────────────────────────────────────────

const BASE = {
  createdById: "user-1",
  createdBy: { id: "user-1", email: "john.doe@deenqtt.com", avatar: null },
  isRecurring: false,
  createdAt: "2026-02-20T08:00:00.000Z",
  updatedAt: "2026-02-20T08:00:00.000Z",
};

export const DUMMY_MEETINGS: Meeting[] = [
  // ── Today ──
  {
    ...BASE,
    id: "m1",
    title: "Sprint Planning",
    type: "VIRTUAL",
    status: "ONGOING",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    location: null,
    date: D0,
    startTime: "09:00",
    endTime: "10:00",
    agenda: "Plan tasks for Sprint 12. Review backlog and assign story points.",
    participants: [
      { id: "p1", extId: "1",  name: "Alice Johnson", email: "alice.j@deenqtt.com",  department: "Engineering" },
      { id: "p2", extId: "2",  name: "Bob Smith",     email: "bob.s@deenqtt.com",    department: "Engineering" },
      { id: "p3", extId: "3",  name: "Clara Lee",     email: "clara.l@deenqtt.com",  department: "Product"     },
    ],
  },
  {
    ...BASE,
    id: "m2",
    title: "Design Review",
    type: "VIRTUAL",
    status: "UPCOMING",
    meetingLink: "https://zoom.us/j/123456789",
    location: null,
    date: D0,
    startTime: "14:00",
    endTime: "15:00",
    agenda: "Review new dashboard mockups and gather feedback from stakeholders.",
    participants: [
      { id: "p4", extId: "5", name: "Eva Martinez", email: "eva.m@deenqtt.com",   department: "Design"  },
      { id: "p5", extId: "3", name: "Clara Lee",    email: "clara.l@deenqtt.com", department: "Product" },
    ],
  },
  {
    ...BASE,
    id: "m3",
    title: "Product Roadmap Discussion",
    type: "PHYSICAL",
    status: "UPCOMING",
    meetingLink: null,
    location: "Conference Room A, 3rd Floor",
    date: D0,
    startTime: "16:00",
    endTime: "17:30",
    agenda: "Discuss Q2 roadmap priorities and upcoming feature releases.",
    participants: [
      { id: "p6", extId: "3",  name: "Clara Lee",   email: "clara.l@deenqtt.com",  department: "Product"    },
      { id: "p7", extId: "4",  name: "David Kim",   email: "david.k@deenqtt.com",  department: "Product"    },
      { id: "p8", extId: "7",  name: "Grace Park",  email: "grace.p@deenqtt.com",  department: "Marketing"  },
      { id: "p9", extId: "15", name: "Olivia Stone",email: "olivia.s@deenqtt.com", department: "Product"    },
    ],
  },
  // ── Tomorrow ──
  {
    ...BASE,
    id: "m4",
    title: "Engineering Standup",
    type: "VIRTUAL",
    status: "UPCOMING",
    meetingLink: "https://meet.google.com/xyz-uvwx-yz",
    location: null,
    date: D1,
    startTime: "09:00",
    endTime: "09:30",
    isRecurring: true,
    participants: [
      { id: "p10", extId: "1",  name: "Alice Johnson", email: "alice.j@deenqtt.com", department: "Engineering" },
      { id: "p11", extId: "2",  name: "Bob Smith",     email: "bob.s@deenqtt.com",   department: "Engineering" },
      { id: "p12", extId: "12", name: "Leo Garcia",    email: "leo.g@deenqtt.com",   department: "Engineering" },
      { id: "p13", extId: "14", name: "Nathan Reed",   email: "nathan.r@deenqtt.com",department: "Engineering" },
    ],
  },
  {
    ...BASE,
    id: "m5",
    title: "UX Workshop",
    type: "PHYSICAL",
    status: "UPCOMING",
    meetingLink: null,
    location: "Creative Lab, 4th Floor",
    date: D1,
    startTime: "13:00",
    endTime: "16:00",
    agenda: "Collaborative session to redesign the onboarding flow.",
    participants: [
      { id: "p14", extId: "5", name: "Eva Martinez", email: "eva.m@deenqtt.com",  department: "Design"  },
      { id: "p15", extId: "6", name: "Frank Chen",   email: "frank.c@deenqtt.com",department: "Design"  },
      { id: "p16", extId: "3", name: "Clara Lee",    email: "clara.l@deenqtt.com",department: "Product" },
    ],
  },
  // ── D+2 ──
  {
    ...BASE,
    id: "m6",
    title: "Marketing Campaign Review",
    type: "PHYSICAL",
    status: "UPCOMING",
    meetingLink: null,
    location: "Meeting Room B, 2nd Floor",
    date: D2,
    startTime: "10:00",
    endTime: "11:00",
    participants: [
      { id: "p17", extId: "7", name: "Grace Park",   email: "grace.p@deenqtt.com",  department: "Marketing" },
      { id: "p18", extId: "8", name: "Henry Wilson", email: "henry.w@deenqtt.com",  department: "Marketing" },
    ],
  },
  // ── D+4 ──
  {
    ...BASE,
    id: "m7",
    title: "Quarterly Budget Review",
    type: "VIRTUAL",
    status: "UPCOMING",
    meetingLink: "https://teams.microsoft.com/l/meetup/q1review",
    location: null,
    date: D4,
    startTime: "13:00",
    endTime: "15:00",
    agenda: "Q1 actual vs. budget analysis and Q2 financial forecast.",
    participants: [
      { id: "p19", extId: "10", name: "Jack Brown",  email: "jack.b@deenqtt.com",  department: "Finance" },
      { id: "p20", extId: "11", name: "Karen White", email: "karen.w@deenqtt.com", department: "Finance" },
      { id: "p21", extId: "9",  name: "Iris Tanaka", email: "iris.t@deenqtt.com",  department: "HR"      },
    ],
  },
  // ── D+5 ──
  {
    ...BASE,
    id: "m8",
    title: "1-on-1: Alice & John",
    type: "VIRTUAL",
    status: "UPCOMING",
    meetingLink: "https://meet.google.com/1on1-alice",
    location: null,
    date: D5,
    startTime: "10:00",
    endTime: "10:30",
    isRecurring: true,
    participants: [
      { id: "p22", extId: "1", name: "Alice Johnson", email: "alice.j@deenqtt.com", department: "Engineering" },
    ],
  },
  // ── D+7 ──
  {
    ...BASE,
    id: "m9",
    title: "HR Town Hall",
    type: "PHYSICAL",
    status: "UPCOMING",
    meetingLink: null,
    location: "Main Auditorium, Ground Floor",
    date: D7,
    startTime: "10:00",
    endTime: "12:00",
    agenda: "Company-wide updates, policy changes, and open Q&A session.",
    participants: [
      { id: "p23", extId: "9",  name: "Iris Tanaka", email: "iris.t@deenqtt.com", department: "HR" },
      { id: "p24", extId: "13", name: "Mia Nguyen",  email: "mia.n@deenqtt.com",  department: "HR" },
    ],
  },
  // ── D+9 ──
  {
    ...BASE,
    id: "m10",
    title: "Client Demo — Q2 Features",
    type: "VIRTUAL",
    status: "UPCOMING",
    meetingLink: "https://zoom.us/j/987654321",
    location: null,
    date: D9,
    startTime: "14:00",
    endTime: "15:00",
    agenda: "Live demo of new features for external client stakeholders.",
    participants: [
      { id: "p25", extId: "3",  name: "Clara Lee",     email: "clara.l@deenqtt.com", department: "Product"     },
      { id: "p26", extId: "5",  name: "Eva Martinez",  email: "eva.m@deenqtt.com",   department: "Design"      },
      { id: "p27", extId: "1",  name: "Alice Johnson", email: "alice.j@deenqtt.com", department: "Engineering" },
    ],
  },
];

// ── Today dashboard ───────────────────────────────────────────────────────────

const todayMeetings = DUMMY_MEETINGS.filter((m) => m.date === D0);

export const DUMMY_TODAY: TodayDashboard = {
  total: todayMeetings.length,
  meetings: todayMeetings,
  nextMeeting: todayMeetings.find((m) => m.status === "UPCOMING") ?? null,
};
