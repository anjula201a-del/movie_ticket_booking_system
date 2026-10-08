export interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}