import useSWR from "swr";

import { api } from "@services/api";

export default function useUser(username?: string) {
  const { data, error, isLoading } = useSWR(
    username ? `/users/${username}` : "/users",
    api
  );

  return {
    user: data?.user,
    error,
    isLoading,
  };
}
