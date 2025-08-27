import React, { useState } from "react";

export default function UpdateForm({ onSuccess }) {
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

    if (!form.codigo) {
      alert("El código es obligatorio para actualizar un producto");
      return;
    }

    try {
      const resGet = await fetch(`http://localhost:3000/products?codigo=${form.codigo}`);
      if (!resGet.ok) throw new Error("Error al buscar producto por código");
      const data = await resGet.json();

      if (!data.length) {
        alert("No existe un producto con ese código");
        return;
      }

      const productoId = data[0].id;

      const dataToUpdate = {};
      Object.keys(form).forEach((key) => {
        if (key !== "codigo" && form[key] !== "") {
          if (key === "precio") dataToUpdate[key] = parseFloat(form[key]);
          else if (key === "stock") dataToUpdate[key] = parseInt(form[key]);
          else dataToUpdate[key] = form[key];
        }
      });

      await fetch(`http://localhost:3000/products/${productoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
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
      console.error("Error al actualizar producto", err);
      alert("Error al actualizar producto. Revisa la consola.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8"
    >
      <h2 className="text-3xl font-semibold mb-4 text-gray-700 text-center">
        Actualizar Producto
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
              required={field === "codigo"} // solo el código obligatorio
            />
          )
        )}
        <button
          type="submit"
          className="bg-purple-700 text-white py-2 rounded hover:bg-purple-900 transition-colors mt-2"
        >
          Actualizar
        </button>
      </div>
    </form>
  );
}
