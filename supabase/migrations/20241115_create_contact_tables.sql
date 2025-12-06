-- Migration: Create Contact Messages Table
-- Description: Store contact messages from general and restaurant forms
-- Created: 2024-11-15

-- Table for general contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, read, responded, spam
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create indexes for contact_messages
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at);

-- Table for restaurant contact requests
CREATE TABLE IF NOT EXISTS public.restaurant_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, approved, rejected, spam
  notes TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_format_restaurant CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create indexes for restaurant_inquiries
CREATE INDEX idx_restaurant_inquiries_email ON public.restaurant_inquiries(email);
CREATE INDEX idx_restaurant_inquiries_status ON public.restaurant_inquiries(status);
CREATE INDEX idx_restaurant_inquiries_created_at ON public.restaurant_inquiries(created_at);
CREATE INDEX idx_restaurant_inquiries_city ON public.restaurant_inquiries(city);

-- Table for cookie preferences
CREATE TABLE IF NOT EXISTS public.cookie_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  analytics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookie_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_messages (public read for own, admin can read all)
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view all contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for restaurant_inquiries (similar to contact_messages)
CREATE POLICY "Anyone can insert restaurant inquiries"
  ON public.restaurant_inquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view all restaurant inquiries"
  ON public.restaurant_inquiries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for cookie_preferences (users can only see/edit their own)
CREATE POLICY "Users can view own cookie preferences"
  ON public.cookie_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cookie preferences"
  ON public.cookie_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cookie preferences"
  ON public.cookie_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_inquiries_updated_at
  BEFORE UPDATE ON public.restaurant_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cookie_preferences_updated_at
  BEFORE UPDATE ON public.cookie_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
