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
    // Validar campos requeridos
    if (!codigo || !nombre || !precio || !stock) {
      return res.status(400).json({ error: "Campos requeridos: codigo, nombre, precio, stock" });
    }

    // Validar que el código no exista
    const existente = await prisma.producto.findUnique({
      where: { codigo },
    });

    if (existente) {
      return res.status(400).json({ error: "Ya existe un producto con ese código" });
    }

    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : "";
    
    const producto = await prisma.producto.create({
      data: {
        codigo,
        nombre,
        descripcion: descripcion || "",
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria: categoria || "",
        imagenes: imagenUrl,
        bloqueado: false,
      },
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Error al crear producto" });
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

// Obtener productos bloqueados
router.get("/bloqueados", async (_req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({ 
      where: { bloqueado: true } 
    });
    res.json(productos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos bloqueados" });
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
    // Verificar que el producto existe
    const productoExistente = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Si se cambia el código, verificar que no exista otro producto con ese código
    if (codigo && codigo !== productoExistente.codigo) {
      const codigoExistente = await prisma.producto.findUnique({
        where: { codigo },
      });

      if (codigoExistente) {
        return res.status(400).json({ error: "Ya existe un producto con ese código" });
      }
    }

    const dataToUpdate: any = {};
    
    if (codigo) dataToUpdate.codigo = codigo;
    if (nombre) dataToUpdate.nombre = nombre;
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (precio) {
      const precioNum = parseFloat(precio);
      if (isNaN(precioNum) || precioNum < 0) {
        return res.status(400).json({ error: "Precio inválido" });
      }
      dataToUpdate.precio = precioNum;
    }
    if (stock) {
      const stockNum = parseInt(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ error: "Stock inválido" });
      }
      dataToUpdate.stock = stockNum;
    }
    if (categoria !== undefined) dataToUpdate.categoria = categoria;
    if (req.file) dataToUpdate.imagenes = `/uploads/${req.file.filename}`;

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Error al editar producto" });
  }
});

// Bloquear producto
router.patch("/bloquear/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productoExistente = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (productoExistente.bloqueado) {
      return res.status(400).json({ error: "El producto ya está bloqueado" });
    }

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { bloqueado: true },
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Error al bloquear producto" });
  }
});

// Desbloquear producto
router.patch("/desbloquear/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productoExistente = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExistente) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (!productoExistente.bloqueado) {
      return res.status(400).json({ error: "El producto no está bloqueado" });
    }

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { bloqueado: false },
    });
    res.json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Error al desbloquear producto" });
  }
});

export default router;