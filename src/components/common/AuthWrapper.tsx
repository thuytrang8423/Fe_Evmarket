"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../services/Auth";

interface AuthWrapperProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallbackUrl = "/login"
}) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        // Redirect to fallback URL if not authenticated
        router.push(fallbackUrl);
        return;
      }
      
      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, fallbackUrl]);

  // If not authorized yet, don't render anything (will redirect)
  if (!isAuthorized) {
    return null;
  }

  // Render children immediately - they will show their own skeleton UI
  return <>{children}</>;
};

export default AuthWrapper;