import { Fragment, type ReactNode } from 'react';

/**
 * Mise en forme légère des titres saisis dans l'admin :
 * - *texte* → italique doré ;
 * - « | » → retour à la ligne.
 * Avec autoBreak, un titre sans « | » passe à la ligne après sa première virgule.
 */
export function rich(text: string | null | undefined, autoBreak = false): ReactNode {
  if (!text) return null;
  const source = text.includes('|') || !autoBreak ? text : text.replace(/^([^,]+,\*?)\s+/, '$1 | ');
  return source.split('|').map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line
        .trim()
        .split('*')
        .map((part, index) => (index % 2 === 1 ? <em key={index}>{part}</em> : part))}
    </Fragment>
  ));
}

/** Texte brut (sans les marqueurs * et |), pour les aperçus de l'admin. */
export function plain(text: string | null | undefined): string {
  return (text || '').replace(/\*/g, '').replace(/\s*\|\s*/g, ' ');
}
