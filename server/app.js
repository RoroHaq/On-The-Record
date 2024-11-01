import express from 'express';
import router from './routers/router.mjs';

const app = express(); 
 
// const __dirname = import.meta.dirname;

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api', router);
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});



export default app;