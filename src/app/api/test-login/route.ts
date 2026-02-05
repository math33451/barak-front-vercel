import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    logger.info("Teste de login via API", { email }, "TestLoginAPI");

    // Faz a requisição direta para o backend
    const response = await fetch("http://localhost:8089/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    logger.info(
      "Resposta do backend",
      { status: response.status },
      "TestLoginAPI",
    );

    if (!response.ok) {
      const errorText = await response.text();
      logger.warn(
        "Erro do backend no teste de login",
        { status: response.status, error: errorText },
        "TestLoginAPI",
      );

      return NextResponse.json(
        {
          success: false,
          error: `Backend retornou ${response.status}`,
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    logger.info(
      "Login de teste bem-sucedido",
      { hasToken: !!data.token },
      "TestLoginAPI",
    );

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      hasToken: !!data.token,
      tokenLength: data.token ? data.token.length : 0,
      data,
    });
  } catch (error) {
    logger.error("Erro no teste de login", error, "TestLoginAPI");

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno no teste",
        details: String(error),
      },
      { status: 500 },
    );
  }
}
