/*
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Middleware to add userId to request object
server.use((req, res, next) => {
  const userId = req.params.userId || req.headers['user-id'];
  if (userId) {
    req.userId = userId;
  }
  next();
});

// Use :userId in routes
server.use('/users/:userId', router);

server.listen(3001, () => {
  console.log('JSON Server is running');
});
*/
