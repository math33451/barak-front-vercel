import { httpClient } from "@/infra/httpClient";
import { Agreement, Retorno } from "@/types";

// Backend types
interface BackendBanco {
  idBanco: number;
  nomeBanco: string | null;
  retorno1: number | null;
  retorno2: number | null;
  retorno3: number | null;
  retorno4: number | null;
  retorno5: number | null;
}

const fetchAgreements = async (): Promise<Agreement[]> => {
  try {
    // Buscar apenas bancos (retornos são propriedades dos bancos)
    const bancos = await httpClient.get<BackendBanco[]>("/rest/banco/listar");

    // Mapear todos os bancos válidos para o formato do frontend
    const result = bancos
      .filter((banco) => banco.nomeBanco) // Só incluir bancos com nome
      .map((banco) => {
        const agreement = {
          id: banco.idBanco.toString(),
          unitId: "", // Retornos não são específicos de unidade
          bankId: banco.idBanco.toString(),
          bankName: banco.nomeBanco || "",
          return1: banco.retorno1 ?? 0,
          return2: banco.retorno2 ?? 0,
          return3: banco.retorno3 ?? 0,
          return4: banco.retorno4 ?? 0,
          return5: banco.retorno5 ?? 0,
        } as Agreement;

        return agreement;
      });

    return result;
  } catch (error) {
    console.error("Erro ao buscar acordos:", error);
    return [];
  }
};

const updateRetorno = async (retorno: Retorno): Promise<Retorno> => {
  try {
    const updatedRetorno = await httpClient.post<Retorno>(
      "/rest/retorno",
      retorno
    );
    return updatedRetorno;
  } catch (error) {
    console.error("Erro ao atualizar retorno:", error);
    throw error;
  }
};

export const RetornoService = {
  fetchAgreements,
  updateRetorno,
};
