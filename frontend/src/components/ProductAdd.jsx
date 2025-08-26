import React, { useState } from "react";

export default function ProductAdd({ onSuccess }) {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagenes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock),
        }),
      });
      setForm({
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagenes: "",
      });
      onSuccess();
    } catch (err) {
      console.error("Error al crear producto", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8"
    >
      <h2 className="text-3xl font-semibold mb-4 text-gray-700 text-center">
        Agregar Producto
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {["codigo", "nombre", "descripcion", "precio", "stock", "categoria", "imagenes"].map(
          (field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required={["codigo", "nombre", "precio", "stock"].includes(field)}
            />
          )
        )}
        <button
          type="submit"
          className="bg-purple-700 text-white py-2 rounded hover:bg-purple-900 transition-colors mt-2"
        >
          Agregar
        </button>
      </div>
    </form>
  );
}
