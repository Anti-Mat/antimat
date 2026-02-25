// Подключение Supabase
const SUPABASE_URL = 'https://xlifaeppnxpdisjgwaex.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dw0s1Zka29BXoAx6MHlU1g_rAxAoae8';

// Загружаем Supabase SDK
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
