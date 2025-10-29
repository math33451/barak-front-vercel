"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🏠 Home page - Estado de autenticação:", isAuthenticated);
    if (typeof window !== "undefined") {
      // Ensure this runs only in the browser
      if (isAuthenticated) {
        console.log("✅ Usuário autenticado - redirecionando para /dashboard");
        router.push("/dashboard");
      } else {
        console.log("❌ Usuário não autenticado - redirecionando para /login");
        router.push("/login");
      }
    }
  }, [isAuthenticated, router]);

  return null; // or a loading spinner
}
