import express from "express";
import type { Request, Response } from "express";
import pkg from "@prisma/client";
import { upload } from "../config/multer.ts";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// Crear producto con imagen
router.post("/", upload.single("imagen"), async (req: Request, res: Response) => {
  const { codigo, nombre, descripcion, precio, stock, categoria } = req.body;
  
  try {
    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : "";
    
    const producto = await prisma.producto.create({
      data: {
        codigo,
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria,
        imagenes: imagenUrl,
        bloqueado: false,
      },
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Error al crear producto" });
  }
});

// Obtener productos activos
router.get("/", async (_req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({ 
      where: { bloqueado: false } 
    });
    res.json(productos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Obtener producto por ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// Editar producto con imagen opcional
router.put("/:id", upload.single("imagen"), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, stock, categoria } = req.body;
  
  try {
    const dataToUpdate: any = {};
    
    if (codigo) dataToUpdate.codigo = codigo;
    if (nombre) dataToUpdate.nombre = nombre;
    if (descripcion) dataToUpdate.descripcion = descripcion;
    if (precio) dataToUpdate.precio = parseFloat(precio);
    if (stock) dataToUpdate.stock = parseInt(stock);
    if (categoria) dataToUpdate.categoria = categoria;
    if (req.file) dataToUpdate.imagenes = `/uploads/${req.file.filename}`;

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Error al editar producto" });
  }
});

// Bloquear producto
router.patch("/bloquear/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { bloqueado: true },
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Error al bloquear producto" });
  }
});

export default router;