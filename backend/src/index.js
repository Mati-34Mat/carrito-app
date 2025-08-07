import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import productosRouter from './routes/productos.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();