import React, { useState } from "react";

function ProductForm({ onSuccess }) {
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
      await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock),
        }),
      });
      // Reset del formulario
      setForm({
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagenes: "",
      });
      onSuccess(); // refrescar lista
    } catch (err) {
      console.error("Error al crear producto", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
     <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
      <input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} required />
      <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
      <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} />
      <input name="imagenes" placeholder="Imágenes (URL)" value={form.imagenes} onChange={handleChange} />
      <button type="submit">Agregar producto</button>
    </form>
  );
}

export default ProductForm;
