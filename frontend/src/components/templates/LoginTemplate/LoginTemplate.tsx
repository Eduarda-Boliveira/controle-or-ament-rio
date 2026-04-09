import { Header } from '../../organisms/Header/Header';
import { Footer } from '../../organisms/Footer/Footer';
import { LoginCard } from '../../organisms/LoginCard/LoginCard';
import styles from './LoginTemplate.module.css';

interface LoginTemplateProps {
  onLogin: () => void;
  error: string | null;
}

export function LoginTemplate({ onLogin, error }: LoginTemplateProps) {
  return (
    <div className={styles.container}>
      <Header />
      <LoginCard onLogin={onLogin} error={error} />
      <Footer />
    </div>
  );
}
