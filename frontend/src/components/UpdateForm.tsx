import React, { useState } from "react";

interface FormData {
	codigo: string;
	nombre: string;
	descripcion: string;
	precio: string;
	stock: string;
	categoria: string;
	imagenes: string;
}

type UpdateData = Partial<{
	nombre: string;
	descripcion: string;
	precio: number;
	stock: number;
	categoria: string;
	imagenes: string;
}>;

interface UpdateFormProps {
	onSuccess: () => void;
}

export default function UpdateForm({ onSuccess }: Readonly<UpdateFormProps>) {
	const [form, setForm] = useState<FormData>({
		codigo: "",
		nombre: "",
		descripcion: "",
		precio: "",
		stock: "",
		categoria: "",
		imagenes: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form.codigo) {
			alert("El código es obligatorio para actualizar un producto");
			return;
		}

		try {
			// Obtener ID del producto según código
			const resGet = await fetch(
				`http://200.3.127.46:3001/products?codigo=${form.codigo}`
			);
			if (!resGet.ok) throw new Error("Error al buscar producto por código");
			const data = await resGet.json();

			if (!data.length) {
				alert("No existe un producto con ese código");
				return;
			}

			const productoId = data[0].id;

			// Preparar datos para actualizar solo con campos llenos
			const dataToUpdate: UpdateData = {};
			(Object.keys(form) as Array<keyof FormData>).forEach((key) => {
				if (key === "codigo") return;
				const value = form[key];
				if (value !== "") {
					if (key === "precio") dataToUpdate[key] = parseFloat(value);
					else if (key === "stock") dataToUpdate[key] = parseInt(value);
					else dataToUpdate[key] = value;
				}
			});

			await fetch(`http://200.3.127.46:3001/products/${productoId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(dataToUpdate),
			});

			// Resetear formulario
			setForm({
				codigo: "",
				nombre: "",
				descripcion: "",
				precio: "",
				stock: "",
				categoria: "",
				imagenes: "",
			});

			onSuccess();
		} catch (err) {
			console.error("Error al actualizar producto", err);
			alert("Error al actualizar producto. Revisa la consola.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-transparent p-1 rounded-lg shadow-md max-w-4xl mx-auto mb-8"
		>
			<h2 className="text-3xl font-serif font-semibold mb-4 text-orange-300 text-center">
				Actualizar Producto
			</h2>
			<div className="font-serif text-black grid grid-cols-1 gap-3">
				{[
					"codigo",
					"nombre",
					"descripcion",
					"precio",
					"stock",
					"categoria",
					"imagenes",
				].map((field) => (
					<input
						key={field}
						name={field}
						placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
						value={form[field as keyof FormData]}
						onChange={handleChange}
						className="border border-white bg-white/90 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						required={field === "codigo"} // solo el código obligatorio
					/>
				))}
				<button
					type="submit"
					className="bg-orange-800 font-serif text-white py-2 rounded hover:bg-orange-900 transition-colors mt-2"
				>
					Actualizar
				</button>
			</div>
		</form>
	);
}
