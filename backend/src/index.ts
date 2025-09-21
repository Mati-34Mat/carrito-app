import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productosRouter from "./routes/products.ts"; // sin .ts
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const SERVER_IP = process.env.SERVER_IP || "0.0.0.0";

app.use(cors());
app.use(express.json());
app.use(express.static("src"));

app.get("/", (_req: Request, res: Response) => {
  res.send("API Carrito funcionando");
});

app.use("/products", productosRouter);

app.listen(PORT, SERVER_IP, () =>
  console.log(`Servidor corriendo en http://${SERVER_IP}:${PORT}`)
);