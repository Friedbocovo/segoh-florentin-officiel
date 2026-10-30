/** Vrai si un logo personnalisé (autre que l'ancien logo par défaut) a été configuré. */
export function hasCustomLogo(logoUrl?: string | null): boolean {
  return Boolean(logoUrl && logoUrl !== '/logo.png');
}
