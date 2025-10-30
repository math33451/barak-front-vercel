"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function AuthDebug() {
  const { isAuthenticated, token } = useAuth();
  const [storageToken, setStorageToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStorageToken(localStorage.getItem("jwt_token"));
    }
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md shadow-lg z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">isAuthenticated:</span>{" "}
          <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
            {isAuthenticated ? "✅ true" : "❌ false"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Context Token:</span>{" "}
          <span className={token ? "text-green-400" : "text-red-400"}>
            {token ? `✅ ${token.substring(0, 20)}...` : "❌ null"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Storage Token:</span>{" "}
          <span className={storageToken ? "text-green-400" : "text-red-400"}>
            {storageToken
              ? `✅ ${storageToken.substring(0, 20)}...`
              : "❌ null"}
          </span>
        </div>
      </div>
    </div>
  );
}
