import express from 'express';
import process from 'process';
import router from './routes/index';

const port = process.env.PORT || 5000;
const app = express();

// Middleware to control all request sent into a JSON format and maps the route
// blueprint to app
app.use(express.json());

// middleware to register routes
app.use(router);

// starts ports to run and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
