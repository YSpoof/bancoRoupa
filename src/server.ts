import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateJwtToken } from './utils/server/jwt';
import { accountRoute } from './utils/server/routes/account.get';
import { debugRoute } from './utils/server/routes/debug.get';
import { deleteRoute } from './utils/server/routes/delete.delete';
import { loginRoute } from './utils/server/routes/login.post';
import { logoutRoute } from './utils/server/routes/logout.delete';
import { notFoundRoute } from './utils/server/routes/notFound';
import { refreshRoute } from './utils/server/routes/refresh.post';
import { registerRoute } from './utils/server/routes/register.post';
import { resetRoute } from './utils/server/routes/reset.post';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('/api', express.json());

app.post('/api/login', loginRoute);

app.post('/api/register', registerRoute);

app.post('/api/reset', resetRoute);

app.post('/api/refresh', refreshRoute);

app.delete('/api/delete', validateJwtToken, deleteRoute);

app.get('/api/debug', debugRoute);

app.get('/api/account', validateJwtToken, accountRoute);

app.delete('/api/logout', validateJwtToken, logoutRoute);

app.all('/api/*', notFoundRoute);

// DEFAULT ANGULAR STUFF, DON'T TOUCH BELLOW!
// YOU HAVE BEEN WARNED!

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
