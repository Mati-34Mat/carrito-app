import React, { useState, useEffect } from "react";
import AddForm from "./components/AddForm";
import UpdateForm from "./components/UpdateForm";
import ProductList from "./components/ProductList";
import "tailwindcss";

function App() {
  const [productos, setProductos] = useState([]);
  const [activeComponent, setActiveComponent] = useState("list"); // Estado para el componente activo
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para el sidebar

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

  // Función para renderizar el componente activo
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "add":
        return <AddForm onSuccess={fetchProductos} />;
      case "update":
        return <UpdateForm onSuccess={fetchProductos} />;
      case "list":
        return <ProductList productos={productos} onRefresh={fetchProductos} />;
      default:
        return <ProductList productos={productos} onRefresh={fetchProductos} />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 font-serif">
      {/* Título principal */}
      <div className="flex items-center justify-between ml-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-blue-800 text-white p-2 rounded-r-lg hover:bg-blue-900 transition-colors duration-300"
        >
          <span className="text-lg">{isSidebarOpen ? "◂" : "▸"}</span>
        </button>
        <h1 className="text-5xl font-extrabold text-center text-orange-600 flex-1 mt-4">
          Carrito de Compras
        </h1>
        <div className="w-10"></div> {/* Espaciador para centrar el título */}
      </div>
      
      <div className="flex">
        {/* Barra lateral */}
        <div className={`bg-blue-900 rounded-r-lg min-h-screen shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64 p-4' : 'w-16 p-2'
        }`}>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveComponent("list")}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } ${
                activeComponent === "list"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-700 hover:text-white"
              }`}
              title={!isSidebarOpen ? "Ver Productos" : ""}
            >
              <span className="text-sm">☰</span>
              {isSidebarOpen && <span className="ml-3">Ver Productos</span>}
            </button>
            
            <button
              onClick={() => setActiveComponent("add")}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } ${
                activeComponent === "add"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-700 hover:text-white"
              }`}
              title={!isSidebarOpen ? "Agregar Producto" : ""}
            >
              <span className="text-sm">✚</span>
              {isSidebarOpen && <span className="ml-3">Agregar Producto</span>}
            </button>
            
            <button
              onClick={() => setActiveComponent("update")}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              } ${
                activeComponent === "update"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-700 hover:text-white"
              }`}
              title={!isSidebarOpen ? "Actualizar Producto" : ""}
            >
              <span className="text-sm">✎</span>
              {isSidebarOpen && <span className="ml-3">Actualizar Producto</span>}
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default App;