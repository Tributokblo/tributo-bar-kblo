// supabase-client.js — safe scaffold to initialize Supabase client when credentials are provided via environment
// SECURITY: Do NOT hardcode keys here. Set them in your hosting environment (Netlify, Vercel, etc.) and expose to the browser
// through build-time env injection or assign them to window.SUPABASE_URL / window.SUPABASE_ANON_KEY in a secure way.

(function () {
  const url = window.SUPABASE_URL || '';
  const key = window.SUPABASE_ANON_KEY || '';
  window.SupabaseClient = null;

  function init() {
    if (!url || !key) {
      console.warn('Supabase not configured. To enable Supabase, provide SUPABASE_URL and SUPABASE_ANON_KEY to the page (see README).');
      return null;
    }
    try {
      window.SupabaseClient = supabase.createClient(url, key);
      console.info('Supabase client initialized');
      return window.SupabaseClient;
    } catch (e) {
      console.error('Error initializing Supabase client', e);
      return null;
    }
  }

  // initialize on load if creds are present
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // helper to get client
  window.getSupabase = function () { return window.SupabaseClient; };
})();
