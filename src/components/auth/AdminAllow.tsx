import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface AdminAllowProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AdminAllow = ({ children, allowedRoles }: AdminAllowProps) => {
  const { isAuthenticated, role } = useAuth();


  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  const cleanRole = role?.replace("ROLE_", "");

  if (allowedRoles && (!cleanRole || !allowedRoles.includes(cleanRole))) {
    return <Navigate to="/NotAdmin" replace />;
  }

  return <>{children}</>;
};

export default AdminAllow;