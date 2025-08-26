import React, { useState, useEffect } from "react";
import ProductAdd from "./components/ProductAdd";
import ProductUpdate from "./components/ProductUpdate";
import ProductList from "./components/ProductList";
import "tailwindcss";

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
    <div className="min-h-screen bg-emerald-200 p-6">
      <h1 className="text-6xl font-extrabold text-center text-gray-900 mb-12">
        Carrito de Compras
      </h1>
      <ProductAdd onSuccess={fetchProductos} />
      <ProductUpdate onSuccess={fetchProductos} />
      <ProductList productos={productos} onRefresh={fetchProductos} />
    </div>
  );
}

export default App;
