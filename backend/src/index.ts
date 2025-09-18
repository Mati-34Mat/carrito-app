import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from '@prisma/client';
import productosRouter from "./routes/products.js";

const { PrismaClient } = pkg;
dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();

const PORT: number = Number(process.env.PORT) || 3001;
const SERVER_IP: string = process.env.SERVER_IP || '0.0.0.0';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// Rutas
app.get("/", (req: Request, res: Response) => {
  res.send("API Carrito funcionando");
});

app.use("/products", productosRouter);

app.listen(PORT, SERVER_IP, () =>
  console.log(`Servidor corriendo en http://${SERVER_IP}:${PORT}`)
);