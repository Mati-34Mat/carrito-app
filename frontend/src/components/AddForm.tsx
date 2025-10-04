import React, { useState } from "react";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

interface ProductForm {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
}

interface AddFormProps {
  onSuccess: () => void;
}

export default function AddForm({ onSuccess }: Readonly<AddFormProps>) {
  const [form, setForm] = useState<ProductForm>({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof ProductForm;
    setForm({ ...form, [name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }
      
      // Validar tipo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)");
        return;
      }
      
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("codigo", form.codigo);
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("precio", form.precio);
      formData.append("stock", form.stock);
      formData.append("categoria", form.categoria);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await fetch(`http://${API_HOST}:${API_PORT}/products`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al crear el producto");
      }

      // Limpiar formulario
      setForm({
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
      });
      setImagen(null);
      setPreview("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8"
    >
      <h2 className="text-3xl font-serif font-semibold mb-4 text-orange-300 text-center">
        Agregar Producto
      </h2>

      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded mb-4 animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <div className="font-serif text-black grid grid-cols-1 gap-3">
        {(Object.keys(form) as Array<keyof ProductForm>).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="border border-white bg-white/90 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required={["codigo", "nombre", "precio", "stock"].includes(field)}
            type={field === "precio" || field === "stock" ? "number" : "text"}
            step={field === "precio" ? "0.01" : undefined}
            min={field === "precio" || field === "stock" ? "0" : undefined}
          />
        ))}
        
        <div className="bg-white/90 rounded p-3">
          <label
            htmlFor="imagen"
            className="block text-sm font-medium mb-2"
          >
            Imagen del producto
          </label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" className="h-32 object-cover rounded" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-800 font-serif text-white py-2 rounded hover:bg-orange-900 transition-colors mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Agregando..." : "Agregar"}
        </button>
      </div>
    </form>
  );
}