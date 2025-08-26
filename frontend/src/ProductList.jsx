import React from "react";

function ProductList({ productos, onRefresh }) {
  const bloquearProducto = async (id) => {
    try {
      await fetch(`http://localhost:3000/productos/bloquear/${id}`, {
        method: "PATCH",
      });
      onRefresh(); // actualizar la lista después de bloquear
    } catch (err) {
      console.error("Error al bloquear producto", err);
    }
  };

  return (
    <div>
      <h2>Lista de productos</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.categoria}</td>
              <td>
                <button onClick={() => bloquearProducto(p.id)}>Bloquear</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
