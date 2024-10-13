import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from './useSession';

export const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const user = useSession();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]); 

    if (!user) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
