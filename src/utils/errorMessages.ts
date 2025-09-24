/**
 * Utilitário para centralizar as mensagens de erro em português
 */

export const ERROR_MESSAGES = {
  // Erros de autenticação
  INVALID_CREDENTIALS: "Email ou senha incorretos",
  USER_NOT_FOUND: "Email ou senha incorretos",
  ACCESS_DENIED: "Acesso negado",
  SESSION_EXPIRED: "Sessão expirada. Faça login novamente",
  ACCOUNT_BLOCKED: "Conta bloqueada. Contate o administrador",
  TOO_MANY_ATTEMPTS: "Muitas tentativas. Aguarde alguns minutos",

  // Erros de validação
  REQUIRED_FIELD: "Este campo é obrigatório",
  INVALID_EMAIL: "Formato de email inválido",
  PASSWORD_TOO_SHORT: "Senha deve ter pelo menos 6 caracteres",
  INVALID_DATA: "Dados inválidos. Verifique os campos",

  // Erros de rede
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet",
  TIMEOUT_ERROR: "Operação demorou muito. Tente novamente",
  SERVER_UNAVAILABLE: "Servidor indisponível. Tente mais tarde",
  INTERNAL_SERVER_ERROR: "Erro interno do servidor",

  // Erros gerais
  UNKNOWN_ERROR: "Erro inesperado. Tente novamente",
  SERVICE_UNAVAILABLE: "Serviço temporariamente indisponível",
  NOT_FOUND: "Recurso não encontrado",
  CONFLICT: "Dados já existem ou estão em uso",

  // Erros específicos do sistema
  EMAIL_ALREADY_EXISTS: "Este email já está cadastrado",
  UNITS_NOT_FOUND: "Unidades não encontradas para este usuário",
  TOKEN_NOT_RECEIVED: "Token de acesso não foi recebido",
} as const;

export const HTTP_STATUS_MESSAGES = {
  400: "Dados inválidos enviados",
  401: "Não autorizado",
  403: "Acesso negado",
  404: "Não encontrado",
  409: "Conflito nos dados",
  422: "Dados inválidos",
  429: "Muitas tentativas",
  500: "Erro interno do servidor",
  502: "Servidor indisponível",
  503: "Serviço indisponível",
  504: "Tempo limite excedido",
} as const;

/**
 * Traduz mensagens de erro comuns do inglês para português
 */
export function translateErrorMessage(message: string): string {
  const translations: Record<string, string> = {
    "User not found": ERROR_MESSAGES.USER_NOT_FOUND,
    "Invalid credentials": ERROR_MESSAGES.INVALID_CREDENTIALS,
    "Email already exists": ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
    "Password too weak": ERROR_MESSAGES.PASSWORD_TOO_SHORT,
    "Invalid email format": ERROR_MESSAGES.INVALID_EMAIL,
    "Required field": ERROR_MESSAGES.REQUIRED_FIELD,
    "Access denied": ERROR_MESSAGES.ACCESS_DENIED,
    "Token expired": ERROR_MESSAGES.SESSION_EXPIRED,
    "Network Error": ERROR_MESSAGES.NETWORK_ERROR,
    Timeout: ERROR_MESSAGES.TIMEOUT_ERROR,
    "Server Error": ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    Unauthorized: ERROR_MESSAGES.INVALID_CREDENTIALS,
    Forbidden: ERROR_MESSAGES.ACCESS_DENIED,
    "Not Found": ERROR_MESSAGES.NOT_FOUND,
    Conflict: ERROR_MESSAGES.CONFLICT,
    "Service Unavailable": ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    // Mensagens em português que podem vir do backend
    "Usuário não encontrado": ERROR_MESSAGES.USER_NOT_FOUND,
    "Email ou senha inválidos": ERROR_MESSAGES.INVALID_CREDENTIALS,
    "Dados inválidos": ERROR_MESSAGES.INVALID_DATA,
  };

  // Procura por correspondências parciais
  for (const [key, translation] of Object.entries(translations)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return translation;
    }
  }

  return message;
}

/**
 * Obtém mensagem de erro baseada no status HTTP
 */
export function getErrorMessageByStatus(status: number): string {
  return (
    HTTP_STATUS_MESSAGES[status as keyof typeof HTTP_STATUS_MESSAGES] ||
    `Erro ${status}`
  );
}

/**
 * Formata erro para exibição ao usuário
 */
export function formatErrorForUser(error: {
  status?: number;
  message?: string;
  code?: string;
}): string {
  // Se tem status HTTP, usa a mensagem específica
  if (error.status) {
    const statusMessage = getErrorMessageByStatus(error.status);

    // Se tem mensagem específica, tenta traduzir
    if (error.message) {
      const translatedMessage = translateErrorMessage(error.message);
      // Se a tradução é diferente da original, usa ela
      if (translatedMessage !== error.message) {
        return translatedMessage;
      }
    }

    return statusMessage;
  }

  // Se tem código de erro específico
  if (error.code) {
    switch (error.code) {
      case "NETWORK_ERROR":
      case "ERR_NETWORK":
        return ERROR_MESSAGES.NETWORK_ERROR;
      case "TIMEOUT":
        return ERROR_MESSAGES.TIMEOUT_ERROR;
      case "ECONNREFUSED":
        return ERROR_MESSAGES.SERVER_UNAVAILABLE;
      default:
        break;
    }
  }

  // Tenta traduzir a mensagem
  if (error.message) {
    return translateErrorMessage(error.message);
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}
