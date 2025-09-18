import React, { useState, useEffect } from "react";
import AddForm from "./components/AddForm";
import UpdateForm from "./components/UpdateForm";
import ProductList from "./components/ProductList";

interface Producto {
	id: number;
	codigo: string;
	nombre: string;
	descripcion: string;
	precio: number;
	stock: number;
	categoria: string;
	imagenes?: string;
}

type ActiveComponent = "list" | "add" | "update";

function App() {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [activeComponent, setActiveComponent] =
		useState<ActiveComponent>("list");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const fetchProductos = async () => {
		try {
			const res = await fetch("http://200.3.127.46:3001/products");
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
			case "update":
				return (
					<div className="mt-12 flex justify-center">
						<UpdateForm onSuccess={fetchProductos} />
					</div>
				);
			case "list":
			default:
				return (
					<div className="mt-6">
						<ProductList productos={productos} onRefresh={fetchProductos} />
					</div>
				);
		}
	};

	return (
		<div className="bg-[url(assets/fondo.webp)] bg-cover bg-center min-h-screen font-serif">
			{/* Header */}
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
				<div className="w-10" />
			</div>

			<div className="flex">
				{/* Sidebar */}
				<div
					className={`bg-blue-950 rounded-r-lg min-h-screen shadow-lg transition-all duration-300 ${
						isSidebarOpen ? "w-64 p-4" : "w-16 p-2"
					}`}
				>
					<nav className="space-y-4">
						{[
							{ key: "list", label: "Ver Productos", icon: "☰" },
							{ key: "add", label: "Agregar Producto", icon: "✚" },
							{ key: "update", label: "Actualizar Producto", icon: "✎" },
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
				</div>

				{/* Contenido principal */}
				<div className="flex-1 p-6">{renderActiveComponent()}</div>
			</div>
		</div>
	);
}

export default App;
