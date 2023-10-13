import { createApiUrl } from "@/lib/utils";
import User from "@/typings/User";
import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

let mutex = Promise.resolve();

const lockLocalStorage = async (operation: () => void) => {
  mutex = mutex.then(() => {
    return new Promise<void>((resolve) => {
      operation();
      resolve();
    });
  });
};

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  refetchUser: () => void;
  fetchingUser: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const isInsideApp = router.pathname.startsWith("/app");
  const [fetchingUser, setFetchingUser] = useState(false);

  useEffect(() => {
    lockLocalStorage(() => {
      const storedToken = localStorage.getItem("userToken");
      setToken(storedToken);
    });
  }, []);

  const refetchUser = useCallback(() => {
    lockLocalStorage(() => {
      const storedToken = localStorage.getItem("userToken");
      function handleError(error: Error, reject: any) {
        localStorage.removeItem("userToken");
        reject(error);
      }
      return new Promise<void>((resolve, reject) => {
        try {
          if (storedToken) {
            setFetchingUser(true);
            fetch(createApiUrl("/me"), {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error("User authentication failed");
                }
                return res.json();
              })
              .then((data: User) => {
                setUser(data);
                resolve();
              })
              .catch((error) => {
                handleError(error, reject);
              })
              .finally(() => {
                setFetchingUser(false);
              });
          } else {
            if (isInsideApp) {
              // Uncomment this if you want to handle this case
              // handleError(
              //   new Error(
              //     "User authentication failed because there is no token in localStorage"
              //   ),
              //   reject
              // );
            }
          }
        } catch (error) {
          handleError(error as Error, reject);
        }
      });
    });
  }, [isInsideApp]);

  useEffect(() => {
    refetchUser();
  }, [isInsideApp, refetchUser, router]);

  useEffect(() => {
    lockLocalStorage(() => {
      if (token) {
        localStorage.setItem("userToken", token);
      } else {
        const storedToken = localStorage.getItem("userToken");
        if (storedToken) {
          setToken(storedToken);
        } else {
          localStorage.removeItem("userToken");
        }
      }
    });
  }, [token]);

  return (
    <UserContext.Provider
      value={{ user, setUser, token, setToken, refetchUser, fetchingUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
