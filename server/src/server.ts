import express from 'express';
import cors from 'cors';
import compressionRoutes from './routes/compressionRoutes';

export const createServer = () => {
  const app = express();
  
  app.use(cors());  // Add CORS middleware
  app.use(express.json());
  app.use('/api', compressionRoutes);

  return app;
};