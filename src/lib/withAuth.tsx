import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;