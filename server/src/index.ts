import { createServer } from './server';
import { PORT } from './config/env';

const startServer = () => {
  const app = createServer();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();