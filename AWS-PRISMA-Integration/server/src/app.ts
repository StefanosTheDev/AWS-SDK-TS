import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // parse JSON bodies

// GET all users
app.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err); // Use next for error handling, Express will catch and handle it
  }
});

// POST create user
app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err); // Use next for error handling
  }
});

// Error handling middleware should be added after all other routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: String(err) });
});

export default app;
