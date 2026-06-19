-- Enable RLS on all public tables
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "virtual_tours" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "saved_properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_photos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_plan_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Note: Because your Express backend connects using the superuser 'postgres' role 
-- or a service role, it bypasses RLS automatically. 
-- By NOT adding any policies here, we effectively DENY ALL access from the 
-- public anon role (PostgREST API), securing your database against unauthorized clients.
