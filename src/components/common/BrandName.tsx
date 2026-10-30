interface BrandNameProps {
  name?: string | null;
  className?: string;
}

/**
 * Logotype texte affiché à côté du monogramme. Les initiales en tête du nom
 * (ex. « MC » dans « MC Florentin ») figurent déjà dans le logo : on ne les répète pas.
 */
export default function BrandName({ name, className = '' }: BrandNameProps) {
  const words = (name?.trim() || 'MC Florentin').split(/\s+/);
  const shown = words.length > 1 && /^[A-Z]{1,3}$/.test(words[0]) ? words.slice(1) : words;

  return <span className={`brand-name ${className}`}>{shown.join(' ')}</span>;
}
