import type { Meeting, TodayDashboard, CreateMeetingPayload } from "@/types/meeting";
import { DUMMY_MEETINGS, DUMMY_TODAY, DUMMY_CONTACTS } from "@/lib/dummy";

function localDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export const meetingApi = {
  getToday: (): Promise<TodayDashboard> =>
    Promise.resolve(DUMMY_TODAY),

  getUpcoming: (days = 7, limit = 10): Promise<Meeting[]> => {
    const today = localDateStr(new Date());
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    const cutoff = localDateStr(cutoffDate);
    const result = DUMMY_MEETINGS
      .filter((m) => m.date >= today && m.date <= cutoff)
      .slice(0, limit);
    return Promise.resolve(result);
  },

  list: (params?: { status?: string; date?: string; search?: string }): Promise<Meeting[]> => {
    let result = [...DUMMY_MEETINGS];
    if (params?.status) result = result.filter((m) => m.status === params.status);
    if (params?.date)   result = result.filter((m) => m.date === params.date);
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q));
    }
    return Promise.resolve(result);
  },

  get: (id: string): Promise<Meeting> => {
    const m = DUMMY_MEETINGS.find((m) => m.id === id);
    if (!m) return Promise.reject(new Error("Meeting not found"));
    return Promise.resolve(m);
  },

  create: (payload: CreateMeetingPayload): Promise<Meeting> => {
    const newMeeting: Meeting = {
      id: `m-${Date.now()}`,
      title: payload.title,
      type: payload.type,
      status: "UPCOMING",
      meetingLink: payload.meetingLink ?? null,
      location: payload.location ?? null,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      agenda: payload.agenda ?? null,
      isRecurring: payload.isRecurring ?? false,
      createdById: "user-1",
      createdBy: { id: "user-1", email: "john.doe@deenqtt.com", avatar: null },
      participants: (payload.participants ?? []).map((p, i) => ({
        id: `pnew-${i}`,
        extId: p.extId ?? null,
        name: p.name,
        email: p.email ?? null,
        department: p.department ?? null,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(newMeeting);
  },

  update: (id: string, payload: Partial<CreateMeetingPayload> & { status?: string }): Promise<Meeting> => {
    const m = DUMMY_MEETINGS.find((m) => m.id === id);
    if (!m) return Promise.reject(new Error("Meeting not found"));
    return Promise.resolve({ ...m, ...payload, updatedAt: new Date().toISOString() } as Meeting);
  },

  cancel: (_id: string): Promise<void> => Promise.resolve(),

  addParticipant: (_meetingId: string, _userId: string) => Promise.resolve({}),

  removeParticipant: (_meetingId: string, _userId: string) => Promise.resolve({}),
};

export const userApi = {
  list: () => Promise.resolve(DUMMY_CONTACTS),
};
