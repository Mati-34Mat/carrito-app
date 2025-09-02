import { Router, Request, Response } from "express";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const router = Router();
const prisma = new PrismaClient();

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

// Obtener productos
router.get("/", async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({ where: { bloqueado: false } });
    res.json(productos);
  } catch (error: any) {
  console.error(error);
  res.status(500).json({ error: "Error al obtener producto" });
}
});

// Editar producto
router.put("/", async (req: Request, res: Response) => {
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
router.patch("/", async (req: Request, res: Response) => {
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