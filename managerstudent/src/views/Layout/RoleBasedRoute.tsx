import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface RoleBasedRouteProps {
  children: React.ReactNode; // React Node
  allowedRoles: string[];
  userRole: string[];
}
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  userRole,
  ...rest
}) => {
  const hasAccess = allowedRoles.some((item) => userRole.includes(item));
  if (hasAccess) {
    return <>{children}</>; // Render children
  } else {
    return <Navigate to="/not-authorized" />;
  }
};

export default RoleBasedRoute;
