import { jwtDecode } from "jwt-decode";
import { TOKEN_KEY } from "../libs/Token";

export interface DecodedToken {
  sub?: string;
  exp?: number;
  roles?: any;
  role?: any;
  authorities?: any;
  userId?: any;
}
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export const extractRoles = (roles: any): string[] => {
  if (!roles) return [];
  if (typeof roles === "string") return [roles];
  if (Array.isArray(roles)) {
    return roles.map((r) =>
      typeof r === "string" ? r : r.authority ?? r.name ?? r.role ?? ""
    );
  }
  return [];
};


export const getRolesFromDecoded = (decoded: DecodedToken): string[] =>
  extractRoles(decoded.roles ?? decoded.role ?? decoded.authorities);


export const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const decoded = decodeToken(token);
  const id = decoded?.userId;
  return id ? String(id) : null;
};