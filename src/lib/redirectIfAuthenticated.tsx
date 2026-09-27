"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "@/components/fullPageLoader";
import { getCurrentUser } from "./api";

const redirectIfAuthenticated = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const UnauthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      let isMounted = true;

      getCurrentUser().then((data) => {
        if (!isMounted) return;
        if (data) {
          router.replace("/");
        } else {
          setIsAuthorized(false);
        }
        setIsChecking(false);
      });

      return () => {
        isMounted = false;
      };
    }, [router]);

    if (isChecking) return <FullPageLoader />;
    if (isAuthorized) return null;

    return <WrappedComponent {...props} />;
  };

  return UnauthenticatedComponent;
};

export default redirectIfAuthenticated;