import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    setLoading(true);
    return fetch("http://localhost:8080/login", {
      credentials: "include"
    })
      .then(response => {
        console.log("Response status:", response.status);
        console.log("Content-Type:", response.headers.get("content-type"));

        if (!response.ok) {
          throw new Error("Not logged in");
        }

        return response.text();
      })
      .then(text => {
        console.log("Raw response:", text);

        const data = JSON.parse(text);
        console.log("User object:", data);

        setUser(data);
      })
      .catch(error => {
        console.error("Auth error:", error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    return fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include"
    })
      .catch(error => {
        console.error("Logout error:", error);
      })
      .finally(() => {
        setUser(null);
      });
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    refetchUser: fetchUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}