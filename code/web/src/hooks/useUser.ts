import useSWR from "swr";

export default function useUser(username?: string) {
  const url = username ? `/users/${username}` : "/users";

  const { data, error, isLoading } = useSWR(url, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  if (data) {
    const { social_links, ...rest } = data?.data;
    const user: User = { ...rest, socialLinks: social_links };

    return { user, error, isLoading };
  }

  return { data , error, isLoading };
}
