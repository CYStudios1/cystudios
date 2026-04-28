interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div className={className} style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color: 'var(--accent)',
      marginBottom: '20px',
    }}>
      {children}
    </div>
  );
}
