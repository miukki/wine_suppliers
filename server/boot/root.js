module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/status', server.loopback.status());
  server.use(router);

  // express router
  server.get('/ping', function(req, res) {
    res.send('pong');
  });

};
