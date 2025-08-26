import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

function App() {
  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      if (!res.ok) throw new Error("Error al obtener productos");
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Carrito de Compras
      </h1>
      <ProductForm onSuccess={fetchProductos} />
      <ProductList productos={productos} onRefresh={fetchProductos} />
    </div>
  );
}

export default App;
