import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/me", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
  // call to logout
  const logout = async () => {
    try {
        const response = await fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/";
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

export function useAuth() {
  return useContext(AuthContext);
}