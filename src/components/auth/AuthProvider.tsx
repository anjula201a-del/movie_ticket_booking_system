import { createContext, ReactNode, useContext, useState } from "react";
import { AuthContextType } from "../../models/AuthContextType";
import { TOKEN_KEY } from "../../libs/Token"; 
import { decodeToken, getRolesFromDecoded } from "../../models/ReadRole";

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) return null;
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
return getRolesFromDecoded(decoded)[0] ?? null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const savedToken = localStorage.getItem(TOKEN_KEY);
  const [role, setRole] = useState<string | null>(getRoleFromToken(savedToken));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    getRoleFromToken(savedToken) !== null
  );

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsAuthenticated(true);
    setRole(getRoleFromToken(token));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Should use useAuth within the AuthProvider");
  }
  return context;
};