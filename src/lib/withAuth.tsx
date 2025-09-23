"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "@/components/fullPageLoader";

const withAuth = <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
      setIsChecking(false);
    }, []);

    if (isChecking) return <FullPageLoader />;
    if (!isAuthorized) return null;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;