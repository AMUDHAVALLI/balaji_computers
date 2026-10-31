-- PostgreSQL Schema for Puducherry Smart CCTV Website & Lead Generation CRM

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    lead_code VARCHAR(32) UNIQUE NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    location VARCHAR(120) NOT NULL,
    property_type VARCHAR(60) NOT NULL,
    cameras_required VARCHAR(40) NOT NULL,
    service_required VARCHAR(80) NOT NULL DEFAULT 'New installation',
    budget VARCHAR(80) NOT NULL DEFAULT 'Need quotation',
    additional_requirements TEXT,
    privacy_consent BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(40) NOT NULL DEFAULT 'New Lead',
    estimated_amount INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_location ON leads(location);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(60) NOT NULL,
    resolution VARCHAR(40) NOT NULL,
    Summary TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    suitable_for JSONB NOT NULL DEFAULT '[]',
    available_services JSONB NOT NULL DEFAULT '[]',
    price_label VARCHAR(80) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

