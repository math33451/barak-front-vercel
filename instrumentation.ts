/**
 * Instrumentation file for Next.js
 * This file is loaded before any other code in the application
 * Perfect place to load polyfills and setup global configurations
 */

export async function register() {
  // Nota: logger ainda não está disponível aqui (carrega antes de tudo)
  // Usar console apenas se absolutamente necessário para debugging do polyfill
  const isServer = typeof window === "undefined";
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("🔧 [Instrumentation] register() chamado");
    console.log(
      "🔧 [Instrumentation] Ambiente:",
      isServer ? "servidor" : "cliente",
    );
  }

  // Carregar fix de localStorage PRIMEIRO (apenas no servidor)
  if (isServer) {
    if (isDev) {
      console.log("🔧 [Instrumentation] Carregando fix de localStorage...");
    }

    await import("./src/fix-localstorage");

    if (isDev) {
      console.log("🔧 [Instrumentation] Fix carregado");

      // Verificar se funcionou
      const globalObj = global as unknown as {
        localStorage?: Storage;
      };

      console.log(
        "🔧 [Instrumentation] localStorage disponível:",
        typeof globalObj.localStorage !== "undefined",
      );
      console.log(
        "🔧 [Instrumentation] localStorage.getItem é função:",
        typeof globalObj.localStorage?.getItem === "function",
      );
    }

    // Carregar polyfill adicional se necessário
    await import("./src/polyfills/localStorage");
  }
}
