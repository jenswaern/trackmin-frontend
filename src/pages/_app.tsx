import "@/app/globals.css";
import { UserProvider, useUser } from "@/contexts/UserContext";

import type { AppProps } from "next/app";

function AppContent({ Component, pageProps, ...rest }: AppProps) {
  const { user } = useUser();

  return (
    <>
      <div className={`flex flex-col`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <UserProvider>
      <AppContent {...props} />
    </UserProvider>
  );
}
