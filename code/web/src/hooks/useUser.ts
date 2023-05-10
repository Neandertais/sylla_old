import { IUser } from "src/types/user";
import useSWR from "swr";

export default function useUser(username?: string) {
  const url = username ? `/users/${username}` : "/users";
  
  const { data, error, isLoading } = useSWR(url);

  return {
    user: data?.data as IUser,
    error,
    isLoading,
  };
}
