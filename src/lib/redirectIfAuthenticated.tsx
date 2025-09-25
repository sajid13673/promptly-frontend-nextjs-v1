"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "@/components/fullPageLoader";

const redirectIfAuthenticated = <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) => {
  const UnauthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/");
      } else {
        setIsAuthorized(false);
      }
      setIsChecking(false);
    }, []);

    if (isChecking) return <FullPageLoader />;
    if (isAuthorized) return null;

    return <WrappedComponent {...props} />;
  };

  return UnauthenticatedComponent;
};

export default redirectIfAuthenticated;