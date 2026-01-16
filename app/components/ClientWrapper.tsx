"use client";

import React, { ReactNode } from "react";

/**
 * ClientWrapper ensures components are rendered only on the client side.
 * Useful for hooks that depend on localStorage or window object.
 */
interface ClientWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({
  children,
  fallback = <div className="p-4 text-gray-400">Loading...</div>,
}) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ClientWrapper;
