import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'default' | 'sm';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  dataEn?: string;
  dataKr?: string;
  href?: string;
}

export function Button({ children, variant = 'primary', size = 'default', onClick, className = '', dataEn, dataKr, href }: ButtonProps) {
  const cls = [
    styles.btn,
    variant === 'outline' ? styles.outline : '',
    size === 'sm' ? styles.sm : '',
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" data-en={dataEn} data-kr={dataKr}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick} data-en={dataEn} data-kr={dataKr}>
      {children}
    </button>
  );
}
