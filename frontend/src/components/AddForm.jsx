import React, { useState } from "react";

export default function AddForm({ onSuccess }) {
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
      className="bg-transparent p-1 rounded-lg shadow-md max-w-4xl mx-auto mb-8"
    >
      <h2 className="text-3xl font-serif font-semibold mb-4 text-orange-300 text-center">
        Agregar Producto
      </h2>
      <div className="font-serif text-black grid grid-cols-1 gap-3">
        {["codigo", "nombre", "descripcion", "precio", "stock", "categoria", "imagenes"].map(
          (field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="border border-white bg-white/90 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required={["codigo", "nombre", "precio", "stock"].includes(field)}
            />
          )
        )}
        <button
          type="submit"
          className="bg-orange-800 font-serif text-white py-2 rounded hover:bg-orange-900 transition-colors mt-2"
        >
          Agregar
        </button>
      </div>
    </form>
  );
}
