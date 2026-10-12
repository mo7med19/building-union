import { createClient } from '@supabase/supabase-js';

// استبدل القيم بالبيانات الخاصة بمشروعك من لوحة تحكم Supabase
const SUPABASE_URL = 'https://rhvhldmnzevuytqywqqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodmhsZG1uemV2dXl0cXl3cXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3OTU3MTgsImV4cCI6MjEwNzM3MTcxOH0.Mz7facG7gjKZLRaFZs67RP6Tm8q6jLQB6hBgs5-86os';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);