import express from 'express';
import router from './routers/router.mjs';

const app = express(); 
 
// const __dirname = import.meta.dirname;

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api', router);
app.use(express.static('../client/dist'));
app.use((err, req, res, next) => {
  
  const error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error : error.message})
});



export default app;