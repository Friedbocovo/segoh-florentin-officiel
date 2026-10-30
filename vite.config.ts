import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// L'intégration Supabase de Vercel fournit SUPABASE_URL / SUPABASE_ANON_KEY sans le
// préfixe VITE_ : on recopie ces deux valeurs publiques (jamais la clé service_role).
const SUPABASE_ENV_FALLBACKS: Record<string, string[]> = {
  VITE_SUPABASE_URL: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'],
  VITE_SUPABASE_ANON_KEY: [
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_PUBLISHABLE_KEY',
  ],
};

for (const [target, sources] of Object.entries(SUPABASE_ENV_FALLBACKS)) {
  const source = sources.find((name) => process.env[name]);
  if (!process.env[target] && source) process.env[target] = process.env[source];
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
