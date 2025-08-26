import { Router } from "express";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const router = Router();
const prisma = new PrismaClient();

// Crear producto
router.post("/", async (req, res) => {
  const { codigo, nombre, descripcion, precio, stock, categoria, imagenes } = req.body;
  try {
    const producto = await prisma.producto.create({
      data: { codigo, nombre, descripcion, precio, stock, categoria, imagenes, bloqueado: false },
    });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error al crear producto" });
  }
});

// Obtener productos
router.get("/", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({ where: { bloqueado: false } });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Editar producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, stock, categoria, imagenes } = req.body;
  try {
    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { codigo, nombre, descripcion, precio, stock, categoria, imagenes },
    });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error al editar producto" });
  }
});

// Bloquear producto
router.patch("/bloquear/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { bloqueado: true },
    });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error al bloquear producto" });
  }
});

export default router;