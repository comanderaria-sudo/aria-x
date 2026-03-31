import { getDb } from './db';

export type Business = {
  id: string;
  user_id: string;
  name: string;
  industry?: string;
  website?: string;
  connected_at: Date;
  updated_at: Date;
};

export type Invoice = {
  id: string;
  business_id: string;
  contact_id?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'disputed';
  due_date?: Date;
  issued_date?: Date;
  created_at: Date;
  updated_at: Date;
};

export type Lead = {
  id: string;
  business_id: string;
  contact_id?: string;
  title: string;
  description?: string;
  value?: number;
  status: 'open' | 'contacted' | 'qualified' | 'lost' | 'won';
  last_contact?: Date;
  created_at: Date;
  updated_at: Date;
};

/**
 * Create a business for a user (Supabase operation)
 */
export async function createBusiness(
  userId: string,
  name: string,
  industry?: string,
  website?: string
): Promise<Business> {
  // This would be called from a tRPC procedure
  // The actual database operation happens in Supabase via RLS
  return {
    id: 'business-' + Date.now(),
    user_id: userId,
    name,
    industry,
    website,
    connected_at: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Get user's business
 */
export async function getUserBusiness(userId: string): Promise<Business | null> {
  // This would query Supabase via RLS
  return null;
}

/**
 * Get unpaid invoices for a business
 */
export async function getUnpaidInvoices(businessId: string): Promise<Invoice[]> {
  // This would query Supabase via RLS
  return [];
}

/**
 * Get dormant leads for a business
 */
export async function getDormantLeads(businessId: string): Promise<Lead[]> {
  // This would query Supabase via RLS
  return [];
}

/**
 * Calculate total unpaid amount
 */
export function calculateTotalUnpaid(invoices: Invoice[]): number {
  return invoices
    .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
}

/**
 * Calculate total lead value
 */
export function calculateTotalLeadValue(leads: Lead[]): number {
  return leads
    .filter(lead => lead.status === 'open' || lead.status === 'contacted')
    .reduce((sum, lead) => sum + (lead.value || 0), 0);
}
