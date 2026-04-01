import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/oauth/google/callback'
);

export function getGoogleAuthUrl(scopes: string[]) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

export async function getGoogleTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function readGmailMessages(accessToken: string, maxResults = 10) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'is:unread',
    });

    const messages = response.data.messages || [];
    const details = await Promise.all(
      messages.map(async (msg: any) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        });
        return detail.data;
      })
    );

    return details.map((msg: any) => ({
      id: msg.id,
      from: msg.payload?.headers?.find((h: any) => h.name === 'From')?.value || 'Unknown',
      subject: msg.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
      snippet: msg.snippet,
      internalDate: msg.internalDate,
    }));
  } catch (error) {
    console.error('Gmail API error:', error);
    return [];
  }
}

export async function readGoogleCalendarEvents(accessToken: string, maxResults = 10) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      maxResults,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Calendar API error:', error);
    return [];
  }
}

export async function detectCalendarConflicts(accessToken: string) {
  const events = await readGoogleCalendarEvents(accessToken, 50);
  const conflicts = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i] as any;
      const event2 = events[j] as any;

      const start1 = new Date(event1.start?.dateTime || event1.start?.date || 0);
      const end1 = new Date(event1.end?.dateTime || event1.end?.date || 0);
      const start2 = new Date(event2.start?.dateTime || event2.start?.date || 0);
      const end2 = new Date(event2.end?.dateTime || event2.end?.date || 0);

      if (start1 < end2 && start2 < end1) {
        conflicts.push({
          event1: event1.summary,
          event2: event2.summary,
          time: start1.toISOString(),
        });
      }
    }
  }

  return conflicts;
}

export async function detectEmptyCalendarSlots(accessToken: string) {
  const events = await readGoogleCalendarEvents(accessToken, 50);
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59);

  let totalMinutes = 0;
  let bookedMinutes = 0;

  for (const event of events) {
    const start = new Date(event.start?.dateTime || event.start?.date || 0);
    const end = new Date(event.end?.dateTime || event.end?.date || 0);

    if (start >= now && end <= endOfDay) {
      bookedMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
    }
  }

  totalMinutes = (endOfDay.getTime() - now.getTime()) / (1000 * 60);
  const availableMinutes = totalMinutes - bookedMinutes;

  return {
    totalMinutes,
    bookedMinutes,
    availableMinutes,
    utilizationPercent: Math.round((bookedMinutes / totalMinutes) * 100),
  };
}
