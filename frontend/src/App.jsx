import React, { useState, useEffect } from "react";
import AddForm from "./components/AddForm";
import UpdateForm from "./components/UpdateForm";
import ProductList from "./components/ProductList";
import "tailwindcss";

function App() {
  const [productos, setProductos] = useState([]);
  const [activeComponent, setActiveComponent] = useState("list");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "add":
        return (
          <div className="mt-35 items-center justify-center h-full">
            <AddForm onSuccess={fetchProductos} />
          </div>
        );
      case "update":
        return (
          <div className="mt-35 items-center justify-center h-full">
            <UpdateForm onSuccess={fetchProductos} />
          </div>
        );
      case "list":
        return (
          <div className="mt-15">
            <ProductList productos={productos} onRefresh={fetchProductos} />
          </div>
        );
      default:
        return <ProductList productos={productos} onRefresh={fetchProductos} />;
    }
  };

  return (
    <div className="bg-[url(assets/fondo.webp)] bg-cover bg-center min-h-screen font-serif">
      {/* Header y Sidebar mismo color */}
      <div className="flex items-center justify-between bg-blue-950 p-4 shadow-lg">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-blue-800 text-white p-2 rounded-r-lg hover:bg-blue-900 transition-colors duration-300"
        >
          <span className="text-lg">{isSidebarOpen ? "◂" : "▸"}</span>
        </button>
        <h1 className="text-7xl font-extrabold text-center text-orange-600 flex-1">
          Carrito de Compras
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        {/* Sidebar mismo color que el header */}
        <div
          className={`bg-blue-950 rounded-r-lg min-h-screen shadow-lg transition-all duration-300 ${
            isSidebarOpen ? "w-64 p-4" : "w-16 p-2"
          }`}
        >
          <nav className="space-y-4">
            <button
              onClick={() => setActiveComponent("list")}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } ${
                activeComponent === "list"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-800 hover:text-white"
              }`}
              title={!isSidebarOpen ? "Ver Productos" : ""}
            >
              <span className="text-sm">☰</span>
              {isSidebarOpen && <span className="ml-3">Ver Productos</span>}
            </button>

            <button
              onClick={() => setActiveComponent("add")}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } ${
                activeComponent === "add"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-800 hover:text-white"
              }`}
              title={!isSidebarOpen ? "Agregar Producto" : ""}
            >
              <span className="text-sm">✚</span>
              {isSidebarOpen && <span className="ml-3">Agregar Producto</span>}
            </button>

            <button
              onClick={() => setActiveComponent("update")}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } ${
                activeComponent === "update"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-800 hover:text-white"
              }`}
              title={!isSidebarOpen ? "Actualizar Producto" : ""}
            >
              <span className="text-sm">✎</span>
              {isSidebarOpen && <span className="ml-3">Actualizar Producto</span>}
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">{renderActiveComponent()}</div>
      </div>
    </div>
  );
}

export default App;
