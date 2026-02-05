"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/utils/logger";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    logger.debug("Verificando autenticação", { isAuthenticated }, "HomePage");

    if (isAuthenticated) {
      logger.navigation("/", "/dashboard");
      router.push("/dashboard");
    } else {
      logger.navigation("/", "/login");
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Carregando...
      </div>
    );
  }

  return null;
}
