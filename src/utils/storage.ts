/**
 * Wrapper seguro para localStorage que funciona tanto no servidor quanto no cliente
 * Previne erros de "localStorage is not defined" ou "localStorage.getItem is not a function" durante SSR
 */

// Fix para localStorage mockado incorretamente no servidor
if (typeof window === "undefined" && typeof global !== "undefined") {
  // Tipo para global com propriedades Storage opcionais
  type GlobalWithStorage = typeof globalThis & {
    localStorage?: Storage;
    sessionStorage?: Storage;
  };

  const globalObj = global as unknown as GlobalWithStorage;

  // Se localStorage existe mas está quebrado, sobrescrever
  if (
    globalObj.localStorage &&
    typeof globalObj.localStorage.getItem !== "function"
  ) {
    console.log(
      "[SafeStorage Init] Detectado localStorage quebrado no servidor, corrigindo...",
    );

    class LocalStorageMock implements Storage {
      private store = new Map<string, string>();

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
        return Array.from(this.store.keys())[index] || null;
      }

      get length(): number {
        return this.store.size;
      }
    }

    globalObj.localStorage = new LocalStorageMock();
    console.log("[SafeStorage Init] localStorage corrigido no servidor");
  }
}

class SafeStorage {
  private isClient: boolean;
  private isStorageAvailable: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
    this.isStorageAvailable = this.checkAvailability();
  }

  /**
   * Verifica se o localStorage está disponível e funcional
   * Esta verificação é feita apenas uma vez na inicialização
   */
  private checkAvailability(): boolean {
    if (!this.isClient) {
      return false;
    }

    try {
      // Verificar se localStorage existe e tem os métodos necessários
      const ls = window.localStorage;
      if (!ls) return false;

      // Verificar se os métodos são realmente funções
      if (typeof ls.getItem !== "function") return false;
      if (typeof ls.setItem !== "function") return false;
      if (typeof ls.removeItem !== "function") return false;

      // Testar se funciona de verdade
      const testKey = "__storage_test__";
      ls.setItem(testKey, "test");
      const testValue = ls.getItem(testKey);
      ls.removeItem(testKey);

      return testValue === "test";
    } catch (error) {
      console.error("[SafeStorage] localStorage não está disponível:", error);
      return false;
    }
  }

  /**
   * Obtém um item do localStorage de forma segura
   * @param key Chave do item
   * @returns Valor do item ou null se não existir/não disponível
   */
  getItem(key: string): string | null {
    if (!this.isStorageAvailable) {
      return null;
    }

    try {
      // Acessar diretamente via window para evitar problemas com mocks
      const ls = window.localStorage;
      const getItemFn = ls.getItem;

      // Chamar como método bound ao objeto localStorage
      return getItemFn.call(ls, key);
    } catch (error) {
      console.error(`[SafeStorage] Erro ao obter item ${key}:`, error);
      return null;
    }
  }

  /**
   * Define um item no localStorage de forma segura
   * @param key Chave do item
   * @param value Valor a ser armazenado
   * @returns true se salvou com sucesso, false caso contrário
   */
  setItem(key: string, value: string): boolean {
    if (!this.isStorageAvailable) {
      return false;
    }

    try {
      const ls = window.localStorage;
      const setItemFn = ls.setItem;

      setItemFn.call(ls, key, value);
      return true;
    } catch (error) {
      console.error(`[SafeStorage] Erro ao salvar item ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove um item do localStorage de forma segura
   * @param key Chave do item
   * @returns true se removeu com sucesso, false caso contrário
   */
  removeItem(key: string): boolean {
    if (!this.isStorageAvailable) {
      return false;
    }

    try {
      const ls = window.localStorage;
      const removeItemFn = ls.removeItem;

      removeItemFn.call(ls, key);
      return true;
    } catch (error) {
      console.error(`[SafeStorage] Erro ao remover item ${key}:`, error);
      return false;
    }
  }

  /**
   * Limpa todo o localStorage de forma segura
   * @returns true se limpou com sucesso, false caso contrário
   */
  clear(): boolean {
    if (!this.isStorageAvailable) {
      return false;
    }

    try {
      const ls = window.localStorage;
      const clearFn = ls.clear;

      clearFn.call(ls);
      return true;
    } catch (error) {
      console.error("[SafeStorage] Erro ao limpar localStorage:", error);
      return false;
    }
  }

  /**
   * Obtém um item e faz parse de JSON
   * @param key Chave do item
   * @returns Objeto parseado ou null
   */
  getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(
        `[SafeStorage] Erro ao fazer parse de JSON para ${key}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Salva um objeto como JSON
   * @param key Chave do item
   * @param value Objeto a ser salvo
   * @returns true se salvou com sucesso
   */
  setJSON<T>(key: string, value: T): boolean {
    try {
      const json = JSON.stringify(value);
      return this.setItem(key, json);
    } catch (error) {
      console.error(`[SafeStorage] Erro ao converter para JSON ${key}:`, error);
      return false;
    }
  }

  /**
   * Verifica se o storage está disponível
   */
  isAvailable(): boolean {
    return this.isStorageAvailable;
  }
}

// Exportar instância singleton
export const storage = new SafeStorage();

// Exportar classe para casos onde é necessário criar instâncias personalizadas
export { SafeStorage };
