import express from 'express';
import axios from 'axios';
import routes from './routes/routes.js';
import 'dotenv/config';

const router = express();
axios.defaults.headers.common['X-Auth-Token'] = process.env.X_Auth_Token;
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/* This is a middleware that allows the server to accept requests from other domains. */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With,Content-Type,Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET');
    return res.status(200).json({});
  }
  next();
});

router.use('/', routes);
router.listen(process.env.PORT, () =>
  console.log(`The server is running on port ${process.env.PORT}`)
);
