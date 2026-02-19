import express from 'express';
import { createServer } from 'http';
import travelRoutes from './routes/travelRoutes';

const app = express();
app.use(express.json());

// Register modular routes
app.use('/api', travelRoutes);

(async () => {
  const server = createServer(app);

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log("serving on port " + PORT);
  });
})();
