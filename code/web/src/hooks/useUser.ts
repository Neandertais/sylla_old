import { IUser } from "src/types/user";
import useSWR from "swr";

export default function useUser(username?: string) {
  const url = username ? `/users/${username}` : "/users";
  
  const { data, error, isLoading } = useSWR(url, { shouldRetryOnError: false });

  return {
    user: { ...data?.data, socialLinks: data?.data.social_links } as IUser,
    error,
    isLoading,
  };
}
