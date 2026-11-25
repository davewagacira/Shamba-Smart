export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#2e6526" />
      <path d="M16 25V13" stroke="#faf7f0" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17c-5 0-8-3-8-8 5 0 8 3 8 8Z" fill="#b9dbb0" />
      <path d="M16 14c0-4.5 3-7.5 8-7.5 0 4.5-3 7.5-8 7.5Z" fill="#f2b632" />
      <path d="M8 25h16" stroke="#d9b68c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
