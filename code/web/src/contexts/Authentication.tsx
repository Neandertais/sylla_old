import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Navigate } from "react-router-dom";

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
  const [user, setUser] = useState<IUser | undefined>();
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    const user = localStorage.getItem("sylla.user");
    const token = localStorage.getItem("sylla.token");

    if (!user || !token) return;

    setUser(JSON.parse(user));
    setToken(token);
  }, []);

  const context: IAuthContext = {
    user,
    token,
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

  return user ? <>{children}</> : <Navigate to="/signin" />;
}
