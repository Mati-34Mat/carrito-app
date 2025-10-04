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
}

interface ProductListProps {
  productos?: Producto[];
  onRefresh: () => void;
}

export default function ProductList({
  productos = [],
  onRefresh,
}: Readonly<ProductListProps>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Producto>>({});
  const [newImage, setNewImage] = useState<File | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const bloquearProducto = async (id: number) => {
    try {
      await fetch(`http://${API_HOST}:${API_PORT}/products/bloquear/${id}`, {
        method: "PATCH",
      });
      onRefresh();
    } catch (err) {
      console.error("Error al bloquear producto", err);
    }
  };

  const startEditing = (producto: Producto) => {
    setEditingId(producto.id);
    setEditForm(producto);
    setNewImage(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
    setNewImage(null);
  };

  const handleEditChange = (field: keyof Producto, value: string) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const saveEdit = async (id: number) => {
    try {
      const formData = new FormData();
      
      if (editForm.codigo) formData.append("codigo", editForm.codigo);
      if (editForm.nombre) formData.append("nombre", editForm.nombre);
      if (editForm.descripcion) formData.append("descripcion", editForm.descripcion);
      if (editForm.precio) formData.append("precio", editForm.precio.toString());
      if (editForm.stock) formData.append("stock", editForm.stock.toString());
      if (editForm.categoria) formData.append("categoria", editForm.categoria);
      if (newImage) formData.append("imagen", newImage);

      await fetch(`http://${API_HOST}:${API_PORT}/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      setEditingId(null);
      setEditForm({});
      setNewImage(null);
      onRefresh();
    } catch (err) {
      console.error("Error al actualizar producto", err);
    }
  };

  const handleComprar = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  if (!Array.isArray(productos)) return <p>Cargando productos...</p>;

  return (
    <div className="h-full max-w-6xl mx-auto flex flex-col gap-6">
      <h2 className="font-serif text-4xl font-semibold mb-6 text-orange-500">
        Lista de Productos
      </h2>

      {showMessage && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          ¡Producto agregado al carrito! 🛒
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow-lg p-4 flex flex-col justify-between bg-white relative"
          >
            {/* Botones de acción en la esquina superior derecha */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => startEditing(p)}
                className="bg-blue-500 text-white w-8 h-8 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                title="Editar producto"
              >
                ✎
              </button>
              <button
                onClick={() => bloquearProducto(p.id)}
                className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                title="Bloquear producto"
              >
                🗑
              </button>
            </div>

            {editingId === p.id ? (
              // Modo edición
              <div className="space-y-2 mt-8">
                <input
                  type="text"
                  value={editForm.codigo || ""}
                  onChange={(e) => handleEditChange("codigo", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Código"
                />
                <input
                  type="text"
                  value={editForm.nombre || ""}
                  onChange={(e) => handleEditChange("nombre", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  value={editForm.descripcion || ""}
                  onChange={(e) => handleEditChange("descripcion", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Descripción"
                />
                <input
                  type="number"
                  value={editForm.precio || ""}
                  onChange={(e) => handleEditChange("precio", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Precio"
                />
                <input
                  type="number"
                  value={editForm.stock || ""}
                  onChange={(e) => handleEditChange("stock", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Stock"
                />
                <input
                  type="text"
                  value={editForm.categoria || ""}
                  onChange={(e) => handleEditChange("categoria", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Categoría"
                />
                <div>
                  <label className="block text-sm mb-1">Cambiar imagen:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo vista
              <>
                {p.imagenes && (
                  <img
                    src={`http://${API_HOST}:${API_PORT}${p.imagenes}`}
                    alt={p.nombre}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <div className="mb-3">
                  <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">
                    {p.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{p.descripcion}</p>
                  <p className="text-gray-500 text-xs mb-2">Código: {p.codigo}</p>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold text-green-600">
                      ${p.precio}
                    </span>
                    <span className="text-sm text-gray-600">
                      Stock: {p.stock}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 italic">{p.categoria}</p>
                </div>
                <button
                  onClick={handleComprar}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Agregar al Carrito
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}