import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { connectDatabase } from './database/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'API de Controle Financeiro',
    version: '1.0.0',
    authentication: 'AWS Cognito',
    endpoints: {
      categories: '/api/categories',
      transactions: '/api/transactions',
      health: '/api/health'
    }
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();

export default app;
