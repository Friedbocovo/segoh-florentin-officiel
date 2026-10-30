import { FormEvent, useState } from 'react';
import { ArrowUpRight, Crown, LoaderCircle, Lock, Mail, ShieldAlert } from 'lucide-react';
import { DataService, isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';
import BrandMark from '@/components/common/BrandMark';
import BrandName from '@/components/common/BrandName';
import { hasCustomLogo } from '@/lib/brand';

interface AdminLoginProps {
  settings: SiteSettings;
  onExit: () => void;
  onLoginSuccess: () => void;
  /** Vrai si une session existe mais que le compte n'est pas administrateur */
  notAdmin?: boolean;
}

export default function AdminLogin({ settings, onExit, onLoginSuccess, notAdmin = false }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    notAdmin ? 'Ce compte n’a pas les droits d’administration. Contactez le propriétaire du site.' : ''
  );

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase n’est pas configuré (voir le fichier .env).');
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Un compte Supabase valide ne suffit pas : il doit figurer dans la table admin_users
      if (!(await DataService.isCurrentUserAdmin())) {
        await supabase.auth.signOut();
        throw new Error('Ce compte n’a pas les droits d’administration.');
      }
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Identifiants invalides ou service temporairement indisponible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <div className="auth-card">
        <button className="brand auth-brand" onClick={onExit}>
          {hasCustomLogo(settings.logo_url) ? <img src={settings.logo_url} alt="" /> : <BrandMark size={36} />}
          <BrandName name={settings.site_name} />
        </button>

        <p className="kicker"><span /> Espace d’Administration Sécurisé</p>
        <h1>Bienvenue en coulisses</h1>
        <p className="auth-sub">
          Connectez-vous pour gérer les concours, les résultats, la gastronomie et les messages.
        </p>

        <form onSubmit={handleAuth} className="styled-auth-form">
          <label>
            Adresse e-mail
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@couronne-toque.fr"
              />
            </div>
          </label>

          <label>
            Mot de passe
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </label>

          {errorMsg && (
            <div className="auth-error-notice">
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button className="button button-dark full-width mt-3" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={17} /> : <ArrowUpRight size={16} />}
            <span>{loading ? 'Vérification...' : 'Se connecter'}</span>
          </button>
        </form>

        <div className="auth-card-footer">
          <button type="button" className="back-to-site" onClick={onExit}>
            ← Retourner sur le site public
          </button>
        </div>
      </div>
    </main>
  );
}
