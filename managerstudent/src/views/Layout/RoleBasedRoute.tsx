import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface RoleBasedRouteProps {
  children: React.ReactNode; // React Node
  allowedRoles: string[];
  userRole: string; // Single string
}
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  userRole,
  ...rest
}) => {
  const hasAccess = allowedRoles.includes(userRole);
  console.log(hasAccess ? "true" : "false");
  if (hasAccess) {
    return <>{children}</>; // Render children
  } else {
    return <Navigate to="/not-authorized" />;
  }
};

export default RoleBasedRoute;
