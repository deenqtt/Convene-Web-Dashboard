export type MeetingType = "VIRTUAL" | "PHYSICAL";
export type MeetingStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface MeetingUser {
  id: string;
  email: string;
  avatar?: string | null;
}

export interface MeetingParticipant {
  id: string;
  extId: string | null;
  name: string;
  email: string | null;
  department: string | null;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  meetingLink?: string | null;
  location?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  agenda?: string | null;
  isRecurring: boolean;
  createdById: string;
  createdBy: MeetingUser;
  participants: MeetingParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface TodayDashboard {
  total: number;
  meetings: Meeting[];
  nextMeeting: Meeting | null;
}

export interface ParticipantPayload {
  extId?: string;
  name: string;
  email?: string;
  department?: string;
}

export interface CreateMeetingPayload {
  title: string;
  type: MeetingType;
  meetingLink?: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  agenda?: string;
  isRecurring?: boolean;
  participants?: ParticipantPayload[];
}
