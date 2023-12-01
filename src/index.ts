import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
import context from './context';
import { db } from './db';
import rateLimit from 'express-rate-limit';
import { env } from './env';
import formidable from 'formidable';
import session from 'express-session';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './models/index';

const form = formidable({ multiples: true });

async function parseMultipartForm(req, res, next) {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        req.body = fields;
        req.files = files;
      }
      next();
    });
  } else {
    next();
  }
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: [
        'http://localhost:3000',
        'vercel.app',
        /.vercel.app$/,
        /.apollographql.com$/,
        /.revenuecat.com$/,
      ],
    }),
  );

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 1500,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(
    session({
      secret: 'ergiojergnejiehzepzk',
      resave: false,
      saveUninitialized: false,
      name: 'auth',
      rolling: true,
      cookie: {
        secure: env.APP_ENV === 'local' ? false : true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 10,
        sameSite: env.APP_ENV === 'local' ? undefined : 'none',
      },
    }),
  );

  app.use(express.json());

  // Configuration des routes GraphQL
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema, // Remplacez par votre schéma GraphQL
      context: async ({ req, res }) => {
        return await context({ req, res });
      },
    }),
  );

  // Handle 404 Not Found
  app.get('*', (req, res) => {
    res.sendStatus(404).end();
  });

  const httpServer = http.createServer(app);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.PORT || 4000 }, resolve),
  );
  console.log(`Server ready at http://localhost:${env.PORT ?? 4000}`);
}

startServer();
