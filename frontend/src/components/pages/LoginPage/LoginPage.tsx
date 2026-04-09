import { useState } from 'react';
import { signInWithRedirect, signOut } from 'aws-amplify/auth';
import { LoginTemplate } from '../../templates/LoginTemplate/LoginTemplate';

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      setError(null);
      
      await signInWithRedirect();
    } catch (error: any) {
      
      if (error?.message?.includes('already a signed in user')) {
        try {
          await signOut();
          window.location.reload();
        } catch (logoutError) {
          
        }
      }
      
      const errorMessage = error?.message || 'Erro ao tentar fazer login. Verifique as configurações do Cognito.';
      setError(errorMessage);
    }
  }

  return <LoginTemplate onLogin={handleLogin} error={error} />;
}
