import { useEffect, useState, useRef } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { LoadingSpinner } from './components/atoms/LoadingSpinner/LoadingSpinner';
import { LoginPage } from './components/pages/LoginPage/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage/DashboardPage';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const checkUserCalled = useRef(false);

  useEffect(() => {
    if (checkUserCalled.current) return;
    checkUserCalled.current = true;
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      
      let userData: any = {
        ...currentUser,
        displayName: currentUser.username
      };
      
      try {
        const attributes = await fetchUserAttributes();
        userData.attributes = attributes;
        userData.displayName = attributes.name || attributes.email || currentUser.username;
      } catch (attrError: any) {
        try {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;
          if (idToken && typeof idToken === 'object' && 'payload' in idToken) {
            const payload = idToken.payload as any;
            userData.displayName = payload.name || payload.email || currentUser.username;
            userData.attributes = {
              email: payload.email,
              name: payload.name
            };
          }
        } catch (sessionError) {
        }
      }
      
      setUser(userData);
    } catch (error: any) {
      if (error?.name === 'NotAuthorizedException') {
        try {
          await signOut();
        } catch (e) {
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <DashboardPage user={user} onLogout={() => setUser(null)} />;
}

export default App;
