"use client";

import { useState } from "react";

export default function RetornoForm() {
  const [retorno1, setRetorno1] = useState(0);
  const [retorno2, setRetorno2] = useState(0);
  const [retorno3, setRetorno3] = useState(0);
  const [retorno4, setRetorno4] = useState(0);
  const [retorno5, setRetorno5] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission logic
    console.log("Retornos:", {
      retorno1,
      retorno2,
      retorno3,
      retorno4,
      retorno5,
    });
    alert("Dados salvos no console!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Configurar Retornos</h3>

      {/* Retorno 1 */}
      <div>
        <label
          htmlFor="retorno1"
          className="block text-sm font-medium text-gray-700"
        >
          Retorno 1 (%)
        </label>
        <input
          id="retorno1"
          type="number"
          step="0.01"
          value={retorno1}
          onChange={(e) => setRetorno1(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Retorno 2 */}
      <div>
        <label
          htmlFor="retorno2"
          className="block text-sm font-medium text-gray-700"
        >
          Retorno 2 (%)
        </label>
        <input
          id="retorno2"
          type="number"
          step="0.01"
          value={retorno2}
          onChange={(e) => setRetorno2(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Retorno 3 */}
      <div>
        <label
          htmlFor="retorno3"
          className="block text-sm font-medium text-gray-700"
        >
          Retorno 3 (%)
        </label>
        <input
          id="retorno3"
          type="number"
          step="0.01"
          value={retorno3}
          onChange={(e) => setRetorno3(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Retorno 4 */}
      <div>
        <label
          htmlFor="retorno4"
          className="block text-sm font-medium text-gray-700"
        >
          Retorno 4 (%)
        </label>
        <input
          id="retorno4"
          type="number"
          step="0.01"
          value={retorno4}
          onChange={(e) => setRetorno4(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Retorno 5 */}
      <div>
        <label
          htmlFor="retorno5"
          className="block text-sm font-medium text-gray-700"
        >
          Retorno 5 (%)
        </label>
        <input
          id="retorno5"
          type="number"
          step="0.01"
          value={retorno5}
          onChange={(e) => setRetorno5(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Salvar
      </button>
    </form>
  );
}
