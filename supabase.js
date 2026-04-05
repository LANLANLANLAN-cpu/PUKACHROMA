import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://eljtbcyjxrktbzfytdrt.supabase.co'
const supabaseKey = 'sb_publishable_BLec6NUqEXDFvvr_8g5HKg_4RJHvLtU'

export const supabase = createClient(supabaseUrl, supabaseKey)
