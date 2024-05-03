
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://dnkrawdtqitmuehkyrfg.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua3Jhd2R0cWl0bXVlaGt5cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1NzcyMjEsImV4cCI6MjAyNjE1MzIyMX0.UN70JJaoxtR1feDJQrSW3OmMPFXZLHCezebiP-wsrvc";
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;