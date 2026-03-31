import { google } from 'googleapis';
import type { gmail_v1 } from 'googleapis';

/**
 * Initialize Gmail API client
 */
export function createGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.gmail({ version: 'v1', auth });
}

export type EmailMessage = {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  date: Date;
  isUnread: boolean;
};

/**
 * Get recent emails from Gmail
 */
export async function getRecentEmails(
  gmail: gmail_v1.Gmail,
  days: number = 7
): Promise<EmailMessage[]> {
  try {
    const afterDate = new Date();
    afterDate.setDate(afterDate.getDate() - days);
    const afterTimestamp = Math.floor(afterDate.getTime() / 1000);

    // Query for emails from the past N days
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: `after:${afterTimestamp}`,
      maxResults: 50,
    });

    if (!response.data.messages || response.data.messages.length === 0) {
      return [];
    }

    const messages: EmailMessage[] = [];

    for (const msg of response.data.messages) {
      if (!msg.id) continue;

      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['From', 'To', 'Subject', 'Date'],
      });

      const headers = fullMessage.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name === name)?.value || '';

      const isUnread = fullMessage.data.labelIds?.includes('UNREAD') || false;

      messages.push({
        id: msg.id,
        threadId: msg.threadId || '',
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        snippet: fullMessage.data.snippet || '',
        date: new Date(getHeader('Date')),
        isUnread,
      });
    }

    return messages;
  } catch (error) {
    console.error('Failed to get Gmail messages:', error);
    throw error;
  }
}

/**
 * Analyze emails for revenue recovery opportunities
 */
export function analyzeEmailsForOpportunities(emails: EmailMessage[]) {
  const opportunities = [];

  // Find unread emails (potential leads/responses)
  const unreadEmails = emails.filter((e) => e.isUnread);
  if (unreadEmails.length > 0) {
    opportunities.push({
      type: 'email',
      title: `${unreadEmails.length} unread emails`,
      description: 'Potential leads or customer responses waiting for action',
      value: unreadEmails.length * 500, // Estimate $500 per unread email
      confidence: 0.6,
      recommendation: 'Review unread emails for sales opportunities',
    });
  }

  // Find emails with no reply (dormant conversations)
  const dormantThreads = emails.filter((e) => {
    const daysSinceEmail = (Date.now() - e.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceEmail > 3 && e.from.toLowerCase().includes('customer');
  });

  if (dormantThreads.length > 0) {
    opportunities.push({
      type: 'email',
      title: `${dormantThreads.length} dormant conversations`,
      description: 'Emails from customers with no recent reply',
      value: dormantThreads.length * 1000, // Estimate $1000 per dormant customer
      confidence: 0.7,
      recommendation: 'Follow up with customers to revive opportunities',
    });
  }

  return opportunities;
}
