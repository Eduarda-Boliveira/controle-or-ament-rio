import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export function Header({ userName, onLogout }: HeaderProps = {}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <h2 className={styles.title}>Controle Financeiro JD</h2>
        </div>
        {userName && (
          <div className={styles.userContainer} ref={dropdownRef}>
            <button 
              className={styles.userButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className={styles.userName}>{userName}</span>
            </button>
            
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <button 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout?.();
                  }}
                >
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"></path>
                    <path d="M16 17L21 12L16 7"></path>
                    <path d="M21 12H9"></path>
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
