import express from 'express';
import router from './routers/router.mjs';

const app = express(); 
 
// const __dirname = import.meta.dirname;

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api', router);
app.use(express.static('../client/dist'));
app.use((error, req, res, next) => {
  console.log(error.message)
  res.status(404).json({ message: error.message });
});



export default app;