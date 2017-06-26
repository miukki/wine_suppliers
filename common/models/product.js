'use strict';

module.exports = function(Product) {

  //http://loopback.io/doc/en/lb2/Using-current-context.html#use-current-authenticated-user-in-remote-methods
  //how to use context
  Product.beforeRemote('create', function(context, user, next) {
    var req = context.req;
    req.body.supplierId = req.accessToken.userId;
    next();
  });

};
