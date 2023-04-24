import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../types/user";
import { redirect, useNavigate } from "react-router-dom";

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
