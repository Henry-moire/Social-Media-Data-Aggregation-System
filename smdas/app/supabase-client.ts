import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mdkrlivlpdribobmczwx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ka3JsaXZscGRyaWJvYm1jend4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjAyMTcsImV4cCI6MjA2NjkzNjIxN30.BiDZxFOLVoOPKLHXCuiqMrEEgu6CN7iKonEROKF9alM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
