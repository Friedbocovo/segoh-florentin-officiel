interface BrandMarkProps {
  size?: number;
  className?: string;
}

/** Monogramme « C & T » : remplace le logo bitmap tant qu'aucun logo personnalisé n'est défini. */
export default function BrandMark({ size = 44, className = '' }: BrandMarkProps) {
  return (
    <svg
      className={`brand-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      {/* Couronne stylisée */}
      <path
        d="M22 17.5l3.2 4.6L32 15.5l6.8 6.6 3.2-4.6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Garamond, serif"
        fontSize="22"
        fontWeight="400"
        fill="currentColor"
        letterSpacing="0.5"
      >
        C<tspan fontStyle="italic" fontSize="17" dx="1" dy="-1">&amp;</tspan>
        <tspan dx="1" dy="1">T</tspan>
      </text>
    </svg>
  );
}

/** Vrai si un logo personnalisé (autre que l'ancien logo par défaut) a été configuré. */
export function hasCustomLogo(logoUrl?: string | null): boolean {
  return Boolean(logoUrl && logoUrl !== '/logo.png');
}
