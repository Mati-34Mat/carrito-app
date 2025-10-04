import { useState } from "react";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenes?: string;
  bloqueado: boolean;
}

interface BlockedProductsProps {
  productos?: Producto[];
  onRefresh: () => void;
}

export default function BlockedProducts({
  productos = [],
  onRefresh,
}: Readonly<BlockedProductsProps>) {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const desbloquearProducto = async (id: number) => {
    try {
      const response = await fetch(`http://${API_HOST}:${API_PORT}/products/desbloquear/${id}`, {
        method: "PATCH",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al desbloquear producto");
      }
      
      setSuccessMessage("Producto desbloqueado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al desbloquear producto");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (!Array.isArray(productos)) return <p>Cargando productos bloqueados...</p>;

  return (
    <div className="h-full max-w-6xl mx-auto flex flex-col gap-6">
      <h2 className="font-serif text-4xl font-semibold mb-6 text-orange-500">
        Productos Bloqueados
      </h2>

      {error && (
        <div className="fixed top-20 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {successMessage && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          ✓ {successMessage}
        </div>
      )}

      {productos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white text-2xl mb-4">🔓 No hay productos bloqueados</p>
          <p className="text-white/80 text-lg">Todos los productos están activos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg shadow-lg p-4 flex flex-col justify-between bg-white/80 relative"
            >
              {/* Botón de desbloquear */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => desbloquearProducto(p.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm font-semibold"
                  title="Desbloquear producto"
                >
                  🔓 Desbloquear
                </button>
              </div>

              {/* Badge de bloqueado */}
              <div className="absolute top-2 left-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  BLOQUEADO
                </span>
              </div>

              {p.imagenes && (
                <img
                  src={`http://${API_HOST}:${API_PORT}${p.imagenes}`}
                  alt={p.nombre}
                  className="w-full h-48 object-cover rounded mb-3 grayscale opacity-70 mt-8"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="mb-3">
                <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">
                  {p.nombre}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{p.descripcion}</p>
                <p className="text-gray-500 text-xs mb-2">Código: {p.codigo}</p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xl font-bold text-gray-500">
                    ${p.precio}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: {p.stock}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic">{p.categoria}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}