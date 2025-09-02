import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from '@prisma/client';
import productosRouter from "./routes/products.js"; // asegúrate que sea .ts si querés tipado completo

const { PrismaClient } = pkg;
dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req: Request, res: Response) => {
  res.send("API Carrito funcionando");
});

// Rutas
app.use("/products", productosRouter);

// Puerto
const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Servidor en http://200.3.127.46:${PORT}`));