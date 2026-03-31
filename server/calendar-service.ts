import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';

/**
 * Initialize Google Calendar API client
 */
export function createCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.calendar({ version: 'v3', auth });
}

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  duration: number; // in minutes
  isAllDay: boolean;
};

/**
 * Get calendar events for the next 30 days
 */
export async function getUpcomingEvents(
  calendar: calendar_v3.Calendar
): Promise<CalendarEvent[]> {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: thirtyDaysFromNow.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events: CalendarEvent[] = [];

    for (const event of response.data.items || []) {
      if (!event.id || !event.summary) continue;

      const start = event.start?.dateTime
        ? new Date(event.start.dateTime)
        : new Date(event.start?.date || '');
      const end = event.end?.dateTime
        ? new Date(event.end.dateTime)
        : new Date(event.end?.date || '');

      const isAllDay = !event.start?.dateTime;
      const duration = isAllDay ? 0 : (end.getTime() - start.getTime()) / (1000 * 60);

      events.push({
        id: event.id,
        title: event.summary,
        start,
        end,
        duration,
        isAllDay,
      });
    }

    return events;
  } catch (error) {
    console.error('Failed to get calendar events:', error);
    throw error;
  }
}

/**
 * Analyze calendar for revenue recovery opportunities
 */
export function analyzeCalendarForOpportunities(events: CalendarEvent[]) {
  const opportunities = [];

  // Find empty time slots (potential for sales calls)
  const workHours = getWorkHours(events);
  const emptySlots = findEmptySlots(events, workHours);

  if (emptySlots.length > 0) {
    const totalEmptyHours = emptySlots.reduce((sum, slot) => sum + slot.duration, 0) / 60;
    opportunities.push({
      type: 'calendar',
      title: `${totalEmptyHours.toFixed(1)} hours of unused availability`,
      description: 'Open time slots available for sales calls or client meetings',
      value: totalEmptyHours * 200, // Estimate $200 per hour of availability
      confidence: 0.5,
      recommendation: 'Schedule sales calls or client follow-ups during available time',
    });
  }

  // Find overlapping events (scheduling conflicts)
  const conflicts = findConflicts(events);
  if (conflicts.length > 0) {
    opportunities.push({
      type: 'calendar',
      title: `${conflicts.length} scheduling conflicts`,
      description: 'Overlapping events that may cause missed opportunities',
      value: conflicts.length * 500,
      confidence: 0.4,
      recommendation: 'Resolve scheduling conflicts to avoid missed meetings',
    });
  }

  return opportunities;
}

/**
 * Get work hours from calendar events
 */
function getWorkHours(events: CalendarEvent[]) {
  const workStart = 9; // 9 AM
  const workEnd = 17; // 5 PM
  return { start: workStart, end: workEnd };
}

/**
 * Find empty time slots in the calendar
 */
function findEmptySlots(
  events: CalendarEvent[],
  workHours: { start: number; end: number }
) {
  const slots = [];
  const sortedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime());

  for (const event of sortedEvents) {
    const eventStart = event.start.getHours();
    const eventEnd = event.end.getHours();

    // Check if there's a gap before this event
    if (eventStart > workHours.start) {
      const gapDuration = (eventStart - workHours.start) * 60;
      if (gapDuration > 30) {
        // Only report gaps > 30 minutes
        slots.push({
          start: new Date(event.start.getTime() - gapDuration * 60 * 1000),
          end: event.start,
          duration: gapDuration,
        });
      }
    }

    // Check if there's a gap after this event
    if (eventEnd < workHours.end) {
      const nextEventStart = sortedEvents
        .find((e) => e.start.getTime() > event.end.getTime())
        ?.start.getHours();

      if (!nextEventStart || nextEventStart > eventEnd) {
        const gapEnd = nextEventStart || workHours.end;
        const gapDuration = (gapEnd - eventEnd) * 60;
        if (gapDuration > 30) {
          slots.push({
            start: event.end,
            end: new Date(event.end.getTime() + gapDuration * 60 * 1000),
            duration: gapDuration,
          });
        }
      }
    }
  }

  return slots;
}

/**
 * Find overlapping events
 */
function findConflicts(events: CalendarEvent[]) {
  const conflicts = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];

      // Check if events overlap
      if (event1.start < event2.end && event1.end > event2.start) {
        conflicts.push({
          event1: event1.title,
          event2: event2.title,
          overlapStart: Math.max(event1.start.getTime(), event2.start.getTime()),
          overlapEnd: Math.min(event1.end.getTime(), event2.end.getTime()),
        });
      }
    }
  }

  return conflicts;
}
