import { Icons } from "@/components/ui/Icons";
import { useUser } from "@/contexts/UserContext";
import { createApiUrl, getRouteLoginAfter } from "@/lib/utils";
import User from "@/typings/User";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { setUser, setToken } = useUser();

  useEffect(() => {
    if (!router.isReady) return;
    const { state, code } = router.query;
    if (state && code) {
      // Send the state and code to the server to exchange for an access token
      fetch(createApiUrl(`/auth/google/callback`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(router.query),
      })
        .then((res) => {
          if (!res.ok) {
            // If the response status code is not OK
            throw new Error("Google authentication failed");
          }
          return res.json();
        })
        .then((data: { user: User; api_token: string }) => {
          if (data.user === null) {
            router.push("/login?error=google-auth-failed");
            return;
          }
          // Set the user in the UserContext
          setUser(data.user);
          setToken(data.api_token);
          router.push(getRouteLoginAfter(data.user));
        })
        .catch((error) => {
          console.error(error);
          router.push("/login?error=google-auth-failed");
        });
    }
  }, [router, setUser, setToken]); // Dependency on router.asPath

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <div>
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </div>
    </main>
  );
}
