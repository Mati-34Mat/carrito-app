import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

function App() {
  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al obtener productos", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Carrito de compras - Productos</h1>
      <ProductForm onSuccess={fetchProductos} />
      <ProductList productos={productos} onRefresh={fetchProductos} />
    </div>
  );
}

export default App;
