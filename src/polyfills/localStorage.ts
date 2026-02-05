/**
 * Polyfill robusto para localStorage no ambiente de servidor (SSR)
 * Corrige mocks incorretos e previne erros durante Server-Side Rendering
 */

// Implementação completa e funcional de Storage
class LocalStorageMock implements Storage {
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

// Tipo para global com propriedades Storage opcionais
interface GlobalWithStorage extends NodeJS.Global {
  localStorage?: Storage;
  sessionStorage?: Storage;
}

// Executar apenas no servidor
if (typeof window === "undefined") {
  const globalObj = global as GlobalWithStorage;

  // Criar instância do mock
  const localStorageMock = new LocalStorageMock();
  const sessionStorageMock = new LocalStorageMock();

  // Garantir que getItem, setItem, etc são funções
  Object.defineProperty(globalObj, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
    enumerable: true,
  });

  Object.defineProperty(globalObj, "sessionStorage", {
    value: sessionStorageMock,
    writable: true,
    configurable: true,
    enumerable: true,
  });

  // Verificar se foi injetado corretamente
  if (typeof globalObj.localStorage?.getItem === "function") {
    console.log(
      "✅ [Polyfill] localStorage mock injetado com sucesso no servidor",
    );
  } else {
    console.error("❌ [Polyfill] Falha ao injetar localStorage mock");
  }
}

export {};
