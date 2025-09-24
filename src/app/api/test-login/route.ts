import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("🧪 Teste de login API - Email:", email);

    // Faz a requisição direta para o backend
    const response = await fetch("http://localhost:8089/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("🧪 Status do backend:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("🧪 Erro do backend:", errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Backend retornou ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("🧪 Dados do backend:", data);

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      hasToken: !!data.token,
      tokenLength: data.token ? data.token.length : 0,
      data,
    });
  } catch (error) {
    console.error("🧪 Erro no teste de login:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno no teste",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
