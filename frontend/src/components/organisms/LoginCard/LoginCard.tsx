import { Button } from '../../atoms/Button/Button';
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage';
import { WelcomeHero } from '../../molecules/WelcomeHero/WelcomeHero';
import styles from './LoginCard.module.css';

interface LoginCardProps {
  onLogin: () => void;
  error: string | null;
}

export function LoginCard({ onLogin, error }: LoginCardProps) {
  return (
    <div className={styles.container}>
      <WelcomeHero />
      
      {error && <ErrorMessage message={error} />}
      
      <Button onClick={onLogin}>
        Entrar
      </Button>
    </div>
  );
}
