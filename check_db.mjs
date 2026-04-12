import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/Mitchell Onuorah/Documents/Invesment/my-app/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('transactions').select('*').limit(1);
    console.log("Tx columns:", data ? Object.keys(data[0] || {}) : "No data", error);
}
check();
