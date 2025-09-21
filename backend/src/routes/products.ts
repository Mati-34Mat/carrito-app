import express from "express";
import type { Request, Response } from "express";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// Crear producto
router.post("/", async (req: Request, res: Response) => {
  const { codigo, nombre, descripcion, precio, stock, categoria, imagenes } = req.body;
  try {
    const producto = await prisma.producto.create({
      data: { codigo, nombre, descripcion, precio, stock, categoria, imagenes, bloqueado: false },
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
    const productos = await prisma.producto.findMany({ where: { bloqueado: false } });
    res.json(productos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Editar producto
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { codigo, nombre, descripcion, precio, stock, categoria, imagenes } = req.body;
  try {
    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { codigo, nombre, descripcion, precio, stock, categoria, imagenes },
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