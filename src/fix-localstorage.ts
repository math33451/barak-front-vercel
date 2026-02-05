/**
 * Fix global para localStorage quebrado no servidor
 * Este arquivo DEVE ser importado ANTES de qualquer outro código
 */

// Tipo para global com propriedades Storage opcionais
type GlobalWithStorage = typeof globalThis & {
  localStorage?: Storage;
  sessionStorage?: Storage;
};

// Executar apenas no servidor (Node.js)
if (typeof window === "undefined") {
  const globalObj = global as unknown as GlobalWithStorage;
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("[Fix localStorage] Executando no servidor...");
    console.log(
      "[Fix localStorage] localStorage existe:",
      typeof globalObj.localStorage !== "undefined",
    );
  }

  // Criar implementação funcional de Storage
  class LocalStoragePolyfill implements Storage {
    private store: Map<string, string>;

    constructor() {
      this.store = new Map();
    }

    getItem(key: string): string | null {
      return this.store.get(key) || null;
    }

    setItem(key: string, value: string): void {
      this.store.set(key, String(value));
    }

    removeItem(key: string): void {
      this.store.delete(key);
    }

    clear(): void {
      this.store.clear();
    }

    key(index: number): string | null {
      const keys = Array.from(this.store.keys());
      return keys[index] || null;
    }

    get length(): number {
      return this.store.size;
    }
  }

  // Sempre sobrescrever localStorage no servidor
  const localStoragePolyfill = new LocalStoragePolyfill();
  const sessionStoragePolyfill = new LocalStoragePolyfill();

  // Deletar qualquer definição existente e redefinir
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalObj as any).localStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalObj as any).sessionStorage;

  // Definir com Object.defineProperty para garantir que não seja sobrescrito
  Object.defineProperty(globalObj, "localStorage", {
    value: localStoragePolyfill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  Object.defineProperty(globalObj, "sessionStorage", {
    value: sessionStoragePolyfill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  if (isDev) {
    console.log("[Fix localStorage] ✅ localStorage polyfill instalado");

    // Testar se funciona
    try {
      globalObj.localStorage?.setItem("__test__", "test");
      const value = globalObj.localStorage?.getItem("__test__");
      globalObj.localStorage?.removeItem("__test__");

      if (value === "test") {
        console.log(
          "[Fix localStorage] ✅ Teste passou, localStorage funcional!",
        );
      } else {
        console.error("[Fix localStorage] ❌ Teste falhou: valor incorreto");
      }
    } catch (error) {
      console.error("[Fix localStorage] ❌ Teste falhou:", error);
    }
  }
}

export {};
