import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Navigate, useLocation } from "react-router-dom";

import { IUser } from "../types/user";

interface IAuthContext {
  user?: IUser;
  token?: string;
  signIn: ({}: { user: IUser; token: string }) => void;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const storedUser = localStorage.getItem("sylla.user");
  const user: IUser | undefined = storedUser && JSON.parse(storedUser);
  const token = localStorage.getItem("sylla.token");

  const context: IAuthContext = {
    user,
    token: token!,
    signIn({ user, token }) {
      localStorage.setItem("sylla.user", JSON.stringify(user));
      localStorage.setItem("sylla.token", token);
    },
    signOut() {
      localStorage.removeItem("sylla.user");
      localStorage.removeItem("sylla.token");
    },
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return user ? <Navigate to="/" /> : <>{children}</>;
}

export function AuthProtected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {user ? (
        { children }
      ) : (
        <Navigate to="/signin" state={{ from: location }} replace />
      )}
    </>
  );
}
