"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../services/Auth";
import { useI18nContext } from "../../providers/I18nProvider";

interface AuthWrapperProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  loadingMessage?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallbackUrl = "/login",
  loadingMessage
}) => {
  const router = useRouter();
  const { t } = useI18nContext();
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    };

    checkAuth();
  }, [router, fallbackUrl]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loadingMessage || t("common.loading", "Loading...")}
          </p>
        </div>
      </div>
    );
  }

  // Only render children if user is authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-12 w-12 border-2 border-orange-300 mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mb-2">
            {t("common.authRequired", "Please login to access this page")}
          </p>
          <p className="text-sm text-gray-500">
            {t("common.redirecting", "Redirecting to login...")}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;