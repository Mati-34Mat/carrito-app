import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import productosRouter from "./routes/products.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Carrito funcionando");
});
app.use("/products", productosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));