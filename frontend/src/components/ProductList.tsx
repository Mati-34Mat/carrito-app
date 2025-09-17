import React from "react";

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

interface ProductListProps {
	productos?: Producto[];
	onRefresh: () => void;
}

export default function ProductList({
	productos = [],
	onRefresh,
}: Readonly<ProductListProps>) {
	const bloquearProducto = async (id: number) => {
		try {
			await fetch(`http://200.3.127.46:3000/products/bloquear/${id}`, {
				method: "PATCH",
			});
			onRefresh();
		} catch (err) {
			console.error("Error al bloquear producto", err);
		}
	};

	if (!Array.isArray(productos)) return <p>Cargando productos...</p>;

	return (
		<div className="max-w-5xl mx-auto">
			<h2 className="font-serif text-4xl font-semibold mb-4 text-orange-500">
				Lista de Productos
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{productos.map((p) => (
					<div
						key={p.id}
						className="border rounded-lg shadow p-4 flex flex-col justify-between bg-white"
					>
						{p.imagenes && (
							<img
								src={p.imagenes}
								alt={p.nombre}
								className="w-full h-40 object-cover rounded mb-3"
							/>
						)}
						<div>
							<h3 className="font-serif font-semibold text-lg text-gray-800">
								{p.nombre}
							</h3>
							<p className="text-gray-600">{p.descripcion}</p>
							<p className="text-gray-500">Código: {p.codigo}</p>
							<p className="mt-2 text-gray-700">
								<span className="font-bold">Precio:</span> ${p.precio} |{" "}
								<span className="font-bold">Stock:</span> {p.stock}
							</p>
							<p className="text-sm text-gray-500">{p.categoria}</p>
						</div>
						<button
							onClick={() => bloquearProducto(p.id)}
							className="mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
						>
							Bloquear
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
