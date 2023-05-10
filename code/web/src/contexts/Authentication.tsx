import { ReactNode, createContext, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

import useUser from "@hooks/useUser";
import { IUser } from "../types/user";

interface AuthContextProps {
  user?: IUser;
  apiToken?: string;
  signIn: ({}: { user: IUser; token: string }) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 64 }} />} />
      </div>
    );
  }

  const apiToken = localStorage.getItem("sylla.token")!;

  const context: AuthContextProps = {
    user,
    apiToken,
    signIn({ user, token }) {
      localStorage.setItem("sylla.token", token);
    },
    signOut() {
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
