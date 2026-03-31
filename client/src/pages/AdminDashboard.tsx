import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Users, BarChart3, Lock, Zap, Database } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Only admins can access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <Card className="p-8 max-w-md">
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center mb-2">Access Denied</h1>
          <p className="text-slate-600 text-center mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <Button
            onClick={() => setLocation('/')}
            className="w-full"
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">System management & control</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Logged in as</p>
              <p className="font-semibold">{user.email || 'Admin'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'integrations', label: 'Integrations', icon: Zap },
              { id: 'database', label: 'Database', icon: Database },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-4 border-b-2 font-medium flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-slate-600 text-sm font-medium mb-2">Total Users</div>
              <div className="text-4xl font-bold mb-2">1,234</div>
              <div className="text-green-600 text-sm">+12% this month</div>
            </Card>
            <Card className="p-6">
              <div className="text-slate-600 text-sm font-medium mb-2">Active Subscriptions</div>
              <div className="text-4xl font-bold mb-2">456</div>
              <div className="text-green-600 text-sm">+8% this month</div>
            </Card>
            <Card className="p-6">
              <div className="text-slate-600 text-sm font-medium mb-2">Revenue Recovered</div>
              <div className="text-4xl font-bold mb-2">$2.3M</div>
              <div className="text-green-600 text-sm">+15% this month</div>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600">User management features:</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>✓ View all users and their subscription status</li>
                  <li>✓ Manage user roles and permissions</li>
                  <li>✓ Send notifications to users</li>
                  <li>✓ Export user data for analytics</li>
                  <li>✓ Manage user integrations</li>
                </ul>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Open User Management
              </Button>
            </div>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Integration Status</h2>
            <div className="space-y-4">
              {[
                { name: 'Gmail API', status: 'Connected', icon: '📧' },
                { name: 'Google Calendar', status: 'Connected', icon: '📅' },
                { name: 'Stripe', status: 'Connected', icon: '💳' },
                { name: 'Supabase', status: 'Connected', icon: '🗄️' },
                { name: 'Claude API', status: 'Connected', icon: '🤖' },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-semibold">{integration.name}</p>
                      <p className="text-sm text-slate-600">Status: {integration.status}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'database' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Database Management</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600">Database information:</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 font-mono">
                  <li>Provider: Supabase (PostgreSQL)</li>
                  <li>URL: https://vhycfkhruerfqxjqzyyh.supabase.co</li>
                  <li>Tables: 9 (users, businesses, invoices, leads, etc.)</li>
                  <li>RLS: Enabled</li>
                  <li>Backups: Daily</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  View Schema
                </Button>
                <Button variant="outline" className="w-full">
                  Run Query
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Platform Name</label>
                <input
                  type="text"
                  defaultValue="ARIA-X"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@aria-x.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Pro Tier Price</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">$</span>
                  <input
                    type="number"
                    defaultValue="29"
                    className="w-24 px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <span className="text-slate-600">/month</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
