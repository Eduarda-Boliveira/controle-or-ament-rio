import styles from './WelcomeHero.module.css';

export function WelcomeHero() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Bem-vindo ao Controle Financeiro JD
      </h1>
      
      <img 
        src="/vault-illustration.svg" 
        alt="Vault illustration"
        className={styles.image}
      />
    </div>
  );
}
