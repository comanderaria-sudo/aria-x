import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, Upload } from 'lucide-react';

export default function Integrations() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [integrations, setIntegrations] = useState({
    gmail: false,
    calendar: false,
    invoices: false,
  });

  const handleConnectGmail = () => {
    // TODO: Implement Google OAuth flow
    alert('Gmail integration coming soon');
  };

  const handleConnectCalendar = () => {
    // TODO: Implement Google Calendar OAuth flow
    alert('Calendar integration coming soon');
  };

  const handleUploadInvoices = () => {
    // TODO: Implement CSV upload
    alert('Invoice upload coming soon');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Data Integrations</h1>
          <p className="text-xl text-slate-600">
            Connect your business tools so ARIA-X can find revenue opportunities
          </p>
        </div>

        <div className="grid gap-6">
          {/* Gmail Integration */}
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {integrations.gmail ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                  <h3 className="text-2xl font-bold">Gmail</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Connect your Gmail account to detect unread emails and dormant conversations
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>✓ Find unread emails (potential leads)</p>
                  <p>✓ Identify customers with no recent reply</p>
                  <p>✓ Estimate revenue from follow-up opportunities</p>
                </div>
              </div>
              <Button
                onClick={handleConnectGmail}
                disabled={integrations.gmail}
                className="ml-4 bg-blue-600 hover:bg-blue-700"
              >
                {integrations.gmail ? 'Connected' : 'Connect Gmail'}
              </Button>
            </div>
          </Card>

          {/* Google Calendar Integration */}
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {integrations.calendar ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                  <h3 className="text-2xl font-bold">Google Calendar</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Connect your calendar to find available time for sales calls and follow-ups
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>✓ Find empty time slots for sales calls</p>
                  <p>✓ Detect scheduling conflicts</p>
                  <p>✓ Identify unused availability</p>
                </div>
              </div>
              <Button
                onClick={handleConnectCalendar}
                disabled={integrations.calendar}
                className="ml-4 bg-blue-600 hover:bg-blue-700"
              >
                {integrations.calendar ? 'Connected' : 'Connect Calendar'}
              </Button>
            </div>
          </Card>

          {/* Invoice Upload */}
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {integrations.invoices ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                  <h3 className="text-2xl font-bold">Invoices (CSV)</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Upload a CSV file with your invoices to find overdue payments and collection opportunities
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>✓ Find overdue invoices</p>
                  <p>✓ Identify invoices due soon</p>
                  <p>✓ Prioritize high-value invoices</p>
                </div>
              </div>
              <Button
                onClick={handleUploadInvoices}
                className="ml-4 bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="outline"
            className="text-lg px-8 py-6"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
