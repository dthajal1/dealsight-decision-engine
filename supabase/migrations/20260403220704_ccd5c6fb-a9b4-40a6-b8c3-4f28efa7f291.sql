
-- Create deals table
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'analyzing', 'reviewed')),
  verdict TEXT CHECK (verdict IN ('strong', 'caution', 'pass')),
  valuation_low NUMERIC,
  valuation_high NUMERIC,
  revenue NUMERIC,
  net_income NUMERIC,
  recurring_revenue_pct NUMERIC,
  employees INTEGER,
  year_established INTEGER,
  risks JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  next_steps JSONB DEFAULT '[]'::jsonb,
  cim_file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth for now)
CREATE POLICY "Anyone can view deals" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Anyone can create deals" ON public.deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update deals" ON public.deals FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete deals" ON public.deals FOR DELETE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for CIM files
INSERT INTO storage.buckets (id, name, public) VALUES ('cim-files', 'cim-files', true);

CREATE POLICY "Anyone can upload CIM files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cim-files');
CREATE POLICY "Anyone can view CIM files" ON storage.objects FOR SELECT USING (bucket_id = 'cim-files');
