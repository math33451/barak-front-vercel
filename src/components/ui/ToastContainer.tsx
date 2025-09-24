"use client";

interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "warning" | "info";
  duration?: number;
}

// Componente Toast para renderizar as notificações
export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-lg shadow-lg border max-w-sm transition-all duration-300
            ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : ""
            }
            ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : ""
            }
            ${
              toast.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : ""
            }
            ${
              toast.type === "info"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : ""
            }
          `}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium pr-2">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Fechar notificação"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
