import { useState, useEffect } from "react";
import AddForm from "./components/AddForm";
import ProductList from "./components/ProductList";
import { Producto } from "./types/Product.ts";

type ActiveComponent = "list" | "add";
const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("list");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchProductos = async () => {
    try {
      const res = await fetch(`http://${API_HOST}:${API_PORT}/products`);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data: Producto[] = await res.json();
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
          <div className="mt-12 flex justify-center">
            <AddForm onSuccess={fetchProductos} />
          </div>
        );
      case "list":
      default:
        return (
          <div className="mt-6">
            <ProductList
              productos={productos}
              onRefresh={fetchProductos}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-[url(./assets/fondo.webp)] bg-cover bg-center min-h-screen font-serif">
      {/* Header */}
      <header className="flex items-center justify-between bg-blue-950 p-4 shadow-lg fixed top-0 left-0 w-full z-20 h-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-blue-800 text-white p-2 rounded-r-lg hover:bg-blue-900 transition-colors duration-300"
        >
          <span className="text-lg">{isSidebarOpen ? "◂" : "▸"}</span>
        </button>
        <h1 className="text-7xl font-extrabold text-center text-orange-600 flex-1">
          Carrito de Compras
        </h1>
        <div className="w-10" />
      </header>

      {/* Sidebar */}
      <aside
				className={`bg-blue-950 shadow-lg fixed top-20 left-0 h-[calc(100vh-5rem)] transition-all duration-300 z-10 ${
					isSidebarOpen ? "w-64 p-4" : "w-16 p-2"
				}`}
			>
        <nav className="space-y-4">
          {[
            { key: "list", label: "Ver Productos", icon: "☰" },
            { key: "add", label: "Agregar Producto", icon: "✚" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveComponent(btn.key as ActiveComponent)}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } ${
                activeComponent === btn.key
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-white hover:bg-blue-800 hover:text-white"
              }`}
              title={!isSidebarOpen ? btn.label : ""}
            >
              <span className="text-sm">{btn.icon}</span>
              {isSidebarOpen && <span className="ml-3">{btn.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="ml-16 md:ml-64 pt-20 p-6 overflow-auto h-[calc(100vh-5rem)]">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;
