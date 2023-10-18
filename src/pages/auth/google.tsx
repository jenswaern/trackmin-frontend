import { Icons } from "@/components/ui/Icons";
import { useUser } from "@/contexts/UserContext";
import { createApiUrl } from "@/lib/utils";
import User from "@/typings/User";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { setUser, setToken } = useUser();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    // Get the state and code from the searchParams
    const state = searchParams.get("state");
    const code = searchParams.get("code");
    const scope = searchParams.get("scope");
    // const { state, code } = router.query;
    if (state && code) {
      // Send the state and code to the server to exchange for an access token
      fetch(createApiUrl(`/auth/google/callback`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state, code, scope }),
      })
        .then((res) => {
          if (!res.ok) {
            // If the response status code is not OK
            throw new Error("Google authentication failed");
          }
          return res.json();
        })
        .then((data: { user: User; api_token: string }) => {
          console.log("data", data);
          if (data.user === null) {
            router.push("/login?error=google-auth-failed");
            return;
          }
          // Set the user in the UserContext
          setUser(data.user);
          setToken(data.api_token);
          // router.push(getRouteLoginAfter(data.user));
          router.push("/app");
        })
        .catch((error) => {
          console.error(error);
          // router.push("/login?error=google-auth-failed");
        });
    }
  }, [router, setUser, setToken, searchParams]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <div>
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </div>
    </main>
  );
}
