-- ============================================
-- ARIA-X Business Data Schema for Supabase
-- ============================================

-- 1. Businesses table (linked to users)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  connected_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dormant', 'lost')),
  last_contact TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue', 'disputed')),
  due_date DATE,
  issued_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Leads table (potential revenue)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10, 2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'contacted', 'qualified', 'lost', 'won')),
  last_contact TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Findings table (AI-generated recovery opportunities)
CREATE TABLE IF NOT EXISTS findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('invoice', 'lead', 'calendar')),
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10, 2),
  confidence DECIMAL(3, 2),
  recommendation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
  related_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  related_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Executions table (tracking completed actions)
CREATE TABLE IF NOT EXISTS executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  finding_id UUID NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  result TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  executed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;

-- Businesses: Users can only see their own
CREATE POLICY "Users can see their own business"
  ON businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business"
  ON businesses FOR UPDATE
  USING (auth.uid() = user_id);

-- Contacts: Users can see contacts for their businesses
CREATE POLICY "Users can see contacts for their businesses"
  ON contacts FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create contacts for their businesses"
  ON contacts FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update contacts for their businesses"
  ON contacts FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Invoices: Users can see invoices for their businesses
CREATE POLICY "Users can see invoices for their businesses"
  ON invoices FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create invoices for their businesses"
  ON invoices FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invoices for their businesses"
  ON invoices FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Leads: Users can see leads for their businesses
CREATE POLICY "Users can see leads for their businesses"
  ON leads FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create leads for their businesses"
  ON leads FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update leads for their businesses"
  ON leads FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Findings: Users can see findings for their businesses
CREATE POLICY "Users can see findings for their businesses"
  ON findings FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create findings for their businesses"
  ON findings FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update findings for their businesses"
  ON findings FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Executions: Users can see executions for their businesses
CREATE POLICY "Users can see executions for their businesses"
  ON executions FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create executions for their businesses"
  ON executions FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_contacts_business_id ON contacts(business_id);
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_findings_business_id ON findings(business_id);
CREATE INDEX idx_findings_status ON findings(status);
CREATE INDEX idx_executions_business_id ON executions(business_id);
CREATE INDEX idx_executions_finding_id ON executions(finding_id);
